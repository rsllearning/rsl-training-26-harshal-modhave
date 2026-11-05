import React from "react";
import { FormSelect } from "../ui/FormSelect";
import { Sparkles, Calendar } from "lucide-react";

export const FresherFields: React.FC = () => {
  return (
    <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
        <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        <span>Fresher Profile Details</span>
      </div>

      <div className="max-w-md">
        <FormSelect
          name="experience.availability"
          label="Availability to Join"
          placeholder="Select when you can join..."
          required
          options={[
            { value: "Immediate", label: "Immediate (Within 3 days)" },
            { value: "15_Days", label: "Within 15 days" },
            { value: "30_Days", label: "Within 1 month (30 days)" },
            { value: "45_Days", label: "Within 45 days" },
            { value: "60_Days", label: "Within 2 months (60 days)" },
            { value: "Post_Graduation", label: "After final semester exams / graduation" },
          ]}
          description="Let us know how quickly you can complete onboarding if selected."
        />
      </div>

      <div className="rounded-lg bg-white/80 p-3 border border-emerald-200/60 flex items-start gap-2.5 text-xs text-emerald-900">
        <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
        <span>
          As an entry-level candidate / fresher, we don't require prior full-time company experience.
          We will evaluate your coursework, academic projects, and problem-solving skills!
        </span>
      </div>
    </div>
  );
};

