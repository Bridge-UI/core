// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  formatStepperStepNumber,
  getAdjacentStepperIndex,
  getStepperStepContentId,
  getStepperStepId,
  isStepperStepClickable,
  isStepperStepCompleted,
  resolveStepperStepStatus,
} from "@/Domain/stepper";

describe("getStepperStepId", () => {
  test("it should build a stable step id", () => {
    expect(getStepperStepId("stepper-1", 2)).toBe("stepper-1-step-2");
  });
});

describe("getStepperStepContentId", () => {
  test("it should build a stable content id", () => {
    expect(getStepperStepContentId("stepper-1", 2)).toBe("stepper-1-content-2");
  });
});

describe("formatStepperStepNumber", () => {
  test("it should return a 1-based number", () => {
    expect(formatStepperStepNumber(0)).toBe("1");
    expect(formatStepperStepNumber(9)).toBe("10");
  });
});

describe("isStepperStepCompleted", () => {
  test("it should derive completed from index when override is omitted", () => {
    expect(isStepperStepCompleted({ index: 0, activeStep: 1 })).toBe(true);
    expect(isStepperStepCompleted({ index: 1, activeStep: 1 })).toBe(false);
    expect(isStepperStepCompleted({ index: 2, activeStep: 1 })).toBe(false);
  });

  test("it should honor an explicit completed override", () => {
    expect(
      isStepperStepCompleted({ index: 2, activeStep: 0, completed: true }),
    ).toBe(true);
    expect(
      isStepperStepCompleted({ index: 0, activeStep: 2, completed: false }),
    ).toBe(false);
  });
});

describe("resolveStepperStepStatus", () => {
  test("it should resolve completed, active, and upcoming", () => {
    expect(resolveStepperStepStatus({ index: 0, activeStep: 1 })).toBe(
      "completed",
    );
    expect(resolveStepperStepStatus({ index: 1, activeStep: 1 })).toBe(
      "active",
    );
    expect(resolveStepperStepStatus({ index: 2, activeStep: 1 })).toBe(
      "upcoming",
    );
  });

  test("it should let error win over completed and active", () => {
    expect(
      resolveStepperStepStatus({ index: 0, error: true, activeStep: 1 }),
    ).toBe("error");
    expect(
      resolveStepperStepStatus({ index: 1, error: true, activeStep: 1 }),
    ).toBe("error");
  });
});

describe("isStepperStepClickable", () => {
  test("it should block disabled steps", () => {
    expect(
      isStepperStepClickable({
        index: 0,
        linear: false,
        activeStep: 0,
        disabled: true,
      }),
    ).toBe(false);
  });

  test("it should allow any step when linear is off", () => {
    expect(
      isStepperStepClickable({
        index: 2,
        linear: false,
        activeStep: 0,
      }),
    ).toBe(true);
  });

  test("it should block jumping ahead in linear mode", () => {
    expect(
      isStepperStepClickable({
        index: 2,
        linear: true,
        activeStep: 0,
      }),
    ).toBe(false);
    expect(
      isStepperStepClickable({
        index: 0,
        linear: true,
        activeStep: 1,
      }),
    ).toBe(true);
    expect(
      isStepperStepClickable({
        index: 1,
        linear: true,
        activeStep: 1,
      }),
    ).toBe(true);
  });

  test("it should allow a forced-completed upcoming step in linear mode", () => {
    expect(
      isStepperStepClickable({
        index: 2,
        linear: true,
        activeStep: 0,
        completed: true,
      }),
    ).toBe(true);
  });
});

describe("getAdjacentStepperIndex", () => {
  test("it should move forward and skip blocked indices", () => {
    expect(getAdjacentStepperIndex(3, 0, 1)).toBe(1);
    expect(getAdjacentStepperIndex(3, 0, 1, new Set([1]))).toBe(2);
    expect(getAdjacentStepperIndex(3, 2, 1)).toBe(0);
  });

  test("it should return current when every index is blocked", () => {
    expect(getAdjacentStepperIndex(2, 0, 1, new Set([0, 1]))).toBe(0);
  });
});
