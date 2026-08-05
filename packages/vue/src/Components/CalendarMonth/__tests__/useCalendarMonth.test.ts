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
