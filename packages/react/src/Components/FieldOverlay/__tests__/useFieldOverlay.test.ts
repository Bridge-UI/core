// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

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

test("it should resolve menu by default on desktop", () => {
  mockViewport(1280);

  const { result } = renderHook(() => useFieldOverlay({ show: true }));

  expect(result.current.resolvedOverlay).toBe("menu");
});

test("it should resolve drawer by default on mobile", () => {
  mockViewport(500);

  const { result } = renderHook(() => useFieldOverlay({ show: true }));

  expect(result.current.resolvedOverlay).toBe("drawer");
});

test("it should resolve explicit drawer", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "drawer" }),
  );

  expect(result.current.drawerProps.size).toBe("md");
  expect(result.current.resolvedOverlay).toBe("drawer");
  expect(result.current.drawerProps.placement).toBe("bottom");
});

test("it should resolve explicit modal", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "modal" }),
  );

  expect(result.current.modalProps.size).toBe("md");
  expect(result.current.resolvedOverlay).toBe("modal");
  expect(result.current.modalProps.closeOnOverlay).toBe(true);
  expect(result.current.modalProps.align).toBe("middle-center");
  expect(result.current.modalProps.disableRestoreFocus).toBe(true);
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

  expect(drawerPanel).toContain("p-0");
  expect(drawerPanel).toContain("flex");
  expect(drawerPanel).toContain("h-auto");
  expect(drawerPanel).toContain("w-full");
  expect(drawerPanel).toContain("flex-col");
  expect(drawerPanel).toContain("items-stretch");
  expect(drawerPanel).toContain("max-h-[90dvh]");
  expect(drawerPanel).toContain("overflow-x-auto");

  expect(modalPanel).toContain("p-0");
  expect(modalPanel).toContain("w-fit");
  expect(modalPanel).toContain("max-w-full");
  expect(modalPanel).toContain("items-stretch");
  expect(modalPanel).toContain("sm:max-w-full");
});

test("it should scroll modal content inside the paper panel", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "modal" }),
  );

  expect(result.current.modalProps.scroll).toBe("paper");
  expect(result.current.modalProps.align).toBe("middle-center");
});

test("it should scroll drawer content inside the paper panel", () => {
  const { result } = renderHook(() =>
    useFieldOverlay({ show: true, overlay: "drawer" }),
  );

  expect(result.current.drawerProps.scroll).toBe("paper");
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

test("it should strip menu content chrome by default", () => {
  const { result } = renderHook(() => useFieldOverlay({ show: true }));

  expect(result.current.menuProps.classes?.content).toContain("rounded-none");
  expect(result.current.menuProps.classes?.content).toContain("bg-transparent");
});
