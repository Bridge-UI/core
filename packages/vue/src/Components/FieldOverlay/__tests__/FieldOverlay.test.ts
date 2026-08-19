// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

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

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountFieldOverlay(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(FieldOverlay, {
    attachTo: document.body,
    ...options,
    props: {
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: boolean) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render menu content when overlay is menu", () => {
  mountFieldOverlay({
    props: { overlay: "menu", modelValue: true },
    slots: { default: () => h("span", "Picker") },
  });

  expect(document.body.textContent).toContain("Picker");
  expect(document.querySelector('[role="menu"]')).not.toBeNull();
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});

test("it should strip menu chrome so nested content paints the surface", () => {
  mountFieldOverlay({
    props: { overlay: "menu", modelValue: true },
    slots: { default: () => h("span", "Picker") },
  });

  const menu = document.querySelector('[role="menu"]');

  expect(menu?.className).toContain("shadow-none");
  expect(menu?.className).toContain("rounded-none");
  expect(menu?.className).toContain("bg-transparent");
  expect(menu?.className).not.toContain("bg-white");
});

test("it should render modal dialog when overlay is modal", () => {
  mountFieldOverlay({
    slots: { default: () => h("span", "Modal picker") },
    props: {
      modelValue: true,
      overlay: "modal",
      customProps: { modal: { transition: "none" } },
    },
  });

  expect(document.body.textContent).toContain("Modal picker");
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should render drawer dialog when overlay is drawer", () => {
  mountFieldOverlay({
    slots: { default: () => h("span", "Drawer picker") },
    props: {
      modelValue: true,
      overlay: "drawer",
      customProps: { drawer: { transition: "none" } },
    },
  });

  expect(document.body.textContent).toContain("Drawer picker");
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should fade horizontal overflow on a nested drawer scroller", () => {
  mountFieldOverlay({
    slots: { default: () => h("span", "Drawer picker") },
    props: {
      modelValue: true,
      overlay: "drawer",
      customProps: { drawer: { transition: "none" } },
    },
  });

  const panel = document.querySelector('[role="dialog"]');
  const scroller = panel?.querySelector(".bridge-scroll-fade-x");

  expect(panel?.className).not.toContain("bridge-scroll-fade-x");
  expect(scroller).not.toBeNull();
  expect(scroller?.className).toContain("overflow-x-auto");
  expect(scroller?.className).toContain("overflow-y-hidden");
  expect(scroller?.className).toContain("bridge-hide-scrollbar");
});

test("it should resolve auto to menu on desktop", async () => {
  mockViewport(1280);

  mountFieldOverlay({
    props: { overlay: "auto", modelValue: true },
    slots: { default: () => h("span", "Auto desktop") },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Auto desktop");
  expect(document.querySelector('[role="menu"]')).not.toBeNull();
});

test("it should resolve auto to drawer on mobile", () => {
  mockViewport(500);

  mountFieldOverlay({
    slots: { default: () => h("span", "Auto mobile") },
    props: {
      overlay: "auto",
      modelValue: true,
      customProps: { drawer: { transition: "none" } },
    },
  });

  expect(document.body.textContent).toContain("Auto mobile");
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should not render content when modelValue is false", () => {
  mountFieldOverlay({
    props: { overlay: "menu", modelValue: false },
    slots: { default: () => h("span", "Hidden") },
  });

  expect(document.querySelector('[role="menu"]')).toBeNull();
});
