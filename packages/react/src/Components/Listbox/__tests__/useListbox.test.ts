// ** External Imports
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

// ** Local Imports
import { useListbox, type ListboxOwnProps } from "@/Components/Listbox";
import { BridgeUIProvider } from "@/Provider";

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
  mockViewport(1280);
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
  expect(result.current.optionHoverClass).toContain("hover:bg-black/5");
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

test("it should paint a surface when overlay is menu", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "menu" }),
  );

  expect(result.current.surfaceBind).toContain("bg-white");
  expect(result.current.surfaceBind).toContain("rounded-md");
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
  expect(result.current.sizeClasses?.option).toContain("py-1.5");
  expect(result.current.messageBind.className).toContain("text-sm");
});

test("it should bump size classes on dialog overlays", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "drawer" }),
  );

  expect(result.current.merged.size).toBe("md");
  expect(result.current.sizeClasses?.option).toContain("py-2");
  expect(result.current.sizeClasses?.primary).toContain("text-sm");
});

test("it should apply size classes when size is overridden", () => {
  const { result } = renderUseListbox({ size: "xs" });

  expect(result.current.merged.size).toBe("xs");
  expect(result.current.checkClass).toContain("size-3");
  expect(result.current.sizeClasses?.option).toContain("px-3");
  expect(result.current.sizeClasses?.primary).toContain("text-xs");
  expect(result.current.messageBind.className).toContain("text-xs");
});

test("it should round only the top of the surface when overlay is drawer", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "drawer" }),
  );

  expect(result.current.surfaceBind).toContain("rounded-md");
  expect(result.current.surfaceBind).toContain("rounded-b-none");
});

test("it should round all corners when overlay is modal", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "modal" }),
  );

  expect(result.current.surfaceBind).toContain("rounded-md");
  expect(result.current.surfaceBind).not.toContain("rounded-t-md");
});

test("it should follow the rounded prop on dialog surfaces", () => {
  const { result } = renderHook(() =>
    useListbox({ ...baseProps, rounded: "xl" }, libDefaults, {
      overlay: "modal",
    }),
  );

  expect(result.current.surfaceBind).toContain("rounded-xl");
});

test("it should follow the rounded prop with top-only corners on drawer", () => {
  const { result } = renderHook(() =>
    useListbox({ ...baseProps, rounded: "xl" }, libDefaults, {
      overlay: "drawer",
    }),
  );

  expect(result.current.surfaceBind).toContain("rounded-xl");
  expect(result.current.surfaceBind).toContain("rounded-b-none");
});

test("it should cap full panel rounded to panel-full on modal", () => {
  const { result } = renderHook(() =>
    useListbox({ ...baseProps, rounded: "full" }, libDefaults, {
      overlay: "modal",
    }),
  );

  expect(result.current.surfaceBind).not.toContain("rounded-full");
  expect(result.current.surfaceBind).toContain("rounded-panel-full");
});

test("it should use a taller scroll max-height for dialog overlays", () => {
  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "drawer" }),
  );

  expect(result.current.scrollBind.className).toContain(
    "max-h-[min(60dvh,28rem)]",
  );
  expect(result.current.scrollBind.className).not.toContain("max-h-60");
});

test("it should default showFooter to false on desktop menu when unset", () => {
  mockViewport(1280);

  const { result } = renderUseListbox();

  expect(result.current.showFooter).toBe(false);
});

test("it should default showFooter to true on mobile drawer when unset", () => {
  mockViewport(500);

  const { result } = renderUseListbox();

  expect(result.current.showFooter).toBe(true);
});

test("it should default showFooter to true for explicit modal on desktop", () => {
  mockViewport(1280);

  const { result } = renderHook(() =>
    useListbox(baseProps, libDefaults, { overlay: "modal" }),
  );

  expect(result.current.showFooter).toBe(true);
});

test("it should keep explicit showFooter false on dialog overlays", () => {
  mockViewport(500);

  const { result } = renderHook(() =>
    useListbox({ ...baseProps, showFooter: false }, libDefaults, {
      overlay: "drawer",
    }),
  );

  expect(result.current.showFooter).toBe(false);
});

test("it should apply registry tokens.rounded overrides", () => {
  const { result } = renderHook(
    () =>
      useListbox({ ...baseProps, rounded: "md" }, libDefaults, {
        overlay: "modal",
      }),
    {
      wrapper: ({ children }) => {
        return createElement(BridgeUIProvider, {
          children,
          components: {
            Listbox: {
              tokens: { rounded: { md: "rounded-none" } },
            },
          },
        });
      },
    },
  );

  expect(result.current.surfaceBind).toContain("rounded-none");
});
