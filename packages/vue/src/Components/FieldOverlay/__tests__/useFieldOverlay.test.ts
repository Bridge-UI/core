// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

// ** Local Imports
import {
  useFieldOverlay,
  type FieldOverlayOwnProps,
} from "@/Components/FieldOverlay";

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

function mountUseFieldOverlay(props: FieldOverlayOwnProps = {}) {
  let result!: ReturnType<typeof useFieldOverlay>;

  const Wrapper = defineComponent({
    setup() {
      result = useFieldOverlay(props);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should resolve menu by default on desktop", () => {
  mockViewport(1280);

  const { resolvedOverlay } = mountUseFieldOverlay();

  expect(resolvedOverlay.value).toBe("menu");
});

test("it should resolve drawer by default on mobile", () => {
  mockViewport(500);

  const { resolvedOverlay } = mountUseFieldOverlay();

  expect(resolvedOverlay.value).toBe("drawer");
});

test("it should resolve explicit drawer", () => {
  const { drawerBind, resolvedOverlay } = mountUseFieldOverlay({
    overlay: "drawer",
  });

  expect(drawerBind.value.size).toBe("md");
  expect(resolvedOverlay.value).toBe("drawer");
  expect(drawerBind.value.placement).toBe("bottom");
});

test("it should resolve explicit modal", () => {
  const { modalBind, resolvedOverlay } = mountUseFieldOverlay({
    overlay: "modal",
  });

  expect(modalBind.value.size).toBe("md");
  expect(resolvedOverlay.value).toBe("modal");
  expect(modalBind.value.closeOnOverlay).toBe(true);
  expect(modalBind.value.align).toBe("middle-center");
  expect(modalBind.value.disableRestoreFocus).toBe(true);
});

test("it should resolve auto to drawer on mobile", () => {
  mockViewport(500);

  const { resolvedOverlay } = mountUseFieldOverlay({ overlay: "auto" });

  expect(resolvedOverlay.value).toBe("drawer");
});

test("it should apply panel padding and layout on drawer and modal", () => {
  const { modalBind, drawerBind } = mountUseFieldOverlay({
    overlay: "drawer",
  });

  const drawerPanel = drawerBind.value.customProps?.panel?.class;
  const modalPanel = modalBind.value.customProps?.panel?.class;

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
  const { modalBind } = mountUseFieldOverlay({
    overlay: "modal",
  });

  expect(modalBind.value.scroll).toBe("paper");
  expect(modalBind.value.align).toBe("middle-center");
});

test("it should scroll drawer content inside the paper panel", () => {
  const { drawerBind } = mountUseFieldOverlay({
    overlay: "drawer",
  });

  expect(drawerBind.value.scroll).toBe("paper");
});

test("it should forward customProps.menu onto menuBind", () => {
  const { menuBind } = mountUseFieldOverlay({
    customProps: { menu: { shadow: "lg" } },
  });

  expect(menuBind.value.shadow).toBe("lg");
});

test("it should strip menu content chrome by default", () => {
  const { menuBind } = mountUseFieldOverlay();

  expect(menuBind.value.classes?.content).toContain("rounded-none");
  expect(menuBind.value.classes?.content).toContain("bg-transparent");
});
