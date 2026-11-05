import type { JobApplicationFormValues, MockOutcomeType, ApiSubmissionResult } from "../types/form";

export class ApiServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiServerError";
  }
}

export class ApiValidationError extends Error {
  public fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string>) {
    super(message);
    this.name = "ApiValidationError";
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Mock API endpoint simulating career portal submission.
 * Pauses for 1.5 seconds (1500ms) and responds based on chosen outcome.
 */
export async function submitJobApplication(
  _data: JobApplicationFormValues,
  outcome: MockOutcomeType = "success"
): Promise<ApiSubmissionResult> {
  // Simulate network latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (outcome === "server_error") {
    throw new ApiServerError(
      "HTTP 500 Internal Server Error: The career portal database cluster encountered an unexpected failure while persisting the application. Please try again."
    );
  }

  if (outcome === "field_error") {
    throw new ApiValidationError(
      "Validation Failed: One or more fields failed server-side verification.",
      {
        "personal.email":
          "This email address is already registered in our recruitment database with another active application.",
      }
    );
  }

  // Success response
  return {
    success: true,
    message: "Job application submitted successfully! Our talent acquisition team will review your profile.",
    applicationId: `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toISOString(),
  };
}

