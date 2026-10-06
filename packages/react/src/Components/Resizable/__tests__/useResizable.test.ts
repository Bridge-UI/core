// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useResizable } from "@/Components/Resizable";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  disabled: false,
  keyboardStep: 10,
  orientation: "horizontal",
} as const;

test("it should lay panels out horizontally by default", () => {
  const { result } = renderHook(() => useResizable({}, libDefaults));

  expect(result.current.orientation).toBe("horizontal");
  expect(result.current.rootBind.className).toContain("flex-row");
  expect(result.current.contextValue.id).toContain("bridge-resizable");
  expect(result.current.rootBind["data-orientation"]).toBe("horizontal");
});

test("it should stack panels when vertical", () => {
  const { result } = renderHook(() =>
    useResizable({ orientation: "vertical" }, libDefaults),
  );

  expect(result.current.rootBind.className).toContain("flex-col");
  expect(result.current.contextValue.orientation).toBe("vertical");
});

test("it should share disabled with panels and handles", () => {
  const { result } = renderHook(() =>
    useResizable({ disabled: true }, libDefaults),
  );

  expect(result.current.dragging).toBe(false);
  expect(result.current.contextValue.disabled).toBe(true);
});

test("it should merge classes onto the root", () => {
  const { result } = renderHook(() =>
    useResizable(
      { className: "h-64", classes: { root: "rounded-lg" } },
      libDefaults,
    ),
  );

  expect(result.current.rootBind.className).toContain("h-64");
  expect(result.current.rootBind.className).toContain("rounded-lg");
});
