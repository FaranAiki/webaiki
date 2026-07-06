"use client";

import React from 'react';
import { m as motion } from 'framer-motion';
import { 
  Building2, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MapPin, 
  FileText,
  Clock,
  User as UserIcon
} from 'lucide-react';

interface HireRequestWithUser {
  id: string;
  company: string;
  jobTitle: string | null;
  reason: string;
  salary: string | null;
  location: string;
  jobType: string;
  status: string;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface BusinessRequestsClientProps {
  requests: HireRequestWithUser[];
  dict: import('@/components/layout/Translator').TranslationDict;
}

export default function BusinessRequestsClient({ requests }: BusinessRequestsClientProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-theme-muted">
        <Clock size={48} className="mb-4 opacity-20" />
        <p>No business requests found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-theme-surface/50 border border-theme-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-theme-primary/10 rounded-xl text-theme-primary">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{request.company}</h2>
                <p className="text-theme-muted flex items-center gap-2 text-sm">
                  <Briefcase size={14} />
                  {request.jobTitle || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-theme-muted bg-theme-surface px-3 py-1.5 rounded-full border border-theme-border">
              <Calendar size={14} />
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(request.createdAt))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-xl border border-theme-border">
              <div className="text-theme-muted"><MapPin size={18} /></div>
              <div>
                <p className="text-[10px] tracking-wider text-theme-muted font-bold">Location</p>
                <p className="text-sm font-medium">{request.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-xl border border-theme-border">
              <div className="text-theme-muted"><Briefcase size={18} /></div>
              <div>
                <p className="text-[10px] tracking-wider text-theme-muted font-bold">Type</p>
                <p className="text-sm font-medium">{request.jobType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-xl border border-theme-border">
              <div className="text-theme-muted"><DollarSign size={18} /></div>
              <div>
                <p className="text-[10px] tracking-wider text-theme-muted font-bold">Salary/Budget</p>
                <p className="text-sm font-medium">{request.salary || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-xl border border-theme-border">
              <div className="text-theme-muted"><UserIcon size={18} /></div>
              <div className="overflow-hidden">
                <p className="text-[10px] tracking-wider text-theme-muted font-bold">Applicant</p>
                <p className="text-sm font-medium truncate" title={request.user.email}>{request.user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-theme-surface rounded-xl p-4 border border-theme-border">
            <p className="text-[10px] tracking-wider text-theme-muted font-bold mb-2 flex items-center gap-1">
              <FileText size={12} />
              Reason & Details
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{request.reason}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
