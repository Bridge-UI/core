// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { variantProps as formFieldVariantProps } from "@/Tokens/FormField/Variant";
import { variantProps as otpFieldVariantProps } from "@/Tokens/OtpField/Variant";

/**
 * Surfaces must use the semantic `dark-*` scale (zinc host) so theme remaps
 * that retarget `--color-dark-*` / zinc also recolor form chrome.
 */
function assertUsesSemanticDarkNeutral(classes: string) {
  expect(classes).not.toMatch(/(?:^|[\s:])(?:bg|ring|border|text)-gray-/);
  expect(classes).toMatch(/(?:bg|ring|border|text)-dark-/);
}

describe("FormField variantProps", () => {
  test("it should paint containers with dark-* neutrals instead of gray-*", () => {
    for (const item of Object.values(formFieldVariantProps)) {
      assertUsesSemanticDarkNeutral(item.container);
      if (item.corner) assertUsesSemanticDarkNeutral(item.corner);
      if (item.label) assertUsesSemanticDarkNeutral(item.label);
    }
  });
});

describe("OtpField variantProps", () => {
  test("it should paint pins with dark-* neutrals instead of gray-*", () => {
    for (const item of Object.values(otpFieldVariantProps)) {
      assertUsesSemanticDarkNeutral(item.pin);
    }
  });
});
