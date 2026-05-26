// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTextarea,
  type TextareaOwnProps,
  type TextareaProps,
} from "@/Components/Textarea";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
} as const satisfies Partial<TextareaOwnProps>;

function renderUseTextarea(props: TextareaProps = {}) {
  return renderHook(() =>
    useTextarea(props, libDefaults as Parameters<typeof useTextarea>[1]),
  );
}

test("it should merge default color, size, rounded, and variant", () => {
  const { result } = renderUseTextarea();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.rounded).toBe("md");
  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.variant).toBe("outline");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseTextarea({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseTextarea({ size: "2xl" });

  expect(result.current.merged.size).toBe("2xl");
  expect(result.current.textareaBind.className).toContain("text-lg");
});

test("it should apply size typography classes on textarea bind", () => {
  const { result } = renderUseTextarea({ size: "2xs" });

  expect(result.current.textareaBind.className).toContain("text-2xs");
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderUseTextarea({ disabled: true });

  expect(result.current.isDisabled).toBe(true);
});

test("it should be readonly when readonly prop is true", () => {
  const { result } = renderUseTextarea({ readonly: true });

  expect(result.current.isReadonly).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const { result } = renderUseTextarea({ error: true });

  expect(result.current.invalidated).toBe(true);
});

test("it should build header bind when label prop is provided", () => {
  const { result } = renderUseTextarea({ label: "Notes" });

  expect(result.current.formField.headerBind.className).toContain("flex");
  expect(result.current.formField.headerBind.className).toContain(
    "justify-between",
  );
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { result } = renderUseTextarea({ description: "Helper" });

  expect(result.current.textareaBind["aria-describedby"]).toBe(
    `${result.current.formField.controlId}-description`,
  );
});

test("it should omit description from aria-describedby when field is invalid", () => {
  const { result } = renderUseTextarea({
    error: true,
    description: "Helper text",
  });

  expect(result.current.textareaBind["aria-describedby"]).toBeUndefined();
});

test("it should set aria-describedby to error id when errorMessage is set", () => {
  const { result } = renderUseTextarea({ errorMessage: "Required" });

  expect(result.current.textareaBind["aria-describedby"]).toBe(
    `${result.current.formField.controlId}-error`,
  );
});

test("it should set aria-invalid on textarea when error is true", () => {
  const { result } = renderUseTextarea({ error: true });

  expect(result.current.textareaBind["aria-invalid"]).toBe(true);
});

test("it should apply error ring classes on container when invalidated", () => {
  const { result } = renderUseTextarea({ error: true });

  expect(result.current.containerBind.className).toContain("ring-error-500");
});

test("it should use id from props for textarea id", () => {
  const { result } = renderUseTextarea({ id: "custom-field" });

  expect(result.current.textareaBind.id).toBe("custom-field");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseTextarea({ className: "custom-field" });

  expect(result.current.rootBind.className).toContain("w-full");
  expect(result.current.rootBind.className).toContain("custom-field");
});

test("it should apply resize-none on textarea when autosize is enabled", () => {
  const { result } = renderUseTextarea({ autosize: true });

  expect(result.current.textareaBind.className).toContain("resize-none");
});

test("it should apply resize-y on textarea when autosize is disabled", () => {
  const { result } = renderUseTextarea();

  expect(result.current.textareaBind.className).toContain("resize-y");
});

test("it should merge classes.input onto the textarea", () => {
  const { result } = renderUseTextarea({
    classes: { input: "placeholder:italic" },
  });

  expect(result.current.textareaBind.className).toContain("placeholder:italic");
});

test("it should apply outline variant container classes by default", () => {
  const { result } = renderUseTextarea();

  expect(result.current.containerBind.className).toContain("ring-1");
  expect(result.current.containerBind.className).toContain("ring-inset");
});
