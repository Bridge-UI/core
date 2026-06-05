// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { useNumberField } from "@/Components/NumberField";

test("it should return undefined inputValue when no value is set", () => {
  const { result } = renderHook(() => useNumberField({}));

  expect(result.current.inputValue).toBeUndefined();
  expect(result.current.currentValue).toBeUndefined();
});

test("it should reflect controlled value", () => {
  const { result } = renderHook(() => useNumberField({ modelValue: 5 }));

  expect(result.current.inputValue).toBe("5");
  expect(result.current.currentValue).toBe(5);
});

test("it should increment by step", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ step: 2, onChange, modelValue: 2 }),
  );

  act(() => {
    result.current.increment();
  });

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should respect max when incrementing", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ max: 9, step: 2, onChange, modelValue: 8 }),
  );

  let didIncrement = false;

  act(() => {
    didIncrement = result.current.increment();
  });

  expect(didIncrement).toBe(false);
  expect(onChange).not.toHaveBeenCalled();
});
