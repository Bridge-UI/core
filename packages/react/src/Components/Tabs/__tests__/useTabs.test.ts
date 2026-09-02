// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useTabs } from "@/Components/Tabs/hooks/useTabs";

afterEach(() => {
  cleanup();
});

test("it should expose context defaults from useTabs", () => {
  const { result } = renderHook(() =>
    useTabs(
      { defaultValue: "a" },
      {
        size: "md",
        color: "dark",
        variant: "pill",
        keepMounted: true,
        activation: "automatic",
        orientation: "horizontal",
      },
    ),
  );

  expect(result.current.contextValue.selected).toBe("a");
  expect(result.current.contextValue.activation).toBe("automatic");
  expect(result.current.contextValue.orientation).toBe("horizontal");
});
