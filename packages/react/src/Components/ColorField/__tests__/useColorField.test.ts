// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

// ** Local Imports
import { useColorField, type ColorFieldProps } from "@/Components/ColorField";

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

function renderUseColorField(props: ColorFieldProps = {}) {
  return renderHook(() => useColorField(props));
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should start closed", () => {
  mockViewport(1280);

  const { result } = renderUseColorField();

  expect(result.current.open).toBe(false);
});

test("it should expose a null model by default", () => {
  mockViewport(1280);

  const { result } = renderUseColorField();

  expect(result.current.modelValue).toBeNull();
});

test("it should default showFooter to false on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseColorField();

  expect(result.current.showFooter).toBe(false);
});

test("it should default showFooter to true on mobile", () => {
  mockViewport(500);

  const { result } = renderUseColorField();

  expect(result.current.showFooter).toBe(true);
});

test("it should default showSwatch to true", () => {
  mockViewport(1280);

  const { result } = renderUseColorField();

  expect(result.current.showSwatch).toBe(true);
});

test("it should default endIcon to palette", () => {
  mockViewport(1280);

  const { result } = renderUseColorField();

  expect(result.current.formField.merged.endIcon).toBe("palette");
});

test("it should skip the default palette icon when end slot is set", () => {
  mockViewport(1280);

  const { result } = renderUseColorField({
    slots: { end: "Custom" },
  });

  expect(result.current.formField.merged.endIcon).toBeUndefined();
});

test("it should leave picker chrome intact in a menu overlay", () => {
  mockViewport(1280);

  const { result } = renderUseColorField({ overlay: "menu" });

  expect(result.current.pickerClassName).toBeUndefined();
});
