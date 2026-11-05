import React from "react";
import { CheckCircle2, Copy, Check, ArrowRight, Sparkles } from "lucide-react";
import type { ApiSubmissionResult } from "../../types/form";

interface StepSuccessProps {
  result: ApiSubmissionResult;
  onReset: () => void;
}

export const StepSuccess: React.FC<StepSuccessProps> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const copyApplicationId = () => {
    if (result.applicationId) {
      navigator.clipboard.writeText(result.applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-8 px-4 text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
      <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">
          Application Submitted Successfully!
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you for applying to Raja Software. Your application profile has been recorded in our
          applicant tracking system.
        </p>
      </div>

      {result.applicationId && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Your Application Tracking ID
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-slate-900 bg-white px-3 py-1 rounded border border-slate-200">
              {result.applicationId}
            </span>
            <button
              type="button"
              onClick={copyApplicationId}
              aria-label="Copy tracking ID"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          {result.timestamp && (
            <span className="text-xs text-slate-400">
              Submitted at: {new Date(result.timestamp).toLocaleString()}
            </span>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-left text-xs text-blue-900 space-y-2">
        <div className="font-semibold flex items-center gap-1.5 text-blue-950">
          <Sparkles className="h-4 w-4 text-blue-600" />
          Next Steps:
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700">
          <li>Our talent acquisition team will review your qualifications within 3 business days.</li>
          <li>If shortlisted, you will receive an invitation for an initial technical screening.</li>
          <li>You can quote your Tracking ID in any correspondence with our HR department.</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm transition-colors text-sm"
      >
        <span>Submit Another Application</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

