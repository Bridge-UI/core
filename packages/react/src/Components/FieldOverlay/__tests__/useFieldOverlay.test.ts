// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core";

// ** Local Imports
import { useFieldOverlay } from "@/Components/FieldOverlay";

function mockViewport(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: 800,
    configurable: true,
  });

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should resolve menu by default", () => {
  mockViewport(1280);

  const { result } = renderHook(() => useFieldOverlay({ show: true }));

  expect(result.current.resolvedOverlay).toBe("menu");
});

test("it should resolve explicit drawer", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "drawer" }),
  );

  expect(result.current.resolvedOverlay).toBe("drawer");
  expect(result.current.drawerProps.placement).toBe("bottom");
  expect(result.current.drawerProps.size).toBe("md");
});

test("it should resolve explicit modal", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "modal" }),
  );

  expect(result.current.resolvedOverlay).toBe("modal");
  expect(result.current.modalProps.align).toBe("middle-center");
  expect(result.current.modalProps.size).toBe("md");
});

test("it should resolve auto to drawer on mobile", () => {
  mockViewport(500);

  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "auto" }),
  );

  expect(result.current.resolvedOverlay).toBe("drawer");
});

test("it should apply panel padding and layout on drawer and modal", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "drawer" }),
  );

  const drawerPanel = result.current.drawerProps.customProps?.panel?.className;
  const modalPanel = result.current.modalProps.customProps?.panel?.className;

  expect(drawerPanel).toContain("p-2");
  expect(drawerPanel).toContain("flex");
  expect(drawerPanel).toContain("flex-col");
  expect(drawerPanel).toContain("items-center");
  expect(drawerPanel).toContain("justify-center");
  expect(drawerPanel).toContain("h-auto");
  expect(drawerPanel).toContain("max-h-[90dvh]");
  expect(modalPanel).toContain("p-2");
  expect(modalPanel).toContain("items-center");
  expect(modalPanel).toContain("justify-center");
});

test("it should scroll modal content inside the paper panel", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "modal" }),
  );

  expect(result.current.modalProps.scroll).toBe("paper");
  expect(result.current.modalProps.align).toBe("middle-center");
});

test("it should forward customProps.menu onto menuProps", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({
      show: true,
      customProps: { menu: { shadow: "lg" } },
    }),
  );

  expect(result.current.menuProps.shadow).toBe("lg");
});
