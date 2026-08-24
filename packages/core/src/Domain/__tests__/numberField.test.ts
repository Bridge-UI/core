// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getNumberFieldStepper,
  resolveNumberFieldStepperIconSize,
} from "@/Domain/numberField";

describe("getNumberFieldStepper", () => {
  test("it should stack increment above decrement by default", () => {
    expect(getNumberFieldStepper()).toEqual({
      isSplit: false,
      incrementFirst: true,
      incrementIcon: "chevronUp",
      decrementIcon: "chevronDown",
    });
    expect(getNumberFieldStepper("stacked")).toEqual(getNumberFieldStepper());
  });

  test("it should place decrement before increment in the inline row", () => {
    expect(getNumberFieldStepper("inline")).toEqual({
      isSplit: false,
      incrementFirst: false,
      incrementIcon: "chevronUp",
      decrementIcon: "chevronDown",
    });
  });

  test("it should use plus and minus icons when split", () => {
    expect(getNumberFieldStepper("split")).toEqual({
      isSplit: true,
      incrementFirst: false,
      incrementIcon: "plus",
      decrementIcon: "minus",
    });
  });
});

describe("resolveNumberFieldStepperIconSize", () => {
  test("it should use a smaller glyph for stacked md fields", () => {
    expect(resolveNumberFieldStepperIconSize()).toBe("xs");
    expect(resolveNumberFieldStepperIconSize("md", "stacked")).toBe("xs");
  });

  test("it should use sm icons for inline and split md fields", () => {
    expect(resolveNumberFieldStepperIconSize("md", "inline")).toBe("sm");
    expect(resolveNumberFieldStepperIconSize("md", "split")).toBe("sm");
  });

  test("it should scale stacked icons with field size", () => {
    expect(resolveNumberFieldStepperIconSize("lg", "stacked")).toBe("sm");
    expect(resolveNumberFieldStepperIconSize("2xl", "stacked")).toBe("md");
  });
});
