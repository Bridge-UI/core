// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useCheckbox, type CheckboxOwnProps } from "@/Components/Checkbox";

const libDefaults = {
  size: "md",
  rounded: "sm",
  color: "primary",
} as const satisfies Partial<CheckboxOwnProps>;

function renderUseCheckbox(props: CheckboxOwnProps = {}, lib = libDefaults) {
  return renderHook(() => useCheckbox(props, lib));
}

test("it should apply default md size classes on control", () => {
  const { result } = renderUseCheckbox();

  expect(result.current.controlBind.className).toContain("w-5");
  expect(result.current.controlBind.className).toContain("h-5");
});

test("it should default to unchecked in uncontrolled mode", () => {
  const { result } = renderUseCheckbox();

  expect(result.current.checked).toBe(false);
});

test("it should reflect checked prop in controlled mode", () => {
  const { result } = renderUseCheckbox({ checked: true });

  expect(result.current.checked).toBe(true);
});

test("it should set checkbox type on inputBind", () => {
  const { result } = renderUseCheckbox();

  expect(result.current.inputBind.type).toBe("checkbox");
});

test("it should hide native input visually", () => {
  const { result } = renderUseCheckbox();

  expect(result.current.inputBind.className).toContain("sr-only");
});

test("it should use error color on control when invalid and checked", () => {
  const { result } = renderUseCheckbox({ error: true, checked: true });

  expect(result.current.controlBind.className).toContain("bg-error-600");
});
