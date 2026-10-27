import Link from 'next/link';
import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';

export default async function ProjectDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  if (!project && id !== 'error-test') {
    notFound();
  }

  const navTabs = [
    { name: 'Overview', href: `/projects/${id}` },
    { name: 'Team', href: `/projects/${id}/team` },
    { name: 'Tasks', href: `/projects/${id}/tasks` },
    { name: 'Activity', href: `/projects/${id}/activity` },
    { name: 'Docs', href: `/projects/${id}/docs/setup` },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-slate-900 text-white p-6 rounded-xl mb-6">
        <span className="text-xs uppercase text-blue-400 tracking-wider font-semibold">Project Module</span>
        <h1 className="text-3xl font-extrabold mt-1">{project?.name || `Test Project #${id}`}</h1>
        <p className="text-slate-400 text-sm mt-1">{project?.description || 'Testing layout fallbacks'}</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6 gap-2">
        {navTabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 font-medium text-sm text-slate-600 hover:text-blue-600 transition"
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">{children}</div>
    </div>
  );
}