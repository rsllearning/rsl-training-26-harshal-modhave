export async function RecentActivityWidget() {
  // Simulate backend loading delay (3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-3">Live Activity Feed (Streamed)</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li className="p-2 bg-slate-50 rounded">⚡ PR #104 merged into main branch</li>
        <li className="p-2 bg-slate-50 rounded">🚀 Production deployment completed successfully</li>
        <li className="p-2 bg-slate-50 rounded">📝 Updated documentation for catch-all dynamic routes</li>
      </ul>
    </div>
  );
}

export function SkeletonWidget() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-8 bg-slate-100 rounded"></div>
        <div className="h-8 bg-slate-100 rounded"></div>
        <div className="h-8 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
}