// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useDateRangeField } from "@/Components/DateRangeField";

test("it should default to a closed menu", () => {
  const { result } = renderHook(() => useDateRangeField({}));

  expect(result.current.open).toBe(false);
});

test("it should expose null model when uncontrolled without default", () => {
  const { result } = renderHook(() => useDateRangeField({}));

  expect(result.current.modelValue).toBeNull();
});
