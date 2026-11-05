import { z } from "zod";

export const applicationDetailsSchema = z
  .object({
    position: z
      .string()
      .min(1, "Please select the position you are applying for"),
    expectedJoiningDate: z
      .string()
      .min(1, "Expected joining date is required"),
    portfolioLink: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (!val || val === "") return true;
          try {
            const url = new URL(val);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        {
          message: "Please enter a valid website/portfolio URL (e.g. https://portfolio.dev)",
        }
      ),
    coverNote: z
      .string()
      .trim()
      .max(1000, "Cover note cannot exceed 1000 characters")
      .optional(),
    acceptanceOfTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions to submit your application",
      }),
  })
  .superRefine((data, ctx) => {
    // Multi-field Dependent Rule: Expected joining date must be in the future
    if (!data.expectedJoiningDate) return;

    const joining = new Date(data.expectedJoiningDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(joining.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid joining date format",
        path: ["expectedJoiningDate"],
      });
      return;
    }

    if (joining <= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expected joining date must be strictly in the future",
        path: ["expectedJoiningDate"],
      });
    }
  });

export type ApplicationDetailsValues = z.infer<typeof applicationDetailsSchema>;

