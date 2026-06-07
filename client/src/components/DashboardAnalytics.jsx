import React from 'react';

export default function DashboardAnalytics({ data = [40, 60, 45, 80, 75, 95] }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Earnings Analytics</h3>
      <div className="w-full h-48 flex items-end justify-between px-2 gap-2">
        {data.map((value, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className="w-full bg-slate-100 rounded-t-md relative" style={{ height: '140px' }}>
              <div 
                className="absolute bottom-0 left-0 right-0 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-t-md"
                style={{ height: `${value}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 mt-2">Mon {idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}