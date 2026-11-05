import React from "react";
import { useFormContext } from "react-hook-form";
import type { JobApplicationFormValues, WizardStepId } from "../../types/form";
import {
  User,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  Edit2,
  CheckCircle2,
} from "lucide-react";

interface Step5ReviewProps {
  onEditStep: (stepId: WizardStepId) => void;
}

export const Step5Review: React.FC<Step5ReviewProps> = ({ onEditStep }) => {
  const { getValues } = useFormContext<JobApplicationFormValues>();
  const values = getValues();

  return (
    <section aria-labelledby="step5-heading" className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 id="step5-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          Review & Submit Application
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Please carefully inspect your submitted information before final submission. Click "Edit" to modify any section.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              1. Personal Details
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Full Name</dt>
              <dd className="font-medium text-slate-900">{values.personal?.fullName || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Email Address</dt>
              <dd className="font-medium text-slate-900">{values.personal?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Phone Number</dt>
              <dd className="font-medium text-slate-900">{values.personal?.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Date of Birth</dt>
              <dd className="font-medium text-slate-900">{values.personal?.dateOfBirth || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Current City</dt>
              <dd className="font-medium text-slate-900">{values.personal?.currentCity || "—"}</dd>
            </div>
          </dl>
        </div>

        {/* Section 2: Education */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              2. Education ({values.education?.length || 0} entries)
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {values.education?.map((item, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">
                    {item.degree}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                    Passing: {item.yearOfPassing}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap gap-x-4">
                  <span>Institution: {item.institution}</span>
                  <span>Score: {item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Experience */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              3. Experience Details (
              {values.experience?.experienceType === "experienced" ? "Experienced" : "Fresher"})
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
          </div>

          {values.experience?.experienceType === "fresher" ? (
            <div className="text-sm">
              <span className="text-xs text-slate-500 block">Candidate Type</span>
              <span className="font-medium text-emerald-700">Fresher</span>
              <div className="mt-2">
                <span className="text-xs text-slate-500 block">Availability to Join</span>
                <span className="font-medium text-slate-900">{values.experience.availability}</span>
              </div>
            </div>
          ) : values.experience?.experienceType === "experienced" ? (
            <div className="space-y-3">
              <dl className="grid grid-cols-2 gap-4 text-sm pb-2 border-b border-slate-100">
                <div>
                  <dt className="text-xs text-slate-500">Total Experience</dt>
                  <dd className="font-medium text-slate-900">
                    {values.experience.totalExperienceYears} years
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Notice Period</dt>
                  <dd className="font-medium text-slate-900">
                    {values.experience.noticePeriodDays} days
                  </dd>
                </div>
              </dl>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Company History
                </span>
                <div className="space-y-2">
                  {values.experience.companies?.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 text-sm">
                      <div className="flex items-center justify-between font-medium text-slate-900">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-500" />
                          {c.companyName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {c.fromDate} → {c.toDate}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Role: {c.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Section 4: Application Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              4. Application Details
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Position Applied For</dt>
              <dd className="font-semibold text-slate-900">{values.application?.position || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Expected Joining Date</dt>
              <dd className="font-semibold text-blue-700">
                {values.application?.expectedJoiningDate || "—"}
              </dd>
            </div>
            {values.application?.portfolioLink && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">Portfolio / Link</dt>
                <dd className="font-medium text-blue-600 break-all">
                  <a
                    href={values.application.portfolioLink}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {values.application.portfolioLink}
                  </a>
                </dd>
              </div>
            )}
            {values.application?.coverNote && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">Cover Note</dt>
                <dd className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg whitespace-pre-line mt-1">
                  {values.application.coverNote}
                </dd>
              </div>
            )}
            <div className="sm:col-span-2 text-xs text-emerald-700 font-medium flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="h-4 w-4" />
              Applicant Terms and Privacy Policy accepted
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

