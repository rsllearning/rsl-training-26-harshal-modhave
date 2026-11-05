import { personalDetailsSchema } from "../schemas/personalSchema";
import { educationListSchema } from "../schemas/educationSchema";
import { experienceSchema } from "../schemas/experienceSchema";
import { applicationDetailsSchema } from "../schemas/applicationSchema";
import { jobApplicationFormSchema } from "../schemas/formSchema";
import { submitJobApplication, ApiServerError, ApiValidationError } from "../api/mockApi";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ ${testName}${details ? ` -> ${details}` : ""}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("=== RUNNING FORM SCHEMA VALIDATION & RUNTIME TESTS ===\n");

  // TEST SUITE 1: Personal Details & Age Multi-Field Rule
  console.log("--- 1. Personal Details Schema & Age Validation ---");
  {
    const underAgePayload = {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "+91 9876543210",
      dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 17))
        .toISOString()
        .split("T")[0],
      currentCity: "Pune",
    };
    const underAgeResult = personalDetailsSchema.safeParse(underAgePayload);
    assert(!underAgeResult.success, "Rejects candidate younger than 18 years old");
    if (!underAgeResult.success) {
      const issue = underAgeResult.error.issues.find((i) => i.path.includes("dateOfBirth"));
      assert(
        Boolean(issue && issue.message.includes("at least 18 years old")),
        "Error message specifically states candidate must be at least 18"
      );
    }

    const validAgePayload = {
      fullName: "Harshal Modhave",
      email: "harshal@example.com",
      phone: "+91 9876543210",
      dateOfBirth: "2000-01-15",
      currentCity: "Pune",
    };
    const validAgeResult = personalDetailsSchema.safeParse(validAgePayload);
    assert(validAgeResult.success, "Accepts candidate who is 24+ years old");
  }

  // TEST SUITE 2: Education Repeating List & At Least One Required
  console.log("\n--- 2. Education Schema & Repeating Array ---");
  {
    const emptyEducation: any[] = [];
    const emptyResult = educationListSchema.safeParse(emptyEducation);
    assert(!emptyResult.success, "Rejects empty education list");

    const validEducation = [
      {
        degree: "B.Tech Computer Engineering",
        institution: "Pune University",
        yearOfPassing: 2022,
        percentage: 85.5,
      },
    ];
    const validEduResult = educationListSchema.safeParse(validEducation);
    assert(validEduResult.success, "Accepts valid qualification record");
  }

  // TEST SUITE 3: Experience Discriminated Union & Date Multi-Field Rule
  console.log("\n--- 3. Experience Discriminated Union & Company Dates ---");
  {
    // Fresher
    const fresherPayload = {
      experienceType: "fresher" as const,
      availability: "Immediate",
    };
    const fresherResult = experienceSchema.safeParse(fresherPayload);
    assert(fresherResult.success, "Accepts valid fresher payload with availability");

    // Experienced with toDate < fromDate
    const invalidDatesPayload = {
      experienceType: "experienced" as const,
      totalExperienceYears: 3.5,
      noticePeriodDays: 30,
      companies: [
        {
          companyName: "Acme Corp",
          role: "Developer",
          fromDate: "2023-01-01",
          toDate: "2022-01-01", // Invalid: toDate is before fromDate!
        },
      ],
    };
    const invalidDatesResult = experienceSchema.safeParse(invalidDatesPayload);
    assert(!invalidDatesResult.success, "Rejects previous company where toDate is before fromDate");
    if (!invalidDatesResult.success) {
      const issue = invalidDatesResult.error.issues.find((i) => i.path.includes("toDate"));
      assert(
        Boolean(issue && issue.message.includes("must be after start date")),
        "Error message specifies 'to' date must be after 'from' date"
      );
    }

    // Experienced with valid dates
    const validExpPayload = {
      experienceType: "experienced" as const,
      totalExperienceYears: 3.5,
      noticePeriodDays: 30,
      companies: [
        {
          companyName: "Acme Corp",
          role: "Senior Software Engineer",
          fromDate: "2021-06-01",
          toDate: "2024-05-31",
        },
      ],
    };
    const validExpResult = experienceSchema.safeParse(validExpPayload);
    assert(validExpResult.success, "Accepts valid experienced payload with company history");
  }

  // TEST SUITE 4: Application Details & Joining Date Multi-Field Rule
  console.log("\n--- 4. Application Details & Future Joining Date ---");
  {
    const pastJoiningDatePayload = {
      position: "Frontend Engineer",
      expectedJoiningDate: "2020-01-01", // In past
      portfolioLink: "https://github.com",
      coverNote: "Excited to apply!",
      acceptanceOfTerms: true,
    };
    const pastResult = applicationDetailsSchema.safeParse(pastJoiningDatePayload);
    assert(!pastResult.success, "Rejects joining date set in the past");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);
    const validAppPayload = {
      position: "Frontend Engineer",
      expectedJoiningDate: futureDate.toISOString().split("T")[0],
      portfolioLink: "https://github.com/developer",
      coverNote: "Excited to join Raja Software!",
      acceptanceOfTerms: true,
    };
    const validAppResult = applicationDetailsSchema.safeParse(validAppPayload);
    assert(validAppResult.success, "Accepts valid application details with future joining date");
  }

  // TEST SUITE 5: Cross-Step Multi-Field Validation (Root Form Schema)
  console.log("\n--- 5. Root Form Schema Cross-Step Multi-Field Rules ---");
  {
    const futureDateFar = new Date();
    futureDateFar.setDate(futureDateFar.getDate() + 90);

    const fullFormValid = {
      personal: {
        fullName: "Harshal Modhave",
        email: "harshal@example.com",
        phone: "+91 9876543210",
        dateOfBirth: "1998-05-20",
        currentCity: "Pune",
      },
      education: [
        {
          degree: "B.Tech Computer Science",
          institution: "College of Engineering Pune",
          yearOfPassing: 2020,
          percentage: 88,
        },
      ],
      experience: {
        experienceType: "experienced" as const,
        totalExperienceYears: 4,
        noticePeriodDays: 60,
        companies: [
          {
            companyName: "Tech Solutions Inc",
            role: "Software Engineer",
            fromDate: "2020-07-01",
            toDate: "2024-06-30",
          },
        ],
      },
      application: {
        position: "Frontend Engineer",
        expectedJoiningDate: futureDateFar.toISOString().split("T")[0], // 90 days > 60 days notice
        portfolioLink: "https://portfolio.example.com",
        coverNote: "Experienced React and TypeScript engineer.",
        acceptanceOfTerms: true,
      },
    };

    const validRootResult = jobApplicationFormSchema.safeParse(fullFormValid);
    assert(validRootResult.success, "Root schema accepts fully valid 5-step form");

    // Cross-step failure: Notice period is 60 days, but joining date is only 10 days away!
    const soonJoiningDate = new Date();
    soonJoiningDate.setDate(soonJoiningDate.getDate() + 10);
    const noticePeriodViolation = {
      ...fullFormValid,
      application: {
        ...fullFormValid.application,
        expectedJoiningDate: soonJoiningDate.toISOString().split("T")[0],
      },
    };
    const noticeViolationResult = jobApplicationFormSchema.safeParse(noticePeriodViolation);
    assert(
      !noticeViolationResult.success,
      "Rejects joining date that violates 60-day notice period constraint"
    );
    if (!noticeViolationResult.success) {
      const issue = noticeViolationResult.error.issues.find(
        (i) => i.path.includes("expectedJoiningDate")
      );
      assert(
        Boolean(issue && issue.message.includes("notice period")),
        "Error message specifies joining date must honor candidate notice period"
      );
    }
  }

  // TEST SUITE 6: Mock API Three Outcomes
  console.log("\n--- 6. Mock API 3-Outcome Simulation Tests ---");
  {
    const dummyData = {} as any;

    // Outcome 1: Success
    const startTime = Date.now();
    const successRes = await submitJobApplication(dummyData, "success");
    const duration = Date.now() - startTime;
    assert(successRes.success === true, "Mock API simulates successful 200 submission");
    assert(Boolean(successRes.applicationId), `Generated Application ID: ${successRes.applicationId}`);
    assert(duration >= 1400, `Paused for approximately 1.5s (measured: ${duration}ms)`);

    // Outcome 2: Field-level validation error
    let caughtFieldError = false;
    try {
      await submitJobApplication(dummyData, "field_error");
    } catch (err) {
      if (err instanceof ApiValidationError) {
        caughtFieldError = true;
        assert(
          Boolean(err.fieldErrors["personal.email"]),
          "Throws ApiValidationError with field-level error on 'personal.email'"
        );
      }
    }
    assert(caughtFieldError, "Mock API simulates field-level validation failure");

    // Outcome 3: Server error (500)
    let caughtServerError = false;
    try {
      await submitJobApplication(dummyData, "server_error");
    } catch (err) {
      if (err instanceof ApiServerError) {
        caughtServerError = true;
        assert(
          err.message.includes("500 Internal Server Error"),
          "Throws ApiServerError with HTTP 500 error message"
        );
      }
    }
    assert(caughtServerError, "Mock API simulates server 500 failure");
  }

  console.log(`\n======================================================`);
  console.log(`SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`======================================================\n`);

  if (failedCount > 0) {
    throw new Error(`Test suite failed with ${failedCount} errors`);
  }
}

runTests();
