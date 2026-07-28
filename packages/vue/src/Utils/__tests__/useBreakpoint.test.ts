// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Core Imports
import { resetBreakpointCachesForTests } from "@bridge-ui/core";

// ** Local Imports
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";
import { useBreakpoint } from "@/Utils/useBreakpoint";

function mockViewport(width: number, height = 800) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: height,
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

function mountUseBreakpoint(
  options?: Parameters<typeof useBreakpoint>[0],
  providerGlobal?: { mobileBreakpoint?: string },
) {
  let result!: ReturnType<typeof useBreakpoint>;

  const Child = defineComponent({
    setup() {
      result = useBreakpoint(options);

      return () => h("div");
    },
  });

  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          providerGlobal
            ? h(BridgeUIProvider, { global: providerGlobal }, () => h(Child))
            : h(Child);
      },
    }),
  );

  return { result, wrapper };
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should report lessThan sm below the sm breakpoint", () => {
  mockViewport(500);

  const { result, wrapper } = mountUseBreakpoint();

  expect(result.mobile).toBe(true);
  expect(result.lessThan("sm")).toBe(true);
  expect(result.lessOrEqual("sm")).toBe(true);
  expect(result.greaterOrEqual("sm")).toBe(false);
  expect(result.name).toBe("xs");

  wrapper.unmount();
});

test("it should report greaterOrEqual sm at desktop widths", () => {
  mockViewport(900);

  const { result, wrapper } = mountUseBreakpoint();

  expect(result.mobile).toBe(false);
  expect(result.greaterOrEqual("sm")).toBe(true);
  expect(result.name).toBe("md");

  wrapper.unmount();
});

test("it should honor custom breakpoint overrides", () => {
  mockViewport(500);

  const { result, wrapper } = mountUseBreakpoint({
    breakpoints: { sm: "30rem" },
  });

  expect(result.greaterOrEqual("sm")).toBe(true);
  expect(result.thresholds.sm).toBe(480);

  wrapper.unmount();
});

test("it should use global mobileBreakpoint from BridgeUIProvider", () => {
  mockViewport(700);

  const { result, wrapper } = mountUseBreakpoint(undefined, {
    mobileBreakpoint: "md",
  });

  expect(result.mobile).toBe(true);
  expect(result.greaterOrEqual("sm")).toBe(true);

  wrapper.unmount();
});
