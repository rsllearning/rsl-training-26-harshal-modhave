import type { FieldErrors } from "react-hook-form";

/**
 * Safely resolves error message from React Hook Form's nested error tree
 * supports both dot notation ('personal.email') and array indices ('education.0.degree')
 */
export function getNestedErrorMessage(
  errors: FieldErrors<any> | undefined,
  path: string
): string | undefined {
  if (!errors || !path) return undefined;

  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current: any = errors;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }

  if (typeof current?.message === "string") {
    return current.message;
  }

  // Handle direct string or Zod error shape
  if (typeof current === "string") {
    return current;
  }

  return undefined;
}

