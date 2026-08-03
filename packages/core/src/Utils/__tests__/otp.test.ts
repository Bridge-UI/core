// @vitest-environment happy-dom

// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DEFAULT_OTP_LENGTH,
  applyOtpInput,
  applyOtpKeyNavigation,
  applyOtpPaste,
  isOtpCharAllowed,
  isOtpComplete,
  joinOtpDigits,
  normalizeOtpValue,
  resolveOtpLength,
  splitOtpValue,
} from "@/Utils/otp";

describe("resolveOtpLength", () => {
  test("it should default to DEFAULT_OTP_LENGTH", () => {
    expect(resolveOtpLength()).toBe(DEFAULT_OTP_LENGTH);
  });

  test("it should clamp to a minimum of 1", () => {
    expect(resolveOtpLength(0)).toBe(1);
    expect(resolveOtpLength(-3)).toBe(1);
  });
});

describe("isOtpCharAllowed", () => {
  test("it should allow digits for numeric", () => {
    expect(isOtpCharAllowed("5", "numeric")).toBe(true);
    expect(isOtpCharAllowed("a", "numeric")).toBe(false);
  });

  test("it should allow letters and digits for alphanumeric", () => {
    expect(isOtpCharAllowed("A", "alphanumeric")).toBe(true);
    expect(isOtpCharAllowed("9", "alphanumeric")).toBe(true);
    expect(isOtpCharAllowed("-", "alphanumeric")).toBe(false);
  });
});

describe("normalizeOtpValue", () => {
  test("it should strip invalid characters and cap length", () => {
    expect(normalizeOtpValue("12a34", 4, "numeric")).toBe("1234");
  });

  test("it should uppercase alphanumeric characters", () => {
    expect(normalizeOtpValue("ab-12", 4, "alphanumeric")).toBe("AB12");
  });
});

describe("splitOtpValue / joinOtpDigits", () => {
  test("it should split into fixed-length slots", () => {
    expect(splitOtpValue("12", 4)).toEqual(["1", "2", "", ""]);
  });

  test("it should join digits", () => {
    expect(joinOtpDigits(["1", "2", "", "4"])).toBe("124");
  });
});

describe("applyOtpInput", () => {
  test("it should set a digit and advance focus", () => {
    expect(
      applyOtpInput({
        index: 0,
        input: "9",
        type: "numeric",
        digits: ["", "", ""],
      }),
    ).toEqual({ focusIndex: 1, digits: ["9", "", ""] });
  });

  test("it should clear a digit", () => {
    expect(
      applyOtpInput({
        index: 1,
        input: "",
        type: "numeric",
        digits: ["1", "2", "3"],
      }),
    ).toEqual({ focusIndex: 1, digits: ["1", "", "3"] });
  });
});

describe("applyOtpPaste", () => {
  test("it should spread pasted digits from the start index", () => {
    expect(
      applyOtpPaste({
        index: 1,
        pasted: "789",
        type: "numeric",
        digits: ["1", "", "", ""],
      }),
    ).toEqual({ focusIndex: 3, digits: ["1", "7", "8", "9"] });
  });
});

describe("applyOtpKeyNavigation", () => {
  test("it should clear current digit on Backspace", () => {
    expect(
      applyOtpKeyNavigation({
        index: 1,
        key: "Backspace",
        digits: ["1", "2", "3"],
      }),
    ).toEqual({ focusIndex: 1, digits: ["1", "", "3"] });
  });

  test("it should move left when Backspace on empty slot", () => {
    expect(
      applyOtpKeyNavigation({
        index: 1,
        key: "Backspace",
        digits: ["1", "", "3"],
      }),
    ).toEqual({ focusIndex: 0, digits: ["", "", "3"] });
  });

  test("it should move focus with arrows", () => {
    expect(
      applyOtpKeyNavigation({
        index: 2,
        key: "ArrowLeft",
        digits: ["1", "2", "3"],
      }),
    ).toEqual({ focusIndex: 1, digits: ["1", "2", "3"] });
  });
});

describe("isOtpComplete", () => {
  test("it should require a full-length value", () => {
    expect(isOtpComplete("123456")).toBe(true);
    expect(isOtpComplete("12345")).toBe(false);
  });
});
