// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useToggleGroup } from "@/Components/ToggleGroup/hooks/useToggleGroup";

afterEach(() => {
  cleanup();
});

test("it should expose context defaults from useToggleGroup", () => {
  const { result } = renderHook(() =>
    useToggleGroup(
      { defaultValue: "a" },
      {
        size: "md",
        full: false,
        rounded: "md",
        disabled: false,
        variant: "solid",
        color: "primary",
        orientation: "horizontal",
      },
    ),
  );

  expect(result.current.contextValue.selected).toBe("a");
  expect(result.current.contextValue.orientation).toBe("horizontal");
  expect(result.current.contextValue.tokenClasses.softFill).toBe(true);
});
