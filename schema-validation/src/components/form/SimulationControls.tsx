import React from "react";
import type { MockOutcomeType } from "../../types/form";
import { Sliders, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface SimulationControlsProps {
  currentOutcome: MockOutcomeType;
  onSelectOutcome: (outcome: MockOutcomeType) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentOutcome,
  onSelectOutcome,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm mb-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 text-blue-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Mock API Outcome Simulator (1.5s latency)
            </span>
            <span className="text-xs text-slate-400">
              Select which backend outcome the submission should simulate
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg self-start sm:self-center">
          <button
            type="button"
            onClick={() => onSelectOutcome("success")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentOutcome === "success"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Success (200)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectOutcome("field_error")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentOutcome === "field_error"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Field Error</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectOutcome("server_error")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentOutcome === "server_error"
                ? "bg-red-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Server 500 Error</span>
          </button>
        </div>
      </div>
    </div>
  );
};

