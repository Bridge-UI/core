// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useDateTimeField,
  type DateTimeFieldProps,
} from "@/Components/DateTimeField";

function renderUseDateTimeField(props: DateTimeFieldProps = {}) {
  return renderHook(() => useDateTimeField(props));
}

test("it should start closed", () => {
  const { result } = renderUseDateTimeField();

  expect(result.current.open).toBe(false);
});

test("it should expose a null model by default", () => {
  const { result } = renderUseDateTimeField();

  expect(result.current.modelValue).toBeNull();
});
