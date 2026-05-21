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

const libDefaults: Partial<TextFieldOwnProps> = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
};

function renderUseTextField(props: TextFieldProps = {}) {
  return renderHook(() => useTextField(props, libDefaults));
}

test("it should merge default color, size, rounded, and variant", () => {
  const { result } = renderUseTextField();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.rounded).toBe("md");
  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.variant).toBe("outline");
});

test("it should use md size and rounded when hook is called without libDefaults", () => {
  const { result } = renderHook(() => useTextField({}));

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.rounded).toBe("md");
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

test("it should show header when label prop is provided", () => {
  const { result } = renderUseTextField({ label: "Email" });

  expect(result.current.showHeader).toBe(true);
});

test("it should show header when only corner prop is provided", () => {
  const { result } = renderUseTextField({ corner: "Optional" });

  expect(result.current.showHeader).toBe(true);
});

test("it should show description when description is set and field is valid", () => {
  const { result } = renderUseTextField({ description: "Helper text" });

  expect(result.current.showDescription).toBe(true);
});

test("it should hide description when field is invalid", () => {
  const { result } = renderUseTextField({
    error: true,
    description: "Helper text",
  });

  expect(result.current.showDescription).toBe(false);
});

test("it should show error message when errorMessage is set", () => {
  const { result } = renderUseTextField({ errorMessage: "Required" });

  expect(result.current.showError).toBe(true);
});

test("it should hide error message when only error is true", () => {
  const { result } = renderUseTextField({ error: true });

  expect(result.current.showError).toBe(false);
});

test("it should show start text when start prop is set", () => {
  const { result } = renderUseTextField({ start: "https://" });

  expect(result.current.showStartText).toBe(true);
  expect(result.current.showStartIcon).toBe(false);
});

test("it should show start icon when startIcon is set", () => {
  const { result } = renderUseTextField({ startIcon: CircleAlert });

  expect(result.current.showStartIcon).toBe(true);
});

test("it should show error icon when error is true and no end icon", () => {
  const { result } = renderUseTextField({ error: true });

  expect(result.current.showErrorIcon).toBe(true);
});

test("it should show error icon instead of end icon when both are set", () => {
  const { result } = renderUseTextField({
    error: true,
    endIcon: CircleAlert,
  });

  expect(result.current.showErrorIcon).toBe(true);
  expect(result.current.showEndIcon).toBe(false);
});

test("it should hide error icon when withErrorIcon is false", () => {
  const { result } = renderUseTextField({
    error: true,
    withErrorIcon: false,
  });

  expect(result.current.showErrorIcon).toBe(false);
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

test("it should set aria-describedby to description id when description is shown", () => {
  const { result } = renderUseTextField({ description: "Helper" });

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.inputId}-description`,
  );
});

test("it should set aria-describedby to error id when errorMessage is shown", () => {
  const { result } = renderUseTextField({ errorMessage: "Required" });

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.inputId}-error`,
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
