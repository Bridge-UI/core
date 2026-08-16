// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useDatePicker,
  type DatePickerOwnProps,
} from "@/Components/DatePicker";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} as const satisfies Partial<DatePickerOwnProps>;

function mountUseDatePicker(props: Partial<DatePickerOwnProps> = {}) {
  let result!: ReturnType<typeof useDatePicker>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useDatePicker(props, libDefaults, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseDatePicker();

  expect(showFooter.value).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseDatePicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});

test("it should size the root to its content", () => {
  const { rootBind } = mountUseDatePicker();

  expect(rootBind.value.class).toContain("w-fit");
});

test("it should apply shell rounded from the rounded prop", () => {
  const { rootBind } = mountUseDatePicker({ rounded: "xl" });

  expect(rootBind.value.class).toContain("rounded-xl");
  expect(rootBind.value.class).not.toContain("rounded-lg");
});

test("it should cap full shell rounded to panel-full", () => {
  const { rootBind } = mountUseDatePicker({ rounded: "full" });

  expect(rootBind.value.class).not.toContain("rounded-full");
  expect(rootBind.value.class).toContain("rounded-panel-full");
});
