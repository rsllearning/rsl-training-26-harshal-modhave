import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormInput } from "../ui/FormInput";
import { Plus, Trash2, Briefcase, Building2, AlertCircle } from "lucide-react";
import type { JobApplicationFormValues } from "../../types/form";
import { getNestedErrorMessage } from "../../utils/formUtils";

export const ExperiencedFields: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<JobApplicationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience.companies" as any,
  });

  const companiesListError = getNestedErrorMessage(errors, "experience.companies");

  const handleAddCompany = () => {
    append({
      companyName: "",
      role: "",
      fromDate: "",
      toDate: "",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/30 space-y-4">
        <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
          <Briefcase className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <span>Professional Background Summary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="experience.totalExperienceYears"
            label="Total Work Experience (Years)"
            type="number"
            step="0.1"
            placeholder="e.g. 3.5"
            required
            min={0.1}
            max={50}
            description="Total cumulative industry experience"
          />

          <FormInput
            name="experience.noticePeriodDays"
            label="Notice Period (Days)"
            type="number"
            placeholder="e.g. 30"
            required
            min={0}
            max={180}
            description="Official notice period with current employer (0 for immediate)"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-700" aria-hidden="true" />
              Previous Companies & Experience History
            </h3>
            <p className="text-xs text-slate-500">
              List the organizations you have worked at. At least one previous company is required.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCompany}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors self-start sm:self-center"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Company
          </button>
        </div>

        {companiesListError && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-3 border border-red-200 text-red-800 text-xs flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span>{companiesListError}</span>
          </div>
        )}

        <div className="space-y-4">
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
                    Company Record #{index + 1}
                  </span>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove company ${index + 1}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name={`experience.companies.${index}.companyName`}
                    label="Company Name"
                    placeholder="e.g. Acme Technologies Corp"
                    required
                  />

                  <FormInput
                    name={`experience.companies.${index}.role`}
                    label="Role / Designation"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />

                  <FormInput
                    name={`experience.companies.${index}.fromDate`}
                    label="From Date (Start)"
                    type="date"
                    required
                  />

                  <FormInput
                    name={`experience.companies.${index}.toDate`}
                    label="To Date (End)"
                    type="date"
                    required
                    description="Must be after the start date"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

