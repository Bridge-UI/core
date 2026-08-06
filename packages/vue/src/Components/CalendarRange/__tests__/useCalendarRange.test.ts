// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useCalendarRange,
  type CalendarRangeOwnProps,
} from "@/Components/CalendarRange";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} as const satisfies Partial<CalendarRangeOwnProps>;

function mountUseCalendarRange(props: Partial<CalendarRangeOwnProps> = {}) {
  let result!: ReturnType<typeof useCalendarRange>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendarRange(
        {
          viewDate: new Date(2021, 4, 1),
          ...props,
        },
        libDefaults,
        emit,
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default end view one month after start", () => {
  const { viewDate, endViewDate } = mountUseCalendarRange();

  expect(viewDate.value.getMonth()).toBe(4);
  expect(endViewDate.value.getMonth()).toBe(5);
});

test("it should expose end month selector bind", () => {
  const { endMonthLabel, endMonthSelectorBind } = mountUseCalendarRange();

  expect(endMonthLabel.value).toBe("June");
  expect(endMonthSelectorBind.value["aria-label"]).toBe("Select end month");
});
