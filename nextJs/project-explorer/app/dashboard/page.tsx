import { Suspense } from 'react';
import { RecentActivityWidget, SkeletonWidget } from '@/components/SlowWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Central hub for monitoring system activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Projects</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Active Sprints</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">System Health</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">Optimal</p>
        </div>
      </div>

      <Suspense fallback={<SkeletonWidget />}>
        <RecentActivityWidget />
      </Suspense>
    </div>
  );
}