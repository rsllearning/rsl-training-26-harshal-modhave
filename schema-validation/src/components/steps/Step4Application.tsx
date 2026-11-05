import React from "react";
import { FormInput } from "../ui/FormInput";
import { FormSelect } from "../ui/FormSelect";
import { FormTextarea } from "../ui/FormTextarea";
import { FormCheckbox } from "../ui/FormCheckbox";
import { CoverNoteCounter } from "./CoverNoteCounter";
import { Send, Calendar, ShieldCheck } from "lucide-react";

const POSITIONS = [
  { value: "Frontend Engineer", label: "Frontend Engineer (React / TypeScript)" },
  { value: "Backend Engineer", label: "Backend Engineer (Node.js / Go / Java)" },
  { value: "Full Stack Engineer", label: "Full Stack Engineer" },
  { value: "SDET / QA Automation", label: "SDET / QA Automation Engineer" },
  { value: "DevOps & Cloud Engineer", label: "DevOps & Cloud Engineer" },
  { value: "UI/UX Product Designer", label: "UI/UX Product Designer" },
];

export const Step4Application: React.FC = () => {
  return (
    <section aria-labelledby="step4-heading" className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 id="step4-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Application Details
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Specify your target role, availability date, and additional supporting links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FormSelect
            name="application.position"
            label="Position Applied For"
            placeholder="Select a position..."
            required
            options={POSITIONS}
          />
        </div>

        <FormInput
          name="application.expectedJoiningDate"
          label="Expected Joining Date"
          type="date"
          required
          description="Must be strictly in the future and honor notice period"
        />

        <FormInput
          name="application.portfolioLink"
          label="Portfolio / GitHub / LinkedIn URL"
          type="url"
          placeholder="https://github.com/your-username"
          description="Optional: Share your projects, code samples, or public profile"
        />

        <div className="md:col-span-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              Cover Note / Additional Remarks (Optional)
            </span>
            <CoverNoteCounter />
          </div>
          <FormTextarea
            name="application.coverNote"
            label=""
            rows={4}
            placeholder="Briefly tell us what excites you about this role, key accomplishments, or any special considerations..."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>Terms & Data Privacy Consent</span>
        </div>

        <FormCheckbox
          name="application.acceptanceOfTerms"
          label="I certify that all information submitted is accurate and true to the best of my knowledge, and I agree to Raja Software's applicant privacy terms."
          description="We process your application strictly in accordance with employment privacy laws."
        />
      </div>

      <div className="rounded-lg bg-blue-50/70 p-3.5 border border-blue-100 flex items-start gap-3">
        <div className="p-1 rounded-full bg-blue-100 text-blue-700 mt-0.5">
          <Calendar className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-semibold">Notice Period cross-validation rule:</span> If you are an
          experienced candidate, your expected joining date is automatically checked against your
          stipulated notice period to ensure feasible onboarding timelines.
        </div>
      </div>
    </section>
  );
};

