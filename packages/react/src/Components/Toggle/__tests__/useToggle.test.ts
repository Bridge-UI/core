// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useToggle, type ToggleOwnProps } from "@/Components/Toggle";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
} as const satisfies Partial<ToggleOwnProps>;

function renderUseToggle(props: ToggleOwnProps = {}) {
  return renderHook(() => useToggle(props, libDefaults));
}

test("it should default to unchecked in uncontrolled mode", () => {
  const { result } = renderUseToggle();

  expect(result.current.checked).toBe(false);
});

test("it should reflect checked prop in controlled mode", () => {
  const { result } = renderUseToggle({ checked: true });

  expect(result.current.checked).toBe(true);
});

test("it should set switch role on inputBind", () => {
  const { result } = renderUseToggle();

  expect(result.current.inputBind.role).toBe("switch");
});

test("it should apply checked track classes when checked", () => {
  const { result } = renderUseToggle({ checked: true });

  expect(result.current.trackBind.className).toMatch(/bg-/);
});

test("it should mark switcher as invalidated when error is set", () => {
  const { result } = renderUseToggle({ error: true });

  expect(result.current.switcher.invalidated).toBe(true);
});
