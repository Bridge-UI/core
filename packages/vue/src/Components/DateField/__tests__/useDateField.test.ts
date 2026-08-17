// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core/Domain";
import { resetBreakpointCachesForTests } from "@bridge-ui/core/Runtime";

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

test("it should default showFooter to true for dialog overlays on desktop", () => {
  mockViewport(1280);

  const { showFooter } = mountUseDateField({ overlay: "modal" });

  expect(showFooter.value).toBe(true);
});

test("it should default showFooter to true for drawer overlays on desktop", () => {
  mockViewport(1280);

  const { showFooter } = mountUseDateField({ overlay: "drawer" });

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

  const { fill, pickerClass } = mountUseDateField();

  expect(fill.value).toBe(false);
  expect(pickerClass.value).toBeUndefined();
});

test("it should not fill the picker when overlay is modal", () => {
  mockViewport(1280);

  const { fill, pickerClass } = mountUseDateField({ overlay: "modal" });

  expect(fill.value).toBe(false);
  expect(pickerClass.value).toBe("shadow-none");
});

test("it should fill the picker for auto overlay on mobile", () => {
  mockViewport(500);

  const { fill, pickerClass } = mountUseDateField();

  expect(fill.value).toBe(true);
  expect(pickerClass.value).toBe("w-full shadow-none rounded-b-none");
});

test("it should keep menu overlay without dialog picker classes", () => {
  mockViewport(500);

  const { fill, pickerClass } = mountUseDateField({ overlay: "menu" });

  expect(fill.value).toBe(false);
  expect(pickerClass.value).toBeUndefined();
});

test("it should fill a modal picker when fill is set", () => {
  mockViewport(1280);

  const { fill, pickerClass } = mountUseDateField({
    fill: true,
    overlay: "modal",
  });

  expect(fill.value).toBe(true);
  expect(pickerClass.value).toBe("w-full shadow-none");
});

test("it should not fill a drawer picker when fill is false", () => {
  mockViewport(1280);

  const { fill, pickerClass } = mountUseDateField({
    fill: false,
    overlay: "drawer",
  });

  expect(fill.value).toBe(false);
  expect(pickerClass.value).toBe("shadow-none rounded-b-none");
});
