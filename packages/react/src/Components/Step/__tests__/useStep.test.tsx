// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useStep } from "@/Components/Step/hooks/useStep";
import { Stepper } from "@/Components/Stepper";

afterEach(() => {
  cleanup();
});

function wrapper({ children }: { children: ReactNode }) {
  return <Stepper activeStep={1}>{children}</Stepper>;
}

test("it should mark the first step as completed", () => {
  const { result } = renderHook(() => useStep({ label: "Account" }), {
    wrapper,
  });

  expect(result.current.index).toBe(0);
  expect(result.current.status).toBe("completed");
  expect(result.current.clickable).toBe(true);
});

test("it should mark an error step", () => {
  const { result } = renderHook(
    () => useStep({ error: true, label: "Account" }),
    { wrapper },
  );

  expect(result.current.status).toBe("error");
});
