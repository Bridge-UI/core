// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useBaseField, type BaseFieldOwnProps } from "@/Components/BaseField";

const libDefaults = {
  size: "md",
  error: false,
  hideErrorMessage: false,
} as const satisfies Partial<BaseFieldOwnProps>;

function renderUseBaseField(
  props: Omit<BaseFieldOwnProps, "field" | "children"> = {},
  options?: Parameters<typeof useBaseField>[2],
) {
  return renderHook(() => useBaseField(props, libDefaults, options));
}

test("it should merge default size and error flags", () => {
  const { result } = renderUseBaseField();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.merged.error).toBe(false);
  expect(result.current.merged.hideErrorMessage).toBe(false);
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseBaseField({ size: "lg" });

  expect(result.current.merged.size).toBe("lg");
});

test("it should mark field as invalidated when error is true", () => {
  const { result } = renderUseBaseField({ error: true });

  expect(result.current.invalidated).toBe(true);
});

test("it should expose control id from controlId prop", () => {
  const { result } = renderUseBaseField({ controlId: "custom-id" });

  expect(result.current.controlId).toBe("custom-id");
});

test("it should fallback controlId to inherited id when controlId is not provided", () => {
  const { result } = renderUseBaseField({ id: "inherited-id" });

  expect(result.current.controlId).toBe("inherited-id");
});

test("it should set htmlFor on label props to control id by default", () => {
  const { result } = renderUseBaseField({
    label: "Label",
    controlId: "field-id",
  });

  expect(result.current.fieldLabelProps.htmlFor).toBe("field-id");
});

test("it should resolve label htmlFor via labelHtmlFor option", () => {
  const { result } = renderUseBaseField(
    { label: "Label", controlId: "field-id" },
    { labelHtmlFor: (id) => `${id}-input` },
  );

  expect(result.current.fieldLabelProps.htmlFor).toBe("field-id-input");
});

test("it should expose start and end slot binds", () => {
  const { result } = renderUseBaseField({
    slots: {
      end: "end",
      start: "start",
    },
  });

  expect(result.current.startSlotBind.className).toContain(
    "wrapper-start-slot",
  );
  expect(result.current.endSlotBind.className).toContain("wrapper-end-slot");
});

test("it should set aria-describedby on group bind when description is provided", () => {
  const { result } = renderUseBaseField({
    description: "Helper",
    controlId: "field-id",
  });

  expect(result.current.groupBind["aria-describedby"]).toBe(
    "field-id-description",
  );
});

test("it should set aria-invalid on group bind when error is set", () => {
  const { result } = renderUseBaseField({ error: true });

  expect(result.current.groupBind["aria-invalid"]).toBe(true);
});

test("it should merge customProps.label into fieldLabelProps", () => {
  const { result } = renderUseBaseField({
    label: "Label",
    customProps: {
      label: {
        classes: {
          root: "text-orange-600",
        },
      },
    },
  });

  expect(result.current.fieldLabelProps.classes?.root).toContain(
    "text-orange-600",
  );
});
