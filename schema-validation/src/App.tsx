import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobApplicationFormSchema, type JobApplicationFormValues } from "./schemas";
import type { WizardStepId, MockOutcomeType, ApiSubmissionResult } from "./types/form";
import { submitJobApplication, ApiServerError, ApiValidationError } from "./api/mockApi";

import { WizardStepper } from "./components/form/WizardStepper";
import { WizardNavigation } from "./components/form/WizardNavigation";
import { SimulationControls } from "./components/form/SimulationControls";

import { Step1Personal } from "./components/steps/Step1Personal";
import { Step2Education } from "./components/steps/Step2Education";
import { Step3Experience } from "./components/steps/Step3Experience";
import { Step4Application } from "./components/steps/Step4Application";
import { Step5Review } from "./components/steps/Step5Review";
import { StepSuccess } from "./components/steps/StepSuccess";

import { AlertOctagon, Briefcase } from "lucide-react";

const INITIAL_DEFAULT_VALUES: JobApplicationFormValues = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    currentCity: "",
  },
  education: [
    {
      degree: "",
      institution: "",
      yearOfPassing: "" as any,
      percentage: "" as any,
    },
  ],
  experience: {
    experienceType: "fresher",
    availability: "",
  },
  application: {
    position: "",
    expectedJoiningDate: "",
    portfolioLink: "",
    coverNote: "",
    acceptanceOfTerms: false,
  },
};

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStepId>(1);
  const [mockOutcome, setMockOutcome] = useState<MockOutcomeType>("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
  const [submissionSuccessResult, setSubmissionSuccessResult] =
    useState<ApiSubmissionResult | null>(null);

  // Single form instance for the entire wizard
  // Validation mode: 'onTouched' provides the ideal UX by validating fields
  // after the user has interacted and blurred, without premature errors during initial typing.
  const methods = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: INITIAL_DEFAULT_VALUES,
  });

  const { handleSubmit, trigger, setError, setFocus, reset } = methods;

  // Move to a target step with validation check if going forward
  const handleNextStep = async () => {
    setServerErrorMessage(null);

    let stepFieldKey: "personal" | "education" | "experience" | "application" = "personal";
    if (currentStep === 1) stepFieldKey = "personal";
    else if (currentStep === 2) stepFieldKey = "education";
    else if (currentStep === 3) stepFieldKey = "experience";
    else if (currentStep === 4) stepFieldKey = "application";

    const isStepValid = await trigger(stepFieldKey, { shouldFocus: true });

    if (!isStepValid) {
      // Accessible focus fallback for deep fields
      setTimeout(() => {
        const firstInvalid = document.querySelector<HTMLElement>(
          '[aria-invalid="true"], input:invalid, select:invalid, textarea:invalid'
        );
        firstInvalid?.focus();
      }, 50);
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setServerErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToStep = (stepId: WizardStepId) => {
    setServerErrorMessage(null);
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final submission to mock API
  const onSubmit = async (data: JobApplicationFormValues) => {
    setServerErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await submitJobApplication(data, mockOutcome);
      setSubmissionSuccessResult(response);
    } catch (err: unknown) {
      if (err instanceof ApiValidationError) {
        // Outcome 1: Server returned field-level validation errors
        Object.entries(err.fieldErrors).forEach(([fieldKey, msg]) => {
          setError(fieldKey as any, {
            type: "server",
            message: msg,
          });
        });

        // Jump back to Personal Details to resolve field error & move focus
        setCurrentStep(1);
        setTimeout(() => {
          setFocus("personal.email");
        }, 100);

        setServerErrorMessage(
          "Server Validation Failure: The recruitment server rejected your email because it already exists in the system."
        );
      } else if (err instanceof ApiServerError) {
        // Outcome 2: Server error (HTTP 500)
        setServerErrorMessage(err.message);
      } else {
        setServerErrorMessage("An unexpected network or system error occurred. Please retry.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetApplication = () => {
    reset(INITIAL_DEFAULT_VALUES);
    setSubmissionSuccessResult(null);
    setServerErrorMessage(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Raja Software Careers
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Candidate Application Portal • React Hook Form + Zod
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 shadow-2xs self-start sm:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TypeScript Strict Mode Active</span>
          </div>
        </header>

        {/* Mock API Simulation Toolbar */}
        {!submissionSuccessResult && (
          <SimulationControls
            currentOutcome={mockOutcome}
            onSelectOutcome={(outcome) => {
              setMockOutcome(outcome);
              setServerErrorMessage(null);
            }}
          />
        )}

        {/* Global Server Error Announcement Banner */}
        {serverErrorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3 shadow-xs animate-in fade-in"
          >
            <AlertOctagon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="font-bold block">Submission Alert</span>
              <p className="text-xs text-red-800 leading-relaxed">{serverErrorMessage}</p>
            </div>
          </div>
        )}

        {/* Main Application Container */}
        <main className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          {submissionSuccessResult ? (
            <StepSuccess
              result={submissionSuccessResult}
              onReset={handleResetApplication}
            />
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* 5-Step Stepper Header */}
                <div className="mb-8">
                  <WizardStepper
                    currentStep={currentStep}
                    onStepClick={handleJumpToStep}
                  />
                </div>

                {/* Wizard Steps */}
                <div className="min-h-[380px]">
                  {currentStep === 1 && <Step1Personal />}
                  {currentStep === 2 && <Step2Education />}
                  {currentStep === 3 && <Step3Experience />}
                  {currentStep === 4 && <Step4Application />}
                  {currentStep === 5 && <Step5Review onEditStep={handleJumpToStep} />}
                </div>

                {/* Wizard Navigation Controls */}
                <WizardNavigation
                  currentStep={currentStep}
                  totalSteps={5}
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  isSubmitting={isSubmitting}
                />
              </form>
            </FormProvider>
          )}
        </main>

        {/* Architecture Notes & Footer */}
        <footer className="text-xs text-slate-500 text-center py-4 space-y-1">
          <p>
            Single source of truth architecture with Zod schema composition and discriminated union.
          </p>
          <p>Raja Software Confidential • Form Architecture & Runtime Validation Assignment</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
