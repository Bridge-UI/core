// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useLabel,
  type LabelOwnProps,
  type LabelProps,
} from "@/Components/Label";

const libDefaults = {
  size: "md",
} as const satisfies Partial<LabelOwnProps>;

function renderUseLabel(props: LabelProps = {}) {
  return renderHook(() =>
    useLabel(props, libDefaults as Parameters<typeof useLabel>[1]),
  );
}

test("it should default size to md", () => {
  const { result } = renderUseLabel();

  expect(result.current.merged.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseLabel({ size: "lg" });

  expect(result.current.merged.size).toBe("lg");
});

test("it should apply error color on root bind", () => {
  const { result } = renderUseLabel({ error: true });

  expect(result.current.rootBind.className).toContain("text-error-600");
});

test("it should expose htmlFor on root bind via inherited attrs", () => {
  const { result } = renderUseLabel({ htmlFor: "field-id" });

  expect(result.current.rootBind.htmlFor).toBe("field-id");
});

test("it should merge className into root bind", () => {
  const { result } = renderUseLabel({ className: "custom-label" });

  expect(result.current.rootBind.className).toContain("custom-label");
});

test("it should apply className after classes.root in root bind", () => {
  const { result } = renderUseLabel({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});

test("it should expose children from props", () => {
  const { result } = renderUseLabel({ children: "Email" });

  expect(result.current.children).toBe("Email");
});

test("it should apply size typography class on root bind", () => {
  const { result } = renderUseLabel({ size: "lg" });

  expect(result.current.rootBind.className).toContain("text-sm");
});

test("it should style required asterisk bind", () => {
  const { result } = renderUseLabel({ required: true });

  expect(result.current.merged.required).toBe(true);
  expect(result.current.requiredBind.className).toContain("text-error-500");
});
