// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { useNumberField } from "@/Components/NumberField";

test("it should return empty input value when no value is set", () => {
  const { result } = renderHook(() => useNumberField({}));

  expect(result.current.isSplit).toBe(false);
  expect(result.current.inputBind.value).toBe("");
  expect(result.current.incrementFirst).toBe(true);
});

test("it should expose split stepper flags when controlVariant is split", () => {
  const { result } = renderHook(() =>
    useNumberField({ controlVariant: "split" }),
  );

  expect(result.current.isSplit).toBe(true);
  expect(result.current.incrementFirst).toBe(false);
  expect(result.current.incrementIcon).toBe("plus");
  expect(result.current.decrementIcon).toBe("minus");
});

test("it should reflect controlled value", () => {
  const { result } = renderHook(() => useNumberField({ value: 5 }));

  expect(result.current.inputBind.value).toBe("5");
});

test("it should increment by step", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ step: 2, onChange, value: 2 }),
  );

  act(() => {
    result.current.increment();
  });

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should respect max when incrementing", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ max: 9, step: 2, onChange, value: 8 }),
  );

  let didIncrement = false;

  act(() => {
    didIncrement = result.current.increment();
  });

  expect(didIncrement).toBe(false);
  expect(onChange).not.toHaveBeenCalled();
});
