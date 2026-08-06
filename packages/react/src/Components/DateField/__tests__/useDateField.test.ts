// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useDateField, type DateFieldProps } from "@/Components/DateField";

function renderUseDateField(props: DateFieldProps = {}) {
  return renderHook(() => useDateField(props));
}

test("it should start closed", () => {
  const { result } = renderUseDateField();

  expect(result.current.open).toBe(false);
});

test("it should default to single mode", () => {
  const { result } = renderUseDateField();

  expect(result.current.mode).toBe("single");
});
