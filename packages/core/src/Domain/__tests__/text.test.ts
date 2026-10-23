// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { resolveDefaultTextSizeClass } from "@/Domain/text";

describe("resolveDefaultTextSizeClass", () => {
  test("it should use the sm size without a registry", () => {
    expect(resolveDefaultTextSizeClass(null)).toBe("text-sm");
  });

  test("it should use the Text size from the registry", () => {
    expect(
      resolveDefaultTextSizeClass({ Text: { defaultProps: { size: "xs" } } }),
    ).toBe("text-xs");
  });

  test("it should use the Text size tokens from the registry", () => {
    expect(
      resolveDefaultTextSizeClass({
        Text: { tokens: { size: { sm: "text-[13px]" } } },
      }),
    ).toBe("text-[13px]");
  });
});
