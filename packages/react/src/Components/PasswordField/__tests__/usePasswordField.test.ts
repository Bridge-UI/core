// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { usePasswordField } from "@/Components/PasswordField";

test("it should default to hidden password", () => {
  const { result } = renderHook(() => usePasswordField({}));

  expect(result.current.isVisible).toBe(false);
});

test("it should use visible prop when controlled", () => {
  const { result } = renderHook(() => usePasswordField({ visible: true }));

  expect(result.current.isVisible).toBe(true);
});

test("it should toggle visibility when uncontrolled", () => {
  const { result } = renderHook(() => usePasswordField({}));

  act(() => {
    result.current.toggleVisibility();
  });

  expect(result.current.isVisible).toBe(true);

  act(() => {
    result.current.toggleVisibility();
  });

  expect(result.current.isVisible).toBe(false);
});

test("it should not update internal state when visible is controlled", () => {
  const onVisibilityChange = vi.fn();

  const { result, rerender } = renderHook(
    ({ visible }) => usePasswordField({ visible, onVisibilityChange }),
    { initialProps: { visible: false } },
  );

  act(() => {
    result.current.toggleVisibility();
  });

  expect(result.current.isVisible).toBe(false);

  expect(onVisibilityChange).toHaveBeenCalledWith(true);

  rerender({ visible: true });

  expect(result.current.isVisible).toBe(true);
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

  expect(onVisibilityChange).toHaveBeenCalledWith(false);
});
