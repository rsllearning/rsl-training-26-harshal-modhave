import React from "react";
import { FormRadioGroup } from "../ui/FormRadioGroup";
import { ExperienceSwitcher } from "./ExperienceSwitcher";
import { Briefcase } from "lucide-react";

export const Step3Experience: React.FC = () => {
  return (
    <section aria-labelledby="step3-heading" className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 id="step3-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Work Experience
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Select whether you are a Fresher or an Experienced candidate. Fields adapt automatically.
        </p>
      </div>

      <FormRadioGroup
        name="experience.experienceType"
        label="Candidate Profile Type"
        required
        description="Choose the track that best reflects your current professional stage"
        options={[
          {
            value: "fresher",
            label: "Fresher / New Graduate",
            description: "College student, recent graduate, or seeking entry-level role",
          },
          {
            value: "experienced",
            label: "Experienced Professional",
            description: "Have prior full-time industry or organizational experience",
          },
        ]}
      />

      {/* Isolated switcher component subscribes narrowly via useWatch */}
      <ExperienceSwitcher />
    </section>
  );
};

