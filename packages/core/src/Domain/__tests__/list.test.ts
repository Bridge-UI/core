// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { resolveListSizeClasses } from "@/Domain/list";

describe("resolveListSizeClasses", () => {
  test("it should use the md size without a size", () => {
    expect(resolveListSizeClasses(null, undefined).primary).toBe("text-sm");
  });

  test("it should resolve the requested size", () => {
    const classes = resolveListSizeClasses(null, "lg");

    expect(classes.primary).toBe("text-base");
    expect(classes.secondary).toBe("text-sm");
  });

  test("it should fall back to md for an unknown size", () => {
    expect(resolveListSizeClasses(null, "huge").primary).toBe("text-sm");
  });

  test("it should layer the List size tokens from the registry", () => {
    const classes = resolveListSizeClasses(
      { List: { tokens: { size: { md: { primary: "text-[15px]" } } } } },
      "md",
    );

    expect(classes.primary).toBe("text-[15px]");
    expect(classes.secondary).toBe("text-xs");
  });
});
