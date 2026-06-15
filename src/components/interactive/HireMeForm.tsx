'use client';

import { useState, useEffect } from 'react';
import { submitHireRequest, getExistingHireRequest } from '@/app/hire-actions';
import { executeCaptcha } from './CaptchaValidator';
import { WorkLocation, JobType } from '@/generated/prisma/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface HireMeFormProps {
  dict: Record<string, string>;
}

interface ExistingHireRequest {
  company: string;
  jobTitle: string | null;
  location: WorkLocation;
  jobType: JobType;
  salary: string | null;
  reason: string;
}

export default function HireMeForm({ dict }: HireMeFormProps) {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [existingData, setExistingData] = useState<ExistingHireRequest | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getExistingHireRequest();
        if (data) {
          setExistingData(data);
        }
      } catch (err) {
        console.error("Failed to load existing request", err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);

    // Execute v3 captcha
    const token = await executeCaptcha('hire_me');
    
    if (!token) {
      setError(dict.Invalid_Captcha || "Captcha verification failed");
      setLoading(false);
      return;
    }
    
    const formData = new FormData(form);
    const result = await submitHireRequest(formData, token);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-theme-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow text-center">
        <h2 className="text-2xl font-bold text-theme-500 mb-6">{dict.Hire_Success}</h2>
        <Link
          href={`/${lang}`}
          className="inline-block px-8 py-3 rounded-xl bg-theme-500 text-white font-bold hover:bg-theme-400 transition-all active:scale-[0.98]"
        >
          {dict.Home}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow">
      <h1 className="text-3xl font-bold mb-2 nav-active-gacor">
        {existingData ? (dict.Edit_Profile || 'Edit Request') : dict.Hire_Me}
      </h1>
      <p className="text-theme-muted mb-8">
        {existingData ? (dict.Hire_Already_Submitted || 'You have already submitted a request. You can edit it below.') : dict.Hire_Me_Description}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Company}</label>
            <input
              name="company"
              type="text"
              required
              defaultValue={existingData?.company || ''}
              placeholder={dict.Placeholder_Company || "Microsoft, Google, etc."}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Job_Title || 'Job Title'}</label>
            <input
              name="jobTitle"
              type="text"
              defaultValue={existingData?.jobTitle || ''}
              placeholder={dict.Placeholder_Job_Title || "Full Stack Engineer"}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Location || 'Location'}</label>
            <select
              name="location"
              defaultValue={existingData?.location || 'ONLINE'}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            >
              <option value="ONLINE">{dict.Location_Online || 'Online'}</option>
              <option value="HYBRID">{dict.Location_Hybrid || 'Hybrid'}</option>
              <option value="OFFLINE">{dict.Location_Offline || 'Offline'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Job_Type || 'Job Type'}</label>
            <select
              name="jobType"
              defaultValue={existingData?.jobType || 'FULL_TIME'}
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            >
              <option value="FULL_TIME">{dict.Job_Type_Full_Time || 'Full Time'}</option>
              <option value="PART_TIME">{dict.Job_Type_Part_Time || 'Part Time'}</option>
              <option value="CONTRACT">{dict.Job_Type_Contract || 'Contract'}</option>
              <option value="FREELANCE">{dict.Job_Type_Freelance || 'Freelance'}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Salary || 'Salary'}</label>
          <input
            name="salary"
            type="text"
            defaultValue={existingData?.salary || ''}
            placeholder={dict.Placeholder_Salary || "e.g. 10M - 15M / month"}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Reason_Hiring}</label>
          <textarea
            name="reason"
            required
            rows={4}
            defaultValue={existingData?.reason || ''}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-all resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-theme-500 text-white font-bold text-lg hover:bg-theme-400 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? dict.Waiting : (existingData ? (dict.Update_Profile || 'Update Request') : dict.Submit)}
        </button>

        <p className="text-[10px] text-center text-theme-muted mt-4 opacity-50">
          This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
        </p>
      </form>
    </div>
  );
}
