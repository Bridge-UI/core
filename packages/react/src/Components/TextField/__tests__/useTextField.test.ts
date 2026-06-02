// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useTextField } from "@/Components/TextField";

test("it should merge default color, size, rounded, and variant", () => {
  const { result } = renderHook(() => useTextField({}));

  expect(result.current.formField.merged.size).toBe("md");
  expect(result.current.formField.merged.rounded).toBe("md");
  expect(result.current.formField.merged.color).toBe("primary");
  expect(result.current.formField.merged.variant).toBe("outline");
});

test("it should override color when prop is passed", () => {
  const { result } = renderHook(() => useTextField({ color: "error" }));

  expect(result.current.formField.merged.color).toBe("error");
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderHook(() => useTextField({ disabled: true }));

  expect(result.current.formField.isDisabled).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const { result } = renderHook(() => useTextField({ error: true }));

  expect(result.current.formField.invalidated).toBe(true);
});

test("it should set aria-invalid on input when error is true", () => {
  const { result } = renderHook(() => useTextField({ error: true }));

  expect(result.current.inputBind["aria-invalid"]).toBe(true);
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { result } = renderHook(() => useTextField({ description: "Helper" }));

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.formField.controlId}-description`,
  );
});

test("it should set aria-describedby to error id when errorMessage is shown", () => {
  const { result } = renderHook(() =>
    useTextField({ error: true, errorMessage: "Required" }),
  );

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.formField.controlId}-error`,
  );
});

test("it should merge className into rootBind", () => {
  const { result } = renderHook(() =>
    useTextField({ className: "custom-field" }),
  );

  expect(result.current.formField.rootBind.className).toContain("w-full");
  expect(result.current.formField.rootBind.className).toContain("custom-field");
});
