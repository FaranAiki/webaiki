import React from 'react';

export default function CollectionsSkeleton() {
  return (
    <div className="w-full min-h-[50vh] p-4 sm:p-8 pt-8 animate-pulse flex flex-col gap-6">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto mb-4">
        <div className="h-10 w-64 bg-black/5 dark:bg-white/5 rounded-xl"></div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-black/5 dark:bg-white/5 rounded-lg"></div>
          <div className="h-10 w-10 bg-black/5 dark:bg-white/5 rounded-lg"></div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 shrink-0">
          <div className="h-14 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-14 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-14 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-14 w-full bg-black/5 dark:bg-white/5 rounded-2xl opacity-50"></div>
        </div>
        {/* Content Skeleton */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="h-8 w-48 bg-black/5 dark:bg-white/5 rounded-lg mb-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
            <div className="h-24 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
            <div className="h-24 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
            <div className="h-24 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
