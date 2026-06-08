// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useFormField, type FormFieldOwnProps } from "@/Components/FormField";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} satisfies Partial<FormFieldOwnProps>;

function renderUseFormField(
  props: Omit<FormFieldOwnProps, "field"> = {},
  options: Parameters<typeof useFormField>[2] = {},
) {
  return renderHook(() => useFormField(props, libDefaults, options));
}

test("it should merge default color, size, rounded, and variant", () => {
  const { result } = renderUseFormField();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.rounded).toBe("md");
  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.variant).toBe("outline");
});

test("it should default control to input", () => {
  const { result } = renderUseFormField();

  expect(result.current.control).toBe("input");
});

test("it should use textarea control when option is set", () => {
  const { result } = renderUseFormField({}, { control: () => "textarea" });

  expect(result.current.control).toBe("textarea");
});

test("it should apply textarea size classes when control is textarea", () => {
  const { result } = renderUseFormField({}, { control: () => "textarea" });

  expect(result.current.inputBind.className).toContain("py-2");
});

test("it should apply textareaLikeInput padding when likeInput is true", () => {
  const { result } = renderUseFormField(
    {},
    {
      likeInput: () => true,
      control: () => "textarea",
    },
  );

  expect(result.current.inputBind.className).toMatch(/py-\[calc/);
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderUseFormField({ disabled: true });

  expect(result.current.isDisabled).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const { result } = renderUseFormField({ error: true });

  expect(result.current.invalidated).toBe(true);
});

test("it should set aria-invalid on input when error is true", () => {
  const { result } = renderUseFormField({ error: true });

  expect(result.current.inputBind["aria-invalid"]).toBe(true);
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { result } = renderUseFormField({ description: "Helper" });

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.controlId}-description`,
  );
});

test("it should set aria-describedby to error id when errorMessage is shown", () => {
  const { result } = renderUseFormField({
    error: true,
    errorMessage: "Required",
  });

  expect(result.current.inputBind["aria-describedby"]).toBe(
    `${result.current.controlId}-error`,
  );
});

test("it should use id prop for controlId", () => {
  const { result } = renderUseFormField({ id: "custom-field" });

  expect(result.current.controlId).toBe("custom-field");
  expect(result.current.inputBind.id).toBe("custom-field");
});

test("it should apply stacked insets on stackedBody instead of container padding", () => {
  const { result } = renderUseFormField({
    label: "Quantity",
    variant: "stacked",
  });

  expect(result.current.containerBind.className).not.toMatch(/\bpx-/);
  expect(result.current.stackedBodyBind.className).toContain("ps-2.5");
  expect(result.current.stackedBodyBind.className).toContain("pe-2.5");
});

test("it should apply stacked insets on stackedBody when end slot is present", () => {
  const { result } = renderUseFormField({
    label: "Quantity",
    variant: "stacked",
    slots: {
      end: () => null,
    },
  });

  expect(result.current.containerBind.className).not.toMatch(/\bpx-/);
  expect(result.current.stackedBodyBind.className).toContain("ps-2.5");
});

test("it should be readonly when readonly prop is true", () => {
  const { result } = renderUseFormField({ readonly: true });

  expect(result.current.isReadonly).toBe(true);
  expect(result.current.inputBind.readOnly).toBe(true);
});

test("it should expose variantKey for filled variant", () => {
  const { result } = renderUseFormField({ variant: "filled" });

  expect(result.current.variantKey).toBe("filled");
});

test("it should expose variantKey for notched variant", () => {
  const { result } = renderUseFormField({ variant: "notched" });

  expect(result.current.variantKey).toBe("notched");
});

test("it should expose variantKey for underlined variant", () => {
  const { result } = renderUseFormField({ variant: "underlined" });

  expect(result.current.variantKey).toBe("underlined");
});

test("it should not set aria-describedby when error is true without errorMessage", () => {
  const { result } = renderUseFormField({ error: true });

  expect(result.current.inputBind["aria-describedby"]).toBeUndefined();
});
