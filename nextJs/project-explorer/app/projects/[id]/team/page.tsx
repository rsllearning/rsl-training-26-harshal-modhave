import projectsData from '@/data/projects.json';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Project Team</h2>
      <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
        {project?.team.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
}