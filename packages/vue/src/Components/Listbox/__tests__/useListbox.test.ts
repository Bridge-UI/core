// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

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

function mountUseListbox(props: Partial<ListboxOwnProps> = {}) {
  let result!: ReturnType<typeof useListbox>;

  const Wrapper = defineComponent({
    setup() {
      result = useListbox({ ...baseProps, ...props }, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

afterEach(() => {
  mockViewport(1280);
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should return default color as primary", () => {
  const { merged } = mountUseListbox();

  expect(merged.value.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseListbox({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should expose color classes for options", () => {
  const {
    checkClass,
    optionHoverClass,
    optionSelectedClass,
    optionHighlightedClass,
  } = mountUseListbox({ color: "primary" });

  expect(checkClass.value).toBeTruthy();
  expect(optionSelectedClass.value).toBeTruthy();
  expect(optionHighlightedClass.value).toBeTruthy();
  expect(optionHoverClass.value).toContain("hover:bg-black/5");
});

test("it should merge registry classes", () => {
  const { mergedClasses } = mountUseListbox({
    classes: { check: "custom-check" },
  });

  expect(mergedClasses.value.check).toBe("custom-check");
});

test("it should apply default scroll classes", () => {
  const { scrollBind } = mountUseListbox();

  expect(scrollBind.value.class).toContain("max-h-60");
  expect(scrollBind.value.class).toContain("overflow-y-auto");
});

test("it should paint a surface when overlay resolves to a dialog", () => {
  const { surfaceBind } = mountUseListbox({ overlay: "modal" });

  expect(surfaceBind.value).toContain("bg-white");
  expect(surfaceBind.value).toContain("shadow-lg");
});

test("it should paint a surface when overlay is drawer", () => {
  const { surfaceBind } = mountUseListbox({ overlay: "drawer" });

  expect(surfaceBind.value).toContain("bg-white");
});

test("it should paint a surface for auto overlay on mobile", () => {
  mockViewport(500);

  const { surfaceBind } = mountUseListbox({ overlay: "auto" });

  expect(surfaceBind.value).toContain("bg-white");
});

test("it should skip dialog surface when overlay is menu", () => {
  const { surfaceBind } = mountUseListbox({ overlay: "menu" });

  expect(surfaceBind.value).not.toContain("bg-white");
});

test("it should forward scroll customProps onto scrollBind", () => {
  const { scrollBind } = mountUseListbox({
    customProps: {
      scroll: {
        id: "scroll-id",
        class: "extra-scroll",
        "data-testid": "listbox-scroll",
      },
    },
  });

  expect(scrollBind.value.id).toBe("scroll-id");
  expect(scrollBind.value.class).toContain("max-h-60");
  expect(scrollBind.value.class).toContain("extra-scroll");
  expect(scrollBind.value["data-testid"]).toBe("listbox-scroll");
});

test("it should apply custom maxHeight tailwind class", () => {
  const { scrollBind } = mountUseListbox({ maxHeight: "max-h-80" });

  expect(scrollBind.value.class).toContain("max-h-80");
  expect(scrollBind.value.class).not.toContain("max-h-60");
});

test("it should disable max height when disableMaxHeight is true", () => {
  const { scrollBind } = mountUseListbox({ disableMaxHeight: true });

  expect(scrollBind.value.class).not.toContain("max-h-60");
  expect(scrollBind.value.class).not.toContain("overflow-y-auto");
});

test("it should apply scroll classes when props are reactive like defineProps", () => {
  let result!: ReturnType<typeof useListbox>;

  const Wrapper = defineComponent({
    props: {
      options: { type: Array, required: true },
      listboxId: { type: String, required: true },
    },
    setup(props) {
      result = useListbox(props as unknown as ListboxOwnProps, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper, {
    props: {
      listboxId: "test-listbox",
      options: [{ label: "Active", value: "active" }],
    },
  });

  expect(result.scrollBind.value.class).toContain("max-h-60");
});

test("it should return default size as md", () => {
  const { merged, sizeClasses, messageBind } = mountUseListbox();

  expect(merged.value.size).toBe("md");
  expect(sizeClasses.value?.option).toContain("px-4");
  expect(sizeClasses.value?.option).toContain("py-1.5");
  expect(messageBind.value.class).toContain("text-sm");
});

test("it should bump size classes on dialog overlays", () => {
  const { merged, sizeClasses } = mountUseListbox({ overlay: "drawer" });

  expect(merged.value.size).toBe("md");
  expect(sizeClasses.value?.option).toContain("py-2");
  expect(sizeClasses.value?.primary).toContain("text-sm");
});

test("it should apply size classes when size is overridden", () => {
  const { merged, checkClass, sizeClasses, messageBind } = mountUseListbox({
    size: "xs",
  });

  expect(merged.value.size).toBe("xs");
  expect(checkClass.value).toContain("size-3");
  expect(sizeClasses.value?.option).toContain("px-3");
  expect(messageBind.value.class).toContain("text-xs");
  expect(sizeClasses.value?.primary).toContain("text-xs");
});

test("it should round only the top of the surface when overlay is drawer", () => {
  const { surfaceBind } = mountUseListbox({ overlay: "drawer" });

  expect(surfaceBind.value).toContain("rounded-md");
  expect(surfaceBind.value).toContain("rounded-b-none");
});

test("it should round all corners when overlay is modal", () => {
  const { surfaceBind } = mountUseListbox({ overlay: "modal" });

  expect(surfaceBind.value).toContain("rounded-md");
  expect(surfaceBind.value).not.toContain("rounded-t-md");
});

test("it should follow the rounded prop on dialog surfaces", () => {
  const { surfaceBind } = mountUseListbox({ rounded: "xl", overlay: "modal" });

  expect(surfaceBind.value).toContain("rounded-xl");
});

test("it should follow the rounded prop with top-only corners on drawer", () => {
  const { surfaceBind } = mountUseListbox({
    rounded: "xl",
    overlay: "drawer",
  });

  expect(surfaceBind.value).toContain("rounded-xl");
  expect(surfaceBind.value).toContain("rounded-b-none");
});

test("it should cap full panel rounded to surface-full on modal", () => {
  const { surfaceBind } = mountUseListbox({
    rounded: "full",
    overlay: "modal",
  });

  expect(surfaceBind.value).not.toContain("rounded-full");
  expect(surfaceBind.value).toContain("rounded-surface-full");
});

test("it should use a taller scroll max-height for dialog overlays", () => {
  const { scrollBind } = mountUseListbox({ overlay: "drawer" });

  expect(scrollBind.value.class).toContain("max-h-[min(60dvh,28rem)]");
  expect(scrollBind.value.class).not.toContain("max-h-60");
});

test("it should default showFooter to false on desktop menu when unset", () => {
  mockViewport(1280);

  const { showFooter } = mountUseListbox();

  expect(showFooter.value).toBe(false);
});

test("it should default showFooter to true on mobile drawer when unset", () => {
  mockViewport(500);

  const { showFooter } = mountUseListbox();

  expect(showFooter.value).toBe(true);
});

test("it should default showFooter to true for explicit modal on desktop", () => {
  mockViewport(1280);

  const { showFooter } = mountUseListbox({ overlay: "modal" });

  expect(showFooter.value).toBe(true);
});

test("it should keep explicit showFooter false on dialog overlays", () => {
  mockViewport(500);

  const { showFooter } = mountUseListbox({
    showFooter: false,
    overlay: "drawer",
  });

  expect(showFooter.value).toBe(false);
});
