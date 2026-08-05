// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useDateInput, type DateInputProps } from "@/Components/DateInput";

function renderUseDateInput(props: DateInputProps = {}) {
  return renderHook(() => useDateInput(props));
}

test("it should start closed", () => {
  const { result } = renderUseDateInput();

  expect(result.current.open).toBe(false);
});

test("it should default to single mode", () => {
  const { result } = renderUseDateInput();

  expect(result.current.mode).toBe("single");
});
