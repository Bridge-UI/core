// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useDateTimeRangePicker,
  type DateTimeRangePickerOwnProps,
} from "@/Components/DateTimeRangePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  showFooter: false,
  showSeconds: false,
} as const satisfies Partial<DateTimeRangePickerOwnProps>;

function mountUseDateTimeRangePicker(
  props: Partial<DateTimeRangePickerOwnProps> = {},
) {
  let result!: ReturnType<typeof useDateTimeRangePicker>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useDateTimeRangePicker(props, libDefaults, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseDateTimeRangePicker();

  expect(showFooter.value).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseDateTimeRangePicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});
