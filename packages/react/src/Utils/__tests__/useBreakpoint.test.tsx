// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { BridgeUIProvider } from "@/Provider";
import { useBreakpoint } from "@/Utils/useBreakpoint";
import { resetBreakpointCachesForTests } from "@bridge-ui/core";

function mockViewport(width: number, height = 800) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: height,
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

test("it should report lessThan sm below the sm breakpoint", () => {
  mockViewport(500);

  const { result, unmount } = renderHook(() => useBreakpoint());

  expect(result.current.mobile).toBe(true);
  expect(result.current.lessThan("sm")).toBe(true);
  expect(result.current.lessOrEqual("sm")).toBe(true);
  expect(result.current.greaterOrEqual("sm")).toBe(false);
  expect(result.current.name).toBe("xs");

  unmount();
});

test("it should report greaterOrEqual sm at desktop widths", () => {
  mockViewport(900);

  const { result, unmount } = renderHook(() => useBreakpoint());

  expect(result.current.mobile).toBe(false);
  expect(result.current.greaterOrEqual("sm")).toBe(true);
  expect(result.current.name).toBe("md");

  unmount();
});

test("it should honor custom breakpoint overrides", () => {
  mockViewport(500);

  const { result, unmount } = renderHook(() =>
    useBreakpoint({ breakpoints: { sm: "30rem" } }),
  );

  expect(result.current.greaterOrEqual("sm")).toBe(true);
  expect(result.current.thresholds.sm).toBe(480);

  unmount();
});

test("it should use global mobileBreakpoint from BridgeUIProvider", () => {
  mockViewport(700);

  const { result, unmount } = renderHook(() => useBreakpoint(), {
    wrapper: ({ children }) => (
      <BridgeUIProvider global={{ mobileBreakpoint: "md" }}>
        {children}
      </BridgeUIProvider>
    ),
  });

  expect(result.current.mobile).toBe(true);
  expect(result.current.greaterOrEqual("sm")).toBe(true);

  unmount();
});
