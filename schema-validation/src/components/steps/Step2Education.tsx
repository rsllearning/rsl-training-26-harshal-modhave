import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormInput } from "../ui/FormInput";
import { Plus, Trash2, GraduationCap, AlertCircle } from "lucide-react";
import type { JobApplicationFormValues } from "../../types/form";
import { getNestedErrorMessage } from "../../utils/formUtils";

export const Step2Education: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<JobApplicationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const listError = getNestedErrorMessage(errors, "education");

  const handleAddQualification = () => {
    append({
      degree: "",
      institution: "",
      yearOfPassing: "" as any,
      percentage: "" as any,
    });
  };

  return (
    <section aria-labelledby="step2-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 id="step2-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Education & Qualifications
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Add your academic background. At least one qualification entry is required.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddQualification}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors self-start sm:self-center"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Another Qualification
        </button>
      </div>

      {listError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3.5 border border-red-200 text-red-800 text-sm flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span>{listError}</span>
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs relative transition-all"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  Qualification #{index + 1}
                </span>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove qualification ${index + 1}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name={`education.${index}.degree`}
                  label="Degree / Diploma"
                  placeholder="e.g. B.Tech in Computer Science"
                  required
                />

                <FormInput
                  name={`education.${index}.institution`}
                  label="College / Institution"
                  placeholder="e.g. Pune Institute of Computer Technology"
                  required
                />

                <FormInput
                  name={`education.${index}.yearOfPassing`}
                  label="Year of Passing"
                  type="number"
                  placeholder="e.g. 2024"
                  required
                  min={1970}
                  max={new Date().getFullYear() + 6}
                />

                <FormInput
                  name={`education.${index}.percentage`}
                  label="Aggregate Percentage / GPA"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 84.5"
                  required
                  min={0}
                  max={100}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

