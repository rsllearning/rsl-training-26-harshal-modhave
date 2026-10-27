export default async function CatchAllDocs({
  params,
}: {
  params: Promise<{ id: string; slug: string[] }>;
}) {
  const { id, slug } = await params;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Catch-all Documentation Route</h2>
      <p className="text-slate-500 text-sm mb-4">Project ID: #{id}</p>
      
      <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm text-slate-800">
        Requested Path: /docs/{slug.join('/')}
      </div>
    </div>
  );
}