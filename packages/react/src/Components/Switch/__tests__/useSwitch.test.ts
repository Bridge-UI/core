// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useSwitch, type SwitchOwnProps } from "@/Components/Switch";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
} as const satisfies Partial<SwitchOwnProps>;

function renderUseSwitch(props: SwitchOwnProps = {}) {
  return renderHook(() => useSwitch(props, libDefaults));
}

test("it should default to unchecked in uncontrolled mode", () => {
  const { result } = renderUseSwitch();

  expect(result.current.checked).toBe(false);
});

test("it should reflect checked prop in controlled mode", () => {
  const { result } = renderUseSwitch({ checked: true });

  expect(result.current.checked).toBe(true);
});

test("it should set switch role on inputBind", () => {
  const { result } = renderUseSwitch();

  expect(result.current.inputBind.role).toBe("switch");
});

test("it should apply checked track classes when checked", () => {
  const { result } = renderUseSwitch({ checked: true });

  expect(result.current.trackBind.className).toMatch(/bg-/);
});

test("it should mark form control as invalidated when error is set", () => {
  const { result } = renderUseSwitch({ error: true });

  expect(result.current.formControl.invalidated).toBe(true);
});
