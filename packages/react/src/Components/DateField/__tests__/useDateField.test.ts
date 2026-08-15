// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

// ** Local Imports
import { useDateField, type DateFieldProps } from "@/Components/DateField";

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

function renderUseDateField(props: DateFieldProps = {}) {
  return renderHook(() => useDateField(props));
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should start closed", () => {
  mockViewport(1280);

  const { result } = renderUseDateField();

  expect(result.current.open).toBe(false);
});

test("it should default to single mode", () => {
  mockViewport(1280);

  const { result } = renderUseDateField();

  expect(result.current.mode).toBe("single");
});

test("it should default showFooter to false on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseDateField();

  expect(result.current.showFooter).toBe(false);
});

test("it should default showFooter to true on mobile", () => {
  mockViewport(500);

  const { result } = renderUseDateField();

  expect(result.current.showFooter).toBe(true);
});

test("it should default showFooter to true for dialog overlays on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseDateField({ overlay: "modal" });

  expect(result.current.showFooter).toBe(true);
});

test("it should default showFooter to true for drawer overlays on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseDateField({ overlay: "drawer" });

  expect(result.current.showFooter).toBe(true);
});

test("it should keep explicit showFooter false on mobile", () => {
  mockViewport(500);

  const { result } = renderUseDateField({ showFooter: false });

  expect(result.current.showFooter).toBe(false);
});

test("it should keep explicit showFooter true on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseDateField({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});

test("it should resolve auto overlay to menu on desktop", () => {
  mockViewport(1280);

  const { result } = renderUseDateField();

  expect(result.current.overlay).toBeUndefined();
  expect(result.current.pickerClassName).toBeUndefined();
});

test("it should stretch the picker when overlay is a dialog", () => {
  mockViewport(1280);

  const { result } = renderUseDateField({ overlay: "modal" });

  expect(result.current.pickerClassName).toBe("w-full shadow-none");
});

test("it should stretch the picker for auto overlay on mobile", () => {
  mockViewport(500);

  const { result } = renderUseDateField();

  expect(result.current.pickerClassName).toBe("w-full shadow-none");
});

test("it should keep menu overlay without dialog picker classes", () => {
  mockViewport(500);

  const { result } = renderUseDateField({ overlay: "menu" });

  expect(result.current.pickerClassName).toBeUndefined();
});
