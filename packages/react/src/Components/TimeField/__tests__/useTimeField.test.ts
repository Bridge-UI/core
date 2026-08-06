// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useTimeField, type TimeFieldProps } from "@/Components/TimeField";

function renderUseTimeField(props: TimeFieldProps = {}) {
  return renderHook(() => useTimeField(props));
}

test("it should start closed", () => {
  const { result } = renderUseTimeField();

  expect(result.current.open).toBe(false);
});

test("it should expose a null model by default", () => {
  const { result } = renderUseTimeField();

  expect(result.current.modelValue).toBeNull();
});
