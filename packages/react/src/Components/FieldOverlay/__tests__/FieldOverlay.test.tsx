// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";

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
  cleanup();
  resetLayerStackForTests();
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

test("it should render menu content when overlay is menu", () => {
  render(
    <FieldOverlay show overlay="menu">
      <span>Picker</span>
    </FieldOverlay>,
  );

  expect(screen.getByText("Picker")).toBeTruthy();
  expect(document.querySelector('[role="menu"]')).not.toBeNull();
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});

test("it should strip menu chrome so nested content paints the surface", () => {
  render(
    <FieldOverlay show overlay="menu">
      <span>Picker</span>
    </FieldOverlay>,
  );

  const menu = document.querySelector('[role="menu"]');

  expect(menu?.className).toContain("shadow-none");
  expect(menu?.className).toContain("rounded-none");
  expect(menu?.className).toContain("bg-transparent");
  expect(menu?.className).not.toContain("bg-white");
});

test("it should render modal dialog when overlay is modal", () => {
  render(
    <FieldOverlay
      show
      overlay="modal"
      customProps={{ modal: { transition: "none" } }}
    >
      <span>Modal picker</span>
    </FieldOverlay>,
  );

  expect(screen.getByText("Modal picker")).toBeTruthy();
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should render drawer dialog when overlay is drawer", () => {
  render(
    <FieldOverlay
      show
      overlay="drawer"
      customProps={{ drawer: { transition: "none" } }}
    >
      <span>Drawer picker</span>
    </FieldOverlay>,
  );

  expect(screen.getByText("Drawer picker")).toBeTruthy();
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should resolve auto to menu on desktop", () => {
  mockViewport(1280);

  render(
    <FieldOverlay show overlay="auto">
      <span>Auto desktop</span>
    </FieldOverlay>,
  );

  expect(screen.getByText("Auto desktop")).toBeTruthy();
  expect(document.querySelector('[role="menu"]')).not.toBeNull();
});

test("it should resolve auto to drawer on mobile", () => {
  mockViewport(500);

  render(
    <FieldOverlay
      show
      overlay="auto"
      customProps={{ drawer: { transition: "none" } }}
    >
      <span>Auto mobile</span>
    </FieldOverlay>,
  );

  expect(screen.getByText("Auto mobile")).toBeTruthy();
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should not render content when show is false", () => {
  render(
    <FieldOverlay show={false} overlay="menu">
      <span>Hidden</span>
    </FieldOverlay>,
  );

  expect(screen.queryByText("Hidden")).toBeNull();
});
