// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  useDateRangePicker,
  type DateRangePickerOwnProps,
} from "@/Components/DateRangePicker";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} as const satisfies Partial<DateRangePickerOwnProps>;

function mountUseDateRangePicker(props: Partial<DateRangePickerOwnProps> = {}) {
  let result!: ReturnType<typeof useDateRangePicker>;

  const model = ref<null | DateRangeValue>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useDateRangePicker(props, libDefaults, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseDateRangePicker();

  expect(showFooter.value).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseDateRangePicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});
