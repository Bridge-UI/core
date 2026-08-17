// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

// ** Local Imports
import {
  useTimeRangeField,
  type TimeRangeFieldProps,
} from "@/Components/TimeRangeField";

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

function renderUseTimeRangeField(props: TimeRangeFieldProps = {}) {
  return renderHook(() => useTimeRangeField(props));
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should start closed", () => {
  mockViewport(1280);

  const { result } = renderUseTimeRangeField();

  expect(result.current.open).toBe(false);
});

test("it should expose a null model by default", () => {
  mockViewport(1280);

  const { result } = renderUseTimeRangeField();

  expect(result.current.modelValue).toBeNull();
});

test("it should keep drawer orientation horizontal on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseTimeRangeField({ overlay: "drawer" });

  expect(result.current.orientation).toBe("horizontal");
});

test("it should stack drawer pickers vertically on mobile", () => {
  mockViewport(500);

  const { result } = renderUseTimeRangeField({ overlay: "drawer" });

  expect(result.current.orientation).toBe("vertical");
});

test("it should keep an explicit orientation", () => {
  mockViewport(500);

  const { result } = renderUseTimeRangeField({
    overlay: "drawer",
    orientation: "horizontal",
  });

  expect(result.current.orientation).toBe("horizontal");
});
