import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import type { JobApplicationFormValues } from "../../types/form";
import { FresherFields } from "./FresherFields";
import { ExperiencedFields } from "./ExperiencedFields";

/**
 * Isolated subscriber component using narrow subscription (useWatch).
 * Only this switcher re-renders when experienceType changes, avoiding
 * re-rendering the outer Step 3 container or other fields.
 */
export const ExperienceSwitcher: React.FC = () => {
  const { setValue, getValues } = useFormContext<JobApplicationFormValues>();
  const experienceType = useWatch({
    name: "experience.experienceType",
  });

  // Ensure default structures are present if switching
  React.useEffect(() => {
    if (experienceType === "experienced") {
      const currentCompanies = getValues("experience.companies" as any);
      if (!Array.isArray(currentCompanies) || currentCompanies.length === 0) {
        setValue("experience.companies" as any, [
          { companyName: "", role: "", fromDate: "", toDate: "" },
        ]);
      }
    }
  }, [experienceType, getValues, setValue]);

  if (experienceType === "experienced") {
    return <ExperiencedFields />;
  }

  return <FresherFields />;
};

