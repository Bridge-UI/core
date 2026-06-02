// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useRadio, type RadioOwnProps } from "@/Components/Radio";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
} as const satisfies Partial<RadioOwnProps>;

function renderUseRadio(props: RadioOwnProps = {}) {
  return renderHook(() => useRadio(props, libDefaults));
}

test("it should default to unchecked in uncontrolled mode", () => {
  const { result } = renderUseRadio({ value: "a" });

  expect(result.current.checked).toBe(false);
});

test("it should reflect checked prop in controlled mode", () => {
  const { result } = renderUseRadio({ value: "a", checked: true });

  expect(result.current.checked).toBe(true);
});

test("it should set radio type on inputBind", () => {
  const { result } = renderUseRadio({ value: "a" });

  expect(result.current.inputBind.type).toBe("radio");
});

test("it should forward value on inputBind", () => {
  const { result } = renderUseRadio({ value: "plan-a" });

  expect(result.current.inputBind.value).toBe("plan-a");
});

test("it should mark switcher as invalidated when error is set", () => {
  const { result } = renderUseRadio({ value: "a", error: true });

  expect(result.current.switcher.invalidated).toBe(true);
});
