import React from "react";
import { FormInput } from "../ui/FormInput";
import { Calendar } from "lucide-react";

export const Step1Personal: React.FC = () => {
  return (
    <section aria-labelledby="step1-heading" className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 id="step1-heading" className="text-xl font-bold text-slate-900">
          Personal Information
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Please provide your contact details so our recruitment team can reach you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FormInput
            name="personal.fullName"
            label="Full Name"
            placeholder="e.g. Harshal Modhave"
            required
            autoComplete="name"
          />
        </div>

        <FormInput
          name="personal.email"
          label="Email Address"
          type="email"
          placeholder="e.g. harshal@example.com"
          required
          autoComplete="email"
        />

        <FormInput
          name="personal.phone"
          label="Phone Number"
          type="tel"
          placeholder="e.g. +91 9876543210"
          required
          autoComplete="tel"
        />

        <FormInput
          name="personal.dateOfBirth"
          label="Date of Birth"
          type="date"
          required
          description="Must be at least 18 years old to apply"
        />

        <FormInput
          name="personal.currentCity"
          label="Current City / Location"
          placeholder="e.g. Pune, Maharashtra"
          required
        />
      </div>

      <div className="rounded-lg bg-blue-50/70 p-3.5 border border-blue-100 flex items-start gap-3">
        <div className="p-1 rounded-full bg-blue-100 text-blue-700 mt-0.5">
          <Calendar className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-semibold">Age verification notice:</span> Applications are restricted
          to candidates who are 18 years of age or older at the time of submission.
        </div>
      </div>
    </section>
  );
};
