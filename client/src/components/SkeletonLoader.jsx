import React from 'react';

export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'list') {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
            <div className="h-10 w-10 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Consolidated Card Skeleton Template
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-slate-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
    </div>
  );
}