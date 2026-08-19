// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useStepper } from "@/Components/Stepper/hooks/useStepper";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  size: "md",
  linear: true,
  color: "primary",
  orientation: "horizontal",
} as const;

test("it should expose context defaults from useStepper", () => {
  const { result } = renderHook(() => useStepper({}, libDefaults));

  expect(result.current.contextValue.linear).toBe(true);
  expect(result.current.contextValue.activeStep).toBe(0);
  expect(result.current.contextValue.orientation).toBe("horizontal");
});

test("it should use defaultActiveStep when uncontrolled", () => {
  const { result } = renderHook(() =>
    useStepper({ defaultActiveStep: 2 }, libDefaults),
  );

  expect(result.current.contextValue.activeStep).toBe(2);
});

test("it should prefer controlled activeStep", () => {
  const { result } = renderHook(() =>
    useStepper({ activeStep: 1, defaultActiveStep: 2 }, libDefaults),
  );

  expect(result.current.contextValue.activeStep).toBe(1);
});
