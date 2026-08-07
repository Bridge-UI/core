// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core";

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
  const show = ref(true);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useFieldOverlay(props, show, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should resolve menu by default", () => {
  mockViewport(1280);

  const { resolvedOverlay } = mountUseFieldOverlay();

  expect(resolvedOverlay.value).toBe("menu");
});

test("it should resolve explicit drawer", () => {
  const { drawerBind, resolvedOverlay } = mountUseFieldOverlay({
    overlay: "drawer",
  });

  expect(resolvedOverlay.value).toBe("drawer");
  expect(drawerBind.value.placement).toBe("bottom");
  expect(drawerBind.value.size).toBe("md");
});

test("it should resolve explicit modal", () => {
  const { modalBind, resolvedOverlay } = mountUseFieldOverlay({
    overlay: "modal",
  });

  expect(resolvedOverlay.value).toBe("modal");
  expect(modalBind.value.align).toBe("middle-center");
  expect(modalBind.value.size).toBe("md");
});

test("it should resolve auto to drawer on mobile", () => {
  mockViewport(500);

  const { resolvedOverlay } = mountUseFieldOverlay({ overlay: "auto" });

  expect(resolvedOverlay.value).toBe("drawer");
});

test("it should apply panel padding on drawer and modal", () => {
  const { modalBind, drawerBind } = mountUseFieldOverlay({
    overlay: "drawer",
  });

  expect(drawerBind.value.customProps?.panel?.class).toContain("p-2");
  expect(modalBind.value.customProps?.panel?.class).toContain("p-2");
});

test("it should forward customProps.menu onto menuBind", () => {
  const { menuBind } = mountUseFieldOverlay({
    customProps: { menu: { shadow: "lg" } },
  });

  expect(menuBind.value.shadow).toBe("lg");
});
