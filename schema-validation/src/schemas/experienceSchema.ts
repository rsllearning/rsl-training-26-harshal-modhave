import { z } from "zod";

/**
 * Single Company History Item
 * Includes Dependent Rule 2: 'to' date must be strictly after 'from' date.
 */
export const companyHistoryItemSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name cannot exceed 100 characters"),
    role: z
      .string()
      .trim()
      .min(2, "Job role must be at least 2 characters")
      .max(80, "Job role cannot exceed 80 characters"),
    fromDate: z.string().min(1, "Start date ('from') is required"),
    toDate: z.string().min(1, "End date ('to') is required"),
  })
  .superRefine((val, ctx) => {
    if (!val.fromDate || !val.toDate) return;

    const from = new Date(val.fromDate);
    const to = new Date(val.toDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (isNaN(from.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date is invalid",
        path: ["fromDate"],
      });
      return;
    }

    if (isNaN(to.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is invalid",
        path: ["toDate"],
      });
      return;
    }

    if (from > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date cannot be in the future",
        path: ["fromDate"],
      });
    }

    // Dependent Rule 2: A previous company's "to" date must be after its "from" date
    if (to <= from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date ('to') must be after start date ('from')",
        path: ["toDate"],
      });
    }
  });

/**
 * Fresher Branch of the Discriminated Union
 */
export const fresherExperienceSchema = z.object({
  experienceType: z.literal("fresher"),
  availability: z
    .string()
    .min(1, "Please select your availability to join"),
});

/**
 * Experienced Branch of the Discriminated Union
 */
export const experiencedSchema = z.object({
  experienceType: z.literal("experienced"),
  totalExperienceYears: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Total experience is required",
    })
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(
      z
        .number({ invalid_type_error: "Total experience must be a number" })
        .positive("Total experience must be greater than 0 years")
        .max(50, "Total experience cannot exceed 50 years")
    ),
  noticePeriodDays: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Notice period is required",
    })
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(
      z
        .number({ invalid_type_error: "Notice period must be a valid number of days" })
        .int("Notice period must be an integer number of days")
        .min(0, "Notice period cannot be negative")
        .max(180, "Notice period cannot exceed 180 days")
    ),
  companies: z
    .array(companyHistoryItemSchema)
    .min(1, "At least one previous company record is required for experienced candidates"),
});

/**
 * Discriminated Union for Experience Step
 */
export const experienceSchema = z.discriminatedUnion("experienceType", [
  fresherExperienceSchema,
  experiencedSchema,
]);

export type CompanyHistoryItem = z.infer<typeof companyHistoryItemSchema>;
export type FresherExperience = z.infer<typeof fresherExperienceSchema>;
export type ExperiencedDetails = z.infer<typeof experiencedSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;

