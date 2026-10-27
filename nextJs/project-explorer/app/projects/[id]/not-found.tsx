import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-slate-200 rounded-xl">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mb-4">Project Not Found</h2>
      <p className="text-slate-500 text-sm mb-6">
        The project ID you requested does not exist or has been removed.
      </p>
      <Link
        href="/projects"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
      >
        Back to Projects
      </Link>
    </div>
  );
}