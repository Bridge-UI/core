// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useActionFooter,
  type ActionFooterOwnProps,
} from "@/Components/ActionFooter";

const libDefaults = {
  applyColor: "primary",
  cancelVariant: "flat",
  cancelColor: "secondary",
} as const satisfies Partial<ActionFooterOwnProps>;

function renderUseActionFooter(props: Partial<ActionFooterOwnProps> = {}) {
  return renderHook(() => useActionFooter({ ...props }, libDefaults));
}

test("it should return default Apply and Cancel tokens", () => {
  const { result } = renderUseActionFooter();

  expect(result.current.merged.applyColor).toBe("primary");
  expect(result.current.merged.cancelColor).toBe("secondary");
  expect(result.current.merged.cancelVariant).toBe("flat");
  expect(result.current.rootBind.className).toContain("contents");
});

test("it should resolve i18n labels when none are provided", () => {
  const { result } = renderUseActionFooter();

  expect(result.current.applyLabel).toBe("Apply");
  expect(result.current.cancelLabel).toBe("Cancel");
});

test("it should merge registry classes", () => {
  const { result } = renderUseActionFooter({
    classes: { root: "custom-footer" },
  });

  expect(result.current.mergedClasses.root).toBe("custom-footer");
  expect(result.current.rootBind.className).toContain("custom-footer");
});
