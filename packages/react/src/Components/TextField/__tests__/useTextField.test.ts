// ** External Imports
import { renderHook } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTextField,
  type TextFieldOwnProps,
  type TextFieldProps,
} from "@/Components/TextField";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} as const satisfies Partial<TextFieldOwnProps>;

function renderUseTextField(props: TextFieldProps = {}) {
  return renderHook(() =>
    useTextField(props, libDefaults as Parameters<typeof useTextField>[1]),
  );
}

test("it should merge default color, size, rounded, and variant", () => {
  const { result } = renderUseTextField();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.rounded).toBe("md");
  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.variant).toBe("outline");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseTextField({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderUseTextField({ disabled: true });

  expect(result.current.isDisabled).toBe(true);
});

test("it should be readonly when readonly prop is true", () => {
  const { result } = renderUseTextField({ readonly: true });

  expect(result.current.isReadonly).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const { result } = renderUseTextField({ error: true });

  expect(result.current.invalidated).toBe(true);
});

test("it should build header bind when label prop is provided", () => {
  const { result } = renderUseTextField({ label: "Email" });

  expect(result.current.headerBind.className).toContain("flex");
  expect(result.current.headerBind.className).toContain("justify-between");
});

test("it should build header bind when only corner prop is provided", () => {
  const { result } = renderUseTextField({ corner: "Optional" });

  expect(result.current.headerBind.className).toContain("flex");
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { result } = renderUseTextField({ description: "Helper" });

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.inputId}-description`,
  );
});

test("it should omit description from aria-describedby when field is invalid", () => {
  const { result } = renderUseTextField({
    error: true,
    description: "Helper text",
  });

  expect(result.current.inputBind["aria-describedby"]).toBeUndefined();
});

test("it should set aria-describedby to error id when errorMessage is set", () => {
  const { result } = renderUseTextField({ errorMessage: "Required" });

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.inputId}-error`,
  );
});

test("it should keep start text in merged when start prop is set", () => {
  const { result } = renderUseTextField({ start: "https://" });

  expect(result.current.merged.start).toBe("https://");
});

test("it should keep startIcon in merged when startIcon is set", () => {
  const { result } = renderUseTextField({ startIcon: CircleAlert });

  expect(result.current.merged.startIcon).toStrictEqual(CircleAlert);
});

test("it should apply error end styles when error is true", () => {
  const { result } = renderUseTextField({ error: true });

  expect(result.current.endBind.className).toContain("text-error-500");
});

test("it should keep endIcon in merged when endIcon is set", () => {
  const { result } = renderUseTextField({ endIcon: CircleAlert });

  expect(result.current.merged.endIcon).toStrictEqual(CircleAlert);
});

test("it should set aria-invalid on input when error is true", () => {
  const { result } = renderUseTextField({ error: true });

  expect(result.current.inputBind["aria-invalid"]).toBe(true);
});

test("it should keep error focus ring on container when invalidated", () => {
  const { result } = renderUseTextField({ error: true });

  expect(result.current.containerBind.className).toContain(
    "focus-within:ring-error-600",
  );
  expect(result.current.containerBind.className).not.toContain(
    "focus-within:ring-primary-600",
  );
});

test("it should use id from props for inputId", () => {
  const { result } = renderUseTextField({ id: "custom-field" });

  expect(result.current.inputId).toBe("custom-field");
  expect(result.current.inputBind.id).toBe("custom-field");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseTextField({ className: "custom-field" });

  expect(result.current.rootBind.className).toContain("w-full");
  expect(result.current.rootBind.className).toContain("custom-field");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseTextField({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});
