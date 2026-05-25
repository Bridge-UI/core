// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useFormField,
  type FormFieldOwnProps,
  type FormFieldProps,
} from "@/Components/FormField";

const libDefaults = {
  size: "md",
} as const satisfies Partial<FormFieldOwnProps>;

function renderUseFormField(props: FormFieldProps = {}) {
  return renderHook(() =>
    useFormField(props, libDefaults as Parameters<typeof useFormField>[1]),
  );
}

test("it should default size to md", () => {
  const { result } = renderUseFormField();

  expect(result.current.merged.size).toBe("md");
});

test("it should apply size typography on corner bind", () => {
  const { result } = renderUseFormField({ size: "2xl" });

  expect(result.current.cornerBind.className).toContain("text-lg");
});

test("it should apply size typography on description bind", () => {
  const { result } = renderUseFormField({ size: "xs" });

  expect(result.current.descriptionBind.className).toContain("text-xs");
});

test("it should hide description in aria-describedby when invalidated", () => {
  const { result } = renderUseFormField({
    error: true,
    description: "Helper",
    errorMessage: "Required",
  });

  expect(result.current.ariaDescribedBy).toBe(
    `${result.current.controlId}-error`,
  );
});

test("it should use controlId when prop is set", () => {
  const { result } = renderUseFormField({ controlId: "custom-control" });

  expect(result.current.controlId).toBe("custom-control");
});

test("it should be invalidated when error is true", () => {
  const { result } = renderUseFormField({ error: true });

  expect(result.current.invalidated).toBe(true);
});

test("it should apply error color on label bind", () => {
  const { result } = renderUseFormField({ error: true });

  expect(result.current.labelBind.className).toContain("text-error-600");
});

test("it should style required asterisk bind", () => {
  const { result } = renderUseFormField({ required: true });

  expect(result.current.requiredBind.className).toContain("text-error-500");
});
