// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import { useLabel, type LabelProps } from "@/Components/Label";
import { renderHook } from "@/Utils/__tests__/renderHook";

function renderUseLabel(props: LabelProps = {}) {
  return renderHook(
    (hookProps: () => LabelProps) => useLabel(hookProps, { size: "md" }),
    { props },
  );
}

test("it should default size to md", () => {
  expect(renderUseLabel().result.merged.size).toBe("md");
});

test("it should merge classes.root and class into rootBind", () => {
  const { result } = renderUseLabel({
    class: "mt-2",
    classes: { root: "uppercase" },
  });

  expect(result.rootBind.class).toContain("uppercase");
  expect(result.rootBind.class).toContain("mt-2");
});

test("it should react to error changes", async () => {
  const { result, rerender } = renderUseLabel();

  await rerender({ error: true });

  expect(result.rootBind.class).toContain("text-error-600");
});
