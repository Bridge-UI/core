// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useCalendarMonth,
  type CalendarMonthOwnProps,
} from "@/Components/CalendarMonth";

const libDefaults = {
  rounded: "md",
  color: "primary",
} satisfies Partial<CalendarMonthOwnProps>;

function mountUseCalendarMonth(props: Partial<CalendarMonthOwnProps> = {}) {
  let result!: ReturnType<typeof useCalendarMonth>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendarMonth({ year: 2021, ...props }, libDefaults, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should expose twelve month cells", () => {
  const { months } = mountUseCalendarMonth();

  expect(months.value).toHaveLength(12);
});

test("it should mark the selected month", () => {
  const { months } = mountUseCalendarMonth({ value: 4 });

  expect(months.value[4]?.selected).toBe(true);
});

test("it should not mark a month selected when selection is null", () => {
  const { months } = mountUseCalendarMonth({ value: 4, selection: null });

  expect(months.value.some((cell) => cell.selected)).toBe(false);
});

test("it should mark the month from the selection model on the commit panel", () => {
  const { months } = mountUseCalendarMonth({
    value: 4,
    selection: new Date(2021, 2, 1),
  });

  expect(months.value[2]?.selected).toBe(true);
  expect(months.value[4]?.selected).toBe(false);
});
