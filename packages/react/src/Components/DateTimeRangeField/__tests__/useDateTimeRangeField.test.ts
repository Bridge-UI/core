// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useDateTimeRangeField } from "@/Components/DateTimeRangeField";

test("it should default to a closed menu", () => {
  const { result } = renderHook(() => useDateTimeRangeField({}));

  expect(result.current.open).toBe(false);
});

test("it should expose null model when uncontrolled without default", () => {
  const { result } = renderHook(() => useDateTimeRangeField({}));

  expect(result.current.modelValue).toBeNull();
});
