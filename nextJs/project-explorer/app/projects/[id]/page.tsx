import projectsData from '@/data/projects.json';

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Artificial delay to test loading.tsx
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Trigger error boundary for testing
  if (id === 'error-test') {
    throw new Error('Simulated backend error while loading project overview!');
  }

  const project = projectsData.find((p) => p.id === id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Project Overview</h2>
      <div className="text-slate-600 space-y-2 text-sm">
        <p><strong>ID:</strong> {project?.id}</p>
        <p><strong>Status:</strong> {project?.status}</p>
        <p><strong>Description:</strong> {project?.description}</p>
      </div>
    </div>
  );
}