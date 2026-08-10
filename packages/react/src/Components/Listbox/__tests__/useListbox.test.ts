// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core";

// ** Local Imports
import { useListbox, type ListboxOwnProps } from "@/Components/Listbox";

const libDefaults = {
  size: "md",
  color: "primary",
} as const satisfies Partial<ListboxOwnProps>;

const baseProps = {
  listboxId: "listbox-id",
  options: [{ label: "One", value: "one" }],
} satisfies ListboxOwnProps;

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

function renderUseListbox(props: Partial<ListboxOwnProps> = {}) {
  return renderHook(() => useListbox({ ...baseProps, ...props }, libDefaults));
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should return default color as primary", () => {
  const { result } = renderUseListbox();

  expect(result.current.merged.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseListbox({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should expose color classes for options", () => {
  const { result } = renderUseListbox({ color: "primary" });

  expect(result.current.checkClass).toBeTruthy();
  expect(result.current.optionSelectedClass).toBeTruthy();
  expect(result.current.optionHighlightedClass).toBeTruthy();
});

test("it should merge registry classes", () => {
  const { result } = renderUseListbox({
    classes: { check: "custom-check" },
  });

  expect(result.current.mergedClasses.check).toBe("custom-check");
});

test("it should apply default scroll classes", () => {
  const { result } = renderUseListbox();

  expect(result.current.scrollBind.className).toContain("max-h-60");
  expect(result.current.scrollBind.className).toContain("overflow-y-auto");
});

test("it should paint a surface when overlay resolves to a dialog", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "modal" }),
  );

  expect(result.current.surfaceBind).toContain("bg-white");
  expect(result.current.surfaceBind).toContain("shadow-lg");
});

test("it should paint a surface when overlay is drawer", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "drawer" }),
  );

  expect(result.current.surfaceBind).toContain("bg-white");
});

test("it should paint a surface for auto overlay on mobile", () => {
  mockViewport(500);

  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "auto" }),
  );

  expect(result.current.surfaceBind).toContain("bg-white");
});

test("it should skip dialog surface when overlay is menu", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "menu" }),
  );

  expect(result.current.surfaceBind).not.toContain("bg-white");
});

test("it should forward scroll customProps onto scrollBind", () => {
  const { result } = renderUseListbox({
    customProps: {
      scroll: {
        id: "scroll-id",
        className: "extra-scroll",
        "data-testid": "listbox-scroll",
      },
    },
  });

  expect(result.current.scrollBind.id).toBe("scroll-id");
  expect(result.current.scrollBind.className).toContain("max-h-60");
  expect(result.current.scrollBind.className).toContain("extra-scroll");
  expect(result.current.scrollBind["data-testid"]).toBe("listbox-scroll");
});

test("it should apply custom maxHeight tailwind class", () => {
  const { result } = renderUseListbox({ maxHeight: "max-h-80" });

  expect(result.current.scrollBind.className).toContain("max-h-80");
  expect(result.current.scrollBind.className).not.toContain("max-h-60");
});

test("it should disable max height when disableMaxHeight is true", () => {
  const { result } = renderUseListbox({ disableMaxHeight: true });

  expect(result.current.scrollBind.className).not.toContain("max-h-60");
  expect(result.current.scrollBind.className).not.toContain("overflow-y-auto");
});

test("it should return default size as md", () => {
  const { result } = renderUseListbox();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.sizeClasses?.option).toContain("px-4");
  expect(result.current.messageBind.className).toContain("text-sm");
});

test("it should apply size classes when size is overridden", () => {
  const { result } = renderUseListbox({ size: "xs" });

  expect(result.current.merged.size).toBe("xs");
  expect(result.current.checkClass).toContain("size-3");
  expect(result.current.sizeClasses?.option).toContain("px-3");
  expect(result.current.sizeClasses?.primary).toContain("text-xs");
  expect(result.current.messageBind.className).toContain("text-xs");
});

test("it should default showFooter to false on desktop when unset", () => {
  mockViewport(1280);

  const { result } = renderUseListbox();

  expect(result.current.showFooter).toBe(false);
});

test("it should default showFooter to true on mobile when unset", () => {
  mockViewport(500);

  const { result } = renderUseListbox();

  expect(result.current.showFooter).toBe(true);
});

test("it should keep explicit showFooter false on mobile", () => {
  mockViewport(500);

  const { result } = renderUseListbox({ showFooter: false });

  expect(result.current.showFooter).toBe(false);
});
