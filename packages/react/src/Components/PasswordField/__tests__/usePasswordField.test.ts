// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { usePasswordField } from "@/Components/PasswordField";

test("it should default to hidden password", () => {
  const { result } = renderHook(() => usePasswordField());

  expect(result.current.isVisible).toBe(false);
});

test("it should use visible when controlled", () => {
  const { result } = renderHook(() => usePasswordField({ visible: true }));

  expect(result.current.isVisible).toBe(true);
});

test("it should toggle visibility when uncontrolled", () => {
  const { result } = renderHook(() => usePasswordField());

  act(() => {
    result.current.toggleVisibility();
  });

  expect(result.current.isVisible).toBe(true);

  act(() => {
    result.current.toggleVisibility();
  });

  expect(result.current.isVisible).toBe(false);
});

test("it should call onVisibilityChange when toggling", () => {
  const onVisibilityChange = vi.fn();
  const { result } = renderHook(() => usePasswordField({ onVisibilityChange }));

  act(() => {
    result.current.toggleVisibility();
  });

  expect(onVisibilityChange).toHaveBeenCalledWith(true);

  act(() => {
    result.current.toggleVisibility();
  });

  expect(onVisibilityChange).toHaveBeenLastCalledWith(false);
});
