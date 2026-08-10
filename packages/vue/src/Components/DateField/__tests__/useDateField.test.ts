// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import {
  resetBreakpointCachesForTests,
  type DatePickerModel,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateField, type DateFieldOwnProps } from "@/Components/DateField";

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

function mountUseDateField(props: Partial<DateFieldOwnProps> = {}) {
  let result!: ReturnType<typeof useDateField>;

  const model = ref<null | undefined | DatePickerModel>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

afterEach(() => {
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

test("it should start closed", () => {
  mockViewport(1280);

  const { open } = mountUseDateField();

  expect(open.value).toBe(false);
});

test("it should default to single mode", () => {
  mockViewport(1280);

  const { mode } = mountUseDateField();

  expect(mode.value).toBe("single");
});

test("it should default showFooter to false on desktop", () => {
  mockViewport(1280);

  const { showFooter } = mountUseDateField();

  expect(showFooter.value).toBe(false);
});

test("it should default showFooter to true on mobile", () => {
  mockViewport(500);

  const { showFooter } = mountUseDateField();

  expect(showFooter.value).toBe(true);
});

test("it should keep explicit showFooter false on mobile", () => {
  mockViewport(500);

  const { showFooter } = mountUseDateField({ showFooter: false });

  expect(showFooter.value).toBe(false);
});

test("it should keep explicit showFooter true on desktop", () => {
  mockViewport(1280);

  const { showFooter } = mountUseDateField({ showFooter: true });

  expect(showFooter.value).toBe(true);
});

test("it should leave picker class empty for auto overlay on desktop", () => {
  mockViewport(1280);

  const { pickerClass } = mountUseDateField();

  expect(pickerClass.value).toBeUndefined();
});

test("it should stretch the picker when overlay is a dialog", () => {
  mockViewport(1280);

  const { pickerClass } = mountUseDateField({ overlay: "modal" });

  expect(pickerClass.value).toBe("w-full shadow-none");
});

test("it should stretch the picker for auto overlay on mobile", () => {
  mockViewport(500);

  const { pickerClass } = mountUseDateField();

  expect(pickerClass.value).toBe("w-full shadow-none");
});

test("it should keep menu overlay without dialog picker classes", () => {
  mockViewport(500);

  const { pickerClass } = mountUseDateField({ overlay: "menu" });

  expect(pickerClass.value).toBeUndefined();
});
