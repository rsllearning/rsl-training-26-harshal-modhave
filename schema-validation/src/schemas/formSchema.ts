import { z } from "zod";
import { personalDetailsSchema } from "./personalSchema";
import { educationListSchema } from "./educationSchema";
import { experienceSchema } from "./experienceSchema";
import { applicationDetailsSchema } from "./applicationSchema";

/**
 * Root Job Application Form Schema
 * Combines all steps and enforces cross-step multi-field rules:
 * Rule 1: Candidate must be 18 or older (in personalSchema)
 * Rule 2: Company 'to' date must be after 'from' date (in experienceSchema)
 * Rule 3: Expected joining date must be strictly in the future (in applicationSchema)
 * Rule 4: (Cross-step) If candidate is experienced, expected joining date must honor their notice period
 * Rule 5: (Cross-step) Education year of passing must be at least 15 years after candidate's birth year
 */
export const jobApplicationFormSchema = z
  .object({
    personal: personalDetailsSchema,
    education: educationListSchema,
    experience: experienceSchema,
    application: applicationDetailsSchema,
  })
  .superRefine((data, ctx) => {
    // Cross-step Rule 4: Experienced Notice Period vs Expected Joining Date
    if (
      data.application?.expectedJoiningDate &&
      data.experience?.experienceType === "experienced" &&
      typeof data.experience.noticePeriodDays === "number" &&
      data.experience.noticePeriodDays > 0
    ) {
      const joining = new Date(data.application.expectedJoiningDate);
      if (!isNaN(joining.getTime())) {
        const minAllowedDate = new Date();
        minAllowedDate.setHours(0, 0, 0, 0);
        minAllowedDate.setDate(minAllowedDate.getDate() + data.experience.noticePeriodDays);

        if (joining < minAllowedDate) {
          const formattedMin = minAllowedDate.toISOString().split("T")[0];
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Based on your ${data.experience.noticePeriodDays}-day notice period, expected joining date cannot be earlier than ${formattedMin}`,
            path: ["application", "expectedJoiningDate"],
          });
        }
      }
    }

    // Cross-step Rule 5: Candidate DOB vs Education Year of Passing
    if (data.personal?.dateOfBirth && Array.isArray(data.education)) {
      const birthDate = new Date(data.personal.dateOfBirth);
      if (!isNaN(birthDate.getTime())) {
        const birthYear = birthDate.getFullYear();
        data.education.forEach((edu, idx) => {
          if (edu?.yearOfPassing && typeof edu.yearOfPassing === "number") {
            if (edu.yearOfPassing < birthYear + 15) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Year of passing (${edu.yearOfPassing}) must be at least 15 years after your birth year (${birthYear})`,
                path: ["education", idx, "yearOfPassing"],
              });
            }
          }
        });
      }
    }
  });

/**
 * Types inferred directly from the single source of truth Zod schema
 */
export type JobApplicationFormValues = z.infer<typeof jobApplicationFormSchema>;

