// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTimeRangeField,
  type TimeRangeFieldProps,
} from "@/Components/TimeRangeField";

function renderUseTimeRangeField(props: TimeRangeFieldProps = {}) {
  return renderHook(() => useTimeRangeField(props));
}

test("it should start closed", () => {
  const { result } = renderUseTimeRangeField();

  expect(result.current.open).toBe(false);
});

test("it should expose a null model by default", () => {
  const { result } = renderUseTimeRangeField();

  expect(result.current.modelValue).toBeNull();
});
