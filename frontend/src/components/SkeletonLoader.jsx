import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  if (type === 'metric') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-200 rounded-full w-24" />
              <div className="w-10 h-10 bg-slate-200 rounded-2xl" />
            </div>
            <div className="h-8 bg-slate-200 rounded-xl w-32" />
            <div className="h-2.5 bg-slate-100 rounded-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded-md w-48 mb-6" />
        <div className="space-y-3">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center py-3 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-12" />
              <div className="h-4 bg-slate-200 rounded flex-1" />
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-6 bg-slate-200 rounded-full w-20" />
              <div className="h-4 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="h-5 bg-slate-200 rounded-md w-3/4" />
          <div className="h-4 bg-slate-100 rounded-md w-1/2" />
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="h-3.5 bg-slate-100 rounded w-full" />
            <div className="h-3.5 bg-slate-100 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
