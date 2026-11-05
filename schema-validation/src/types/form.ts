import type {
  JobApplicationFormValues,
  PersonalDetailsValues,
  EducationValues,
  QualificationItem,
  ExperienceValues,
  FresherExperience,
  ExperiencedDetails,
  CompanyHistoryItem,
  ApplicationDetailsValues,
} from "../schemas";

export type {
  JobApplicationFormValues,
  PersonalDetailsValues,
  EducationValues,
  QualificationItem,
  ExperienceValues,
  FresherExperience,
  ExperiencedDetails,
  CompanyHistoryItem,
  ApplicationDetailsValues,
};

export type WizardStepId = 1 | 2 | 3 | 4 | 5;

export interface WizardStepConfig {
  id: WizardStepId;
  title: string;
  subtitle: string;
}

export type MockOutcomeType = "success" | "field_error" | "server_error";

export interface ApiSubmissionResult {
  success: boolean;
  message: string;
  applicationId?: string;
  timestamp?: string;
  errors?: Record<string, string>;
}

