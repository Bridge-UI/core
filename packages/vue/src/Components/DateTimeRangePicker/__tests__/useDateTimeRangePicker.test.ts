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

test("it should fill the overlay width when fill is set", () => {
  const { rootBind, calendarBind } = mountUseDateTimeRangePicker({
    fill: true,
  });

  expect(calendarBind.value).toContain("w-full");
  expect(rootBind.value.class).toContain("w-full");
  expect(calendarBind.value).toContain("min-w-max");
});

test("it should hug content width when fill is unset", () => {
  const { rootBind, calendarBind } = mountUseDateTimeRangePicker();

  expect(rootBind.value.class.split(/\s+/)).toContain("w-fit");
  expect(calendarBind.value.split(/\s+/)).toContain("min-w-max");
  expect(calendarBind.value.split(/\s+/)).not.toContain("w-full");
  expect(calendarBind.value.split(/\s+/)).not.toContain("min-w-0");
});
