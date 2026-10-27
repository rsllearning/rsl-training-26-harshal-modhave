import projectsData from '@/data/projects.json';

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Project Activity</h2>
      <ul className="space-y-2 text-sm text-slate-600">
        {project?.activity.map((act, idx) => (
          <li key={idx} className="p-2 bg-slate-50 border rounded">
            📌 {act}
          </li>
        ))}
      </ul>
    </div>
  );
}