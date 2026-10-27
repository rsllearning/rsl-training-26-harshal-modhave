import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-12 text-center space-y-6">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
        Welcome to <span className="text-blue-600">Project Explorer</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        A modern project management portal built with Next.js App Router demonstrating Server & Client Components, Dynamic Routing, Streaming, and Error Boundaries.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/projects"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition"
        >
          Explore Projects
        </Link>
      </div>
    </div>
  );
}