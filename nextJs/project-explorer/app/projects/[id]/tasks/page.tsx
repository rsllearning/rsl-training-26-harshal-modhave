import projectsData from '@/data/projects.json';

export default async function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Task List</h2>
      <ul className="space-y-2 text-sm text-slate-600">
        {project?.tasks.map((task) => (
          <li key={task} className="p-2 bg-slate-50 border rounded flex items-center gap-2">
            <input type="checkbox" className="rounded" /> {task}
          </li>
        ))}
      </ul>
    </div>
  );
}