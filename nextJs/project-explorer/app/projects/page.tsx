import Link from 'next/link';
import projectsData from '@/data/projects.json';
import ProjectFilter from '@/components/ProjectFilter';

type SearchParams = Promise<{ search?: string; status?: string }>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const searchTerm = filters.search?.toLowerCase() || '';
  const statusTerm = filters.status?.toLowerCase() || '';

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm);
    const matchesStatus = statusTerm ? project.status === statusTerm : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Projects Directory</h1>
        <p className="text-slate-500 text-sm">Browse and filter active company initiatives.</p>
      </div>

      <ProjectFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-slate-800">{project.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  project.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4">{project.description}</p>
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="inline-block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <p className="text-slate-500 text-center py-12">No projects found matching the criteria.</p>
      )}
    </div>
  );
}