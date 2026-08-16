// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useToggleGroup } from "@/Components/ToggleGroup/hooks/useToggleGroup";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  size: "md",
  full: false,
  rounded: "md",
  disabled: false,
  multiple: false,
  variant: "solid",
  color: "primary",
  orientation: "horizontal",
} as const;

test("it should expose context defaults from useToggleGroup", () => {
  const { result } = renderHook(() =>
    useToggleGroup({ defaultValue: "a" }, libDefaults),
  );

  expect(result.current.contextValue.selected).toBe("a");
  expect(result.current.contextValue.orientation).toBe("horizontal");
  expect(result.current.contextValue.tokenClasses.softFill).toBe(true);
});

test("it should use panel-full root radius when rounded is full", () => {
  const { result } = renderHook(() =>
    useToggleGroup({ rounded: "full", defaultValue: "a" }, libDefaults),
  );

  expect(result.current.rootBind.className).not.toContain("rounded-full");
  expect(result.current.rootBind.className).toContain("rounded-panel-full");
  expect(result.current.contextValue.tokenClasses.itemRounded).toBe(
    "rounded-full",
  );
  expect(result.current.contextValue.tokenClasses.rootRounded).toBe(
    "rounded-panel-full",
  );
});

test("it should toggle membership when multiple is set", () => {
  const { result } = renderHook(() =>
    useToggleGroup({ multiple: true, defaultValue: ["a"] }, libDefaults),
  );

  act(() => {
    result.current.contextValue.toggleItem("b");
  });

  expect(result.current.contextValue.selected).toEqual(["a", "b"]);

  act(() => {
    result.current.contextValue.toggleItem("a");
  });

  expect(result.current.contextValue.selected).toEqual(["b"]);
});
