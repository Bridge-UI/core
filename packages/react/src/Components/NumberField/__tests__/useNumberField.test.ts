// ** External Imports
import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { useNumberField } from "@/Components/NumberField";

function createChangeEvent(value: string) {
  return {
    target: { value },
  } as ChangeEvent<HTMLInputElement>;
}

test("it should return undefined inputValue when no value is set", () => {
  const { result } = renderHook(() => useNumberField({}));

  expect(result.current.inputValue).toBeUndefined();
  expect(result.current.currentValue).toBeUndefined();
});

test("it should use controlled value", () => {
  const { result } = renderHook(() => useNumberField({ value: 5 }));

  expect(result.current.inputValue).toBe("5");
  expect(result.current.currentValue).toBe(5);
});

test("it should initialize from defaultValue when uncontrolled", () => {
  const { result } = renderHook(() => useNumberField({ defaultValue: 3 }));

  expect(result.current.inputValue).toBe("3");
  expect(result.current.currentValue).toBe(3);
});

test("it should call onChange with parsed number on handleChange", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useNumberField({ onChange }));

  act(() => {
    result.current.handleChange(createChangeEvent("42"));
  });

  expect(onChange).toHaveBeenCalledWith(42);
  expect(result.current.currentValue).toBe(42);
});

test("it should ignore invalid numeric input", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useNumberField({ onChange }));

  act(() => {
    result.current.handleChange(createChangeEvent("abc"));
  });

  expect(onChange).not.toHaveBeenCalled();
});

test("it should clear internal value when input is emptied", () => {
  const { result } = renderHook(() => useNumberField({ defaultValue: 10 }));

  act(() => {
    result.current.handleChange(createChangeEvent(""));
  });

  expect(result.current.inputValue).toBeUndefined();
  expect(result.current.currentValue).toBeUndefined();
});

test("it should increment by step", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ value: 2, step: 2, onChange }),
  );

  act(() => {
    result.current.increment();
  });

  expect(onChange).toHaveBeenCalledWith(4);
});

test("it should decrement by step", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ value: 4, step: 2, onChange }),
  );

  act(() => {
    result.current.decrement();
  });

  expect(onChange).toHaveBeenCalledWith(2);
});

test("it should not increment above max", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ value: 10, max: 10, onChange }),
  );

  act(() => {
    result.current.increment();
  });

  expect(onChange).not.toHaveBeenCalled();
});

test("it should not decrement below min", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useNumberField({ value: 0, min: 0, onChange }),
  );

  act(() => {
    result.current.decrement();
  });

  expect(onChange).not.toHaveBeenCalled();
});

test("it should use min as base when value is undefined", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useNumberField({ min: 5, onChange }));

  act(() => {
    result.current.increment();
  });

  expect(onChange).toHaveBeenCalledWith(6);
});

test("it should not update controlled value internally on handleChange", () => {
  const onChange = vi.fn();
  const { result, rerender } = renderHook(
    ({ value }) => useNumberField({ value, onChange }),
    { initialProps: { value: 1 } },
  );

  act(() => {
    result.current.handleChange(createChangeEvent("9"));
  });

  expect(onChange).toHaveBeenCalledWith(9);
  expect(result.current.inputValue).toBe("1");

  rerender({ value: 9 });

  expect(result.current.inputValue).toBe("9");
});
