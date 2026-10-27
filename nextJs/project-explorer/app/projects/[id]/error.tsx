'use client';

export default function DynamicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200">
      <h2 className="text-lg font-bold text-red-700 mb-2">Error Loading Project!</h2>
      <p className="text-sm text-red-600 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition"
      >
        Try Again
      </button>
    </div>
  );
}