# Form Architecture & Runtime Schema Validation (React Hook Form + Zod)

> **Job Application Portal Wizard** built with **React**, **TypeScript (Strict Mode)**, **React Hook Form**, and **Zod**.  
> Engineered for **Raja Software Technical Assessment**.

---

## Table of Contents
1. [Overview](#overview)
2. [How to Run the Project](#how-to-run-the-project)
3. [Schema Architecture & Single Source of Truth](#schema-architecture--single-source-of-truth)
4. [Validation Mode & Rationale](#validation-mode--rationale)
5. [Form State Lifecycle & Step Sharing](#form-state-lifecycle--step-sharing)
6. [Performance: Deliberate Re-render Optimizations](#performance-deliberate-re-render-optimizations)
7. [Accessibility (a11y) Implementation](#accessibility-a11y-implementation)
8. [Mock API & Outcome Simulations](#mock-api--outcome-simulations)
9. [Automated Test Suite](#automated-test-suite)
10. [Completeness & Edge Cases](#completeness--edge-cases)

---

## Overview

This project implements a 5-step wizard for a candidate applying to an open position:
- **Step 1: Personal Details** – Full name, email, phone, date of birth, current city.
- **Step 2: Education** – Repeating list of qualifications (`useFieldArray`) with degree, institution, year of passing, and percentage. At least one entry is required.
- **Step 3: Experience** – Modeled as a **Zod discriminated union** between **Fresher** (availability to join) and **Experienced** (total experience, notice period, and repeating company history with start and end dates).
- **Step 4: Application Details** – Target role, expected joining date, portfolio link, cover note, and terms acceptance.
- **Step 5: Review & Submit** – Read-only summary of the entire application with section edit shortcuts and submission to a mock API.

---

## How to Run the Project

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm / yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build & Typecheck
```bash
# Runs TypeScript compiler in strict mode and bundles for production
npm run build
```

### Running the Schema & Runtime Test Suite
```bash
# Runs 21 unit & integration tests covering Zod schemas, multi-field rules, and mock API
npm test
```

---

## Schema Architecture & Single Source of Truth

The validation layer is organized modularly under `src/schemas/`:

```
src/schemas/
├── personalSchema.ts       # Step 1: Personal details + Age validation
├── educationSchema.ts      # Step 2: Qualification items + repeating list
├── experienceSchema.ts     # Step 3: Discriminated union (Fresher vs Experienced) + Company dates
├── applicationSchema.ts    # Step 4: Position, future joining date, portfolio URL, terms
├── formSchema.ts           # Root schema combining all steps + cross-step multi-field rules
└── index.ts                # Public exports
```

### Zero Duplication via `z.infer`
TypeScript types are never hand-written; all types are inferred directly from Zod:
```typescript
export type JobApplicationFormValues = z.infer<typeof jobApplicationFormSchema>;
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
export type EducationValues = z.infer<typeof educationListSchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type ApplicationDetailsValues = z.infer<typeof applicationDetailsSchema>;
```

### Multi-Field Dependent Validation Rules
The assignment requires **at least three rules that depend on more than one field**. This project implements **five**:

1. **Rule 1: Candidate Age Verification (Intra-step: Step 1)**
   - Schema: `personalSchema.ts`
   - Fields: `dateOfBirth` vs current date.
   - Enforces that the candidate is $\ge 18$ years old at the time of submission (calculating exact age accounting for month and day).
2. **Rule 2: Previous Company Employment Period (Intra-step: Step 3)**
   - Schema: `experienceSchema.ts`
   - Fields: `company.fromDate` vs `company.toDate`.
   - Enforces that `toDate` is strictly after `fromDate`, and `fromDate` cannot be in the future.
3. **Rule 3: Expected Joining Date Future Check (Intra-step: Step 4)**
   - Schema: `applicationSchema.ts`
   - Fields: `expectedJoiningDate` vs current system date.
   - Enforces that the expected joining date is strictly in the future.
4. **Rule 4: Notice Period Feasibility Constraint (Cross-step: Step 3 & Step 4)**
   - Schema: `formSchema.ts` (Root superRefine)
   - Fields: `experience.noticePeriodDays` vs `application.expectedJoiningDate`.
   - For experienced candidates with an active notice period (e.g. 60 days), the expected joining date cannot be earlier than $\text{Today} + \text{Notice Period}$.
5. **Rule 5: Academic Timeline Realism (Cross-step: Step 1 & Step 2)**
   - Schema: `formSchema.ts` (Root superRefine)
   - Fields: `personal.dateOfBirth` vs `education[].yearOfPassing`.
   - Enforces that any qualification year of passing must be at least 15 years after the candidate's birth year.

---

## Validation Mode & Rationale

We configured React Hook Form with:
```typescript
useForm<JobApplicationFormValues>({
  resolver: zodResolver(jobApplicationFormSchema),
  mode: "onTouched",
  reValidateMode: "onChange",
  defaultValues: INITIAL_DEFAULT_VALUES,
});
```

### Why `mode: "onTouched"`?
- **Avoids Premature Errors**: Unlike `mode: "onChange"`, it does not yell at the user while they are still in the middle of typing their email address or phone number for the first time.
- **Immediate Inline Feedback After Blur**: Once the user finishes interacting with a field and tabs/clicks away, validation runs immediately.
- **Instant Correction via `reValidateMode: "onChange"`**: Once an error has been displayed for a field, any subsequent keystroke immediately clears the error the moment the input satisfies the schema, providing positive reinforcement without requiring another blur or submit.
- **Superior to `mode: "onSubmit"`**: In a multi-step wizard, `onSubmit` defers feedback until the user clicks "Continue", creating frustration if multiple fields are flagged at once. `onTouched` surfaces mistakes naturally as the user moves through the form.

---

## Form State Lifecycle & Step Sharing

1. **One Form Instance for the Entire Wizard**:
   - A single `useForm` hook is instantiated in `App.tsx` and wrapped in React Hook Form's `<FormProvider>`.
   - No state is copied into external state managers (Redux, Zustand, or custom React Context). All form values, touched states, and errors reside in React Hook Form's internal ref-based store.
2. **Preservation Across Navigation**:
   - Moving between steps merely conditionally renders the active step view (`{currentStep === 1 && <Step1Personal />}`).
   - When the candidate clicks "Back" or jumps to Step 1 via the Review screen's "Edit" button, all previously entered values remain intact and pre-populated.
3. **Step-by-Step Validation with `trigger`**:
   - Clicking "Continue to Next Step" invokes:
     ```typescript
     const isStepValid = await trigger(stepFieldKey, { shouldFocus: true });
     ```
   - React Hook Form validates the specific sub-tree of fields for the active step (`personal`, `education`, `experience`, or `application`).
   - If invalid, navigation is blocked and focus automatically moves to the first invalid field.

---

## Performance: Deliberate Re-render Optimizations

To keep the form fast and prevent whole-step re-renders, the following architectural choices were made:

### 1. Isolated Discriminated Union Switcher (`ExperienceSwitcher.tsx`)
- In Step 3, the user chooses between "Fresher" and "Experienced".
- Instead of calling `watch("experience.experienceType")` inside `Step3Experience` (which would force the entire step, the radio options, and all child inputs to re-render on any change), the subscription is isolated in `ExperienceSwitcher` using `useWatch`.
- Result: Toggling candidate profile tracks re-renders **only** the sub-tree inside `ExperienceSwitcher`.

### 2. Isolated Character Counter (`CoverNoteCounter.tsx`)
- Step 4 contains an optional 1000-character cover note with a live counter (`X / 1000 characters`).
- Instead of subscribing at the `Step4Application` level (which would re-render the position dropdown, expected joining date picker, portfolio URL input, and terms checkbox on **every single keystroke**), `useWatch({ name: "application.coverNote" })` is placed in `CoverNoteCounter`.
- Result: Typing inside the textarea re-renders **only** the small counter text node. The rest of Step 4 stays untouched.

### 3. Read-Only Snapshot on Review Screen (`Step5Review.tsx`)
- Step 5 summarizes all answers across all 4 previous steps.
- Instead of subscribing to all form fields using `watch()`, `Step5Review` calls `getValues()` on mount.
- Result: Zero continuous subscriptions or reactive re-renders on the review screen.

### 4. Self-Registering Field Components (`FormInput`, `FormSelect`, etc.)
- Reusable field components use React Hook Form's `register(name)` which leverages **uncontrolled inputs** under the hood.
- Typing into any standard field updates React Hook Form's internal refs without triggering React reconciliation cycles on parent steps.

---

## Accessibility (a11y) Implementation

The form is built for full keyboard navigability and screen-reader compliance:
- **Explicit Label Associations**: Every field links its `<label htmlFor={name}>` to the input's `<input id={name}>`.
- **`aria-invalid`**: Dynamically toggled to `"true"` or `"false"` based on whether errors exist for that field.
- **`aria-describedby`**: Chained to link both helper descriptions (`${name}-description`) and error alerts (`${name}-error`).
- **Screen Reader Alerts**: All error messages carry `role="alert"` so assistive technology announces failures when they occur.
- **Automatic Focus on Error**: Step progression calls `trigger(stepKey, { shouldFocus: true })`. An accessible fallback queries `[aria-invalid="true"]` to ensure focus moves to the first invalid input.
- **Accessible Stepper**: The progress stepper uses semantic `<nav>` and `<ol>` tags with `aria-current="step"` on the active step.
- **Keyboard Navigation**: The form is 100% completable using only Tab, Shift+Tab, Space, Enter, and Arrow keys (for radio groups).

---

## Mock API & Outcome Simulations

The mock backend in `src/api/mockApi.ts` simulates a realistic recruitment server with a mandatory **1.5-second latency**:
```typescript
await new Promise((resolve) => setTimeout(resolve, 1500));
```

The app includes an interactive **Mock API Outcome Simulator toolbar** in the header so reviewers can test all three required scenarios:

| Outcome Mode | Backend Simulation | Form Handling Behavior |
| :--- | :--- | :--- |
| **1. Success (200)** | Returns `{ success: true, applicationId: 'APP-2026-XXXXXX', timestamp: '...' }` | Renders a dedicated `<StepSuccess />` screen with the assigned Tracking ID, copy button, next steps, and a reset option. |
| **2. Field-Level Validation Error** | Throws `ApiValidationError` with `{ 'personal.email': 'This email address is already registered...' }` | Sets the error using `setError('personal.email', ...)`, navigates the user back to **Step 1 (Personal Details)**, focuses the email input with `setFocus('personal.email')`, and shows a warning banner. |
| **3. Server Error (500)** | Throws `ApiServerError` simulating database failure | Displays a top-level alert banner with `role="alert"`. Keeps the user on **Step 5 (Review)** with **all form data preserved** so they can retry. |

---

## Automated Test Suite

A standalone test suite (`src/tests/validateSchemas.ts`) verifies all schema rules and mock API outcomes:
```bash
npm test
```

### Test Coverage Highlights:
- **Suite 1**: Personal details schema & age verification (candidate under 18 rejected, $\ge 18$ accepted).
- **Suite 2**: Education repeating list validation (empty list rejected, valid qualifications accepted).
- **Suite 3**: Experience discriminated union & company date checks (`toDate < fromDate` rejected, valid history accepted).
- **Suite 4**: Application details & future joining date (past dates rejected, future dates accepted).
- **Suite 5**: Root schema cross-step multi-field rules (notice period constraint & birth year vs graduation year).
- **Suite 6**: Mock API 1.5s latency, success response, field-level error handling, and 500 error handling.

**Result: 21 passing assertions, 0 failures.**

---

## Completeness & Edge Cases

- [x] Schema is single source of truth; all types inferred with `z.infer`.
- [x] No hand-written TypeScript types duplicating schemas.
- [x] Reusable field components (`FormInput`, `FormSelect`, `FormTextarea`, `FormCheckbox`, `FormRadioGroup`) register themselves via `useFormContext`.
- [x] No repeated label/input/error markup in step components.
- [x] Single `useForm` instance with `FormProvider`.
- [x] Step validation with `trigger` and state preserved on backward navigation.
- [x] `useFieldArray` for Education and Previous Companies, keyed strictly on `field.id`.
- [x] Fresher / Experienced modeled as a Zod discriminated union.
- [x] Narrow subscriptions via `useWatch` in isolated components.
- [x] Full accessibility: `htmlFor`, `id`, `aria-invalid`, `aria-describedby`, `role="alert"`, focus on first invalid field, full keyboard navigability.
- [x] Mock API with 1.5s delay and 3 distinct outcome handlers.
- [x] Interactive simulation toolbar for immediate reviewer testing.
- [x] TypeScript strict mode enabled (`strict: true`).
- [x] Production build passes with 0 type errors and 0 warnings.
- [x] **Nothing left incomplete.**

