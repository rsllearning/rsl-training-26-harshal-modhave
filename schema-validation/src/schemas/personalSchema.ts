import { z } from "zod";

/**
 * Step 1: Personal Details Schema
 * Includes multi-field / dependent rule: Candidate must be at least 18 years old.
 */
export const personalDetailsSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name cannot exceed 80 characters")
      .regex(/^[a-zA-Z\s.'-]+$/, "Full name can only contain letters, spaces, hyphens, and dots"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Please enter a valid email address (e.g. name@company.com)"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,14}$/,
        "Please enter a valid phone number (10 to 15 digits)"
      ),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required"),
    currentCity: z
      .string()
      .trim()
      .min(2, "Current city must be at least 2 characters")
      .max(60, "Current city cannot exceed 60 characters"),
  })
  .superRefine((data, ctx) => {
    // Multi-field Dependent Rule 1: Candidate must be 18 or older
    if (!data.dateOfBirth) return;
    const dob = new Date(data.dateOfBirth);
    if (isNaN(dob.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid date of birth",
        path: ["dateOfBirth"],
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dob > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date of birth cannot be in the future",
        path: ["dateOfBirth"],
      });
      return;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Candidate must be at least 18 years old to apply (current calculated age: ${age})`,
        path: ["dateOfBirth"],
      });
    } else if (age > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a realistic date of birth (maximum 100 years old)",
        path: ["dateOfBirth"],
      });
    }
  });

export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;

