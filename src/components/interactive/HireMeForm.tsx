'use client';

import { useState } from 'react';
import { submitHireRequest } from '@/app/hire-actions';
import CaptchaValidator from './CaptchaValidator';

interface HireMeFormProps {
  dict: Record<string, string>;
}

export default function HireMeForm({ dict }: HireMeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!captchaToken) {
      setError(dict.Invalid_Captcha || "Please complete the CAPTCHA");
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitHireRequest(formData, captchaToken);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow text-center">
        <h2 className="text-2xl font-bold text-theme-500 mb-4">{dict.Hire_Success}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow">
      <h1 className="text-3xl font-bold mb-2 nav-active-gacor">{dict.Hire_Me}</h1>
      <p className="text-theme-muted mb-8">{dict.Hire_Me_Description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Company}</label>
            <input
              name="company"
              type="text"
              required
              placeholder="Microsoft, Google, etc."
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Job_Title || 'Job Title'}</label>
            <input
              name="jobTitle"
              type="text"
              placeholder="Full Stack Engineer"
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Location || 'Location'}</label>
            <select
              name="location"
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            >
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Job_Type || 'Job Type'}</label>
            <select
              name="jobType"
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="FREELANCE">Freelance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Salary || 'Salary'}</label>
          <input
            name="salary"
            type="text"
            placeholder="e.g. 10M - 15M / month"
            className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Reason_Hiring}</label>
          <textarea
            name="reason"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors resize-none"
          />
        </div>

        <CaptchaValidator onValidate={(token) => setCaptchaToken(token)}>
           <div className="hidden">Captcha Required</div>
        </CaptchaValidator>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        
        <button
          type="submit"
          disabled={loading || !captchaToken}
          className="w-full py-4 rounded-xl bg-theme-500 text-white font-bold text-lg hover:bg-theme-400 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? dict.Waiting : dict.Submit}
        </button>
      </form>
    </div>
  );
}
