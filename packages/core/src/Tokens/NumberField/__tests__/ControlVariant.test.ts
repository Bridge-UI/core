// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { controlVariantProps } from "@/Tokens/NumberField/ControlVariant";

describe("controlVariantProps", () => {
  test("it should expose inline, split, and stacked layouts", () => {
    expect(Object.keys(controlVariantProps).sort()).toEqual([
      "inline",
      "split",
      "stacked",
    ]);
  });

  test("it should stack controls in a column at the end", () => {
    expect(controlVariantProps.stacked.startGroup).toBe("");
    expect(controlVariantProps.stacked.button).toContain("min-w-8");
    expect(controlVariantProps.stacked.endGroup).toContain("h-auto!");
    expect(controlVariantProps.stacked.endGroup).toContain("flex-col");
    expect(controlVariantProps.stacked.endGroup).not.toContain("my-0.5");
  });

  test("it should place inline controls in a row at the end", () => {
    expect(controlVariantProps.inline.startGroup).toBe("");
    expect(controlVariantProps.inline.button).toContain("min-w-8");
    expect(controlVariantProps.inline.endGroup).toContain("min-w-9");
    expect(controlVariantProps.inline.endGroup).toContain("flex-row");
    expect(controlVariantProps.inline.endGroup).not.toContain("min-w-0");
  });

  test("it should place split decrement on the start side", () => {
    expect(controlVariantProps.split.button).toContain("flex-1");
    expect(controlVariantProps.split.endGroup).toContain("flex-col");
    expect(controlVariantProps.split.endGroup).toContain(
      "bridge-end-adornment",
    );
    expect(controlVariantProps.split.startGroup).toContain(
      "bridge-start-adornment",
    );
  });
});
