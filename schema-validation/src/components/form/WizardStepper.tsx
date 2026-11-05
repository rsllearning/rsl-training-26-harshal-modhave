import React from "react";
import type { WizardStepId, WizardStepConfig } from "../../types/form";
import { Check } from "lucide-react";

export const WIZARD_STEPS: WizardStepConfig[] = [
  { id: 1, title: "Personal Details", subtitle: "Name & Contact" },
  { id: 2, title: "Education", subtitle: "Academic History" },
  { id: 3, title: "Experience", subtitle: "Track & Work History" },
  { id: 4, title: "Application Details", subtitle: "Role & Joining Date" },
  { id: 5, title: "Review & Submit", subtitle: "Final Verification" },
];

interface WizardStepperProps {
  currentStep: WizardStepId;
  onStepClick?: (step: WizardStepId) => void;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Application Progress" className="w-full">
      <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {WIZARD_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex flex-col p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-blue-50/80 border-blue-400 ring-2 ring-blue-100"
                  : isCompleted
                  ? "bg-white border-emerald-300 text-slate-700"
                  : "bg-white/60 border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.id}
                </span>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider truncate ${
                    isCurrent
                      ? "text-blue-900"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  Step {step.id}
                </span>
              </div>

              <span
                className={`text-xs font-medium truncate ${
                  isCurrent
                    ? "text-blue-950 font-bold"
                    : isCompleted
                    ? "text-slate-900 font-semibold"
                    : "text-slate-400"
                }`}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

