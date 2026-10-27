import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col border-r border-slate-800">
        <h2 className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-4">
          Dashboard Menu
        </h2>
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-slate-800 hover:text-white transition">
            Overview
          </Link>
          <Link href="/dashboard/analytics" className="block px-3 py-2 rounded hover:bg-slate-800 hover:text-white transition">
            Analytics
          </Link>
          <Link href="/dashboard/reports" className="block px-3 py-2 rounded hover:bg-slate-800 hover:text-white transition">
            Reports
          </Link>
        </nav>
      </aside>
      <section className="flex-1 p-8 bg-slate-50">{children}</section>
    </div>
  );
}