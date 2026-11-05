import { z } from "zod";

const currentYear = new Date().getFullYear();

export const qualificationItemSchema = z.object({
  degree: z
    .string()
    .trim()
    .min(2, "Degree name must be at least 2 characters")
    .max(100, "Degree name cannot exceed 100 characters"),
  institution: z
    .string()
    .trim()
    .min(2, "Institution name must be at least 2 characters")
    .max(120, "Institution name cannot exceed 120 characters"),
  yearOfPassing: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Year of passing is required",
    })
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(
      z
        .number({ invalid_type_error: "Year of passing must be a valid number" })
        .int("Year of passing must be a 4-digit integer")
        .min(1970, "Year of passing must be 1970 or later")
        .max(currentYear + 6, `Year of passing cannot exceed ${currentYear + 6}`)
    ),
  percentage: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Percentage is required",
    })
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .pipe(
      z
        .number({ invalid_type_error: "Percentage must be a valid number" })
        .min(0, "Percentage cannot be less than 0%")
        .max(100, "Percentage cannot exceed 100%")
    ),
});

export const educationListSchema = z
  .array(qualificationItemSchema)
  .min(1, "At least one qualification entry is required");

export type QualificationItem = z.infer<typeof qualificationItemSchema>;
export type EducationValues = z.infer<typeof educationListSchema>;

