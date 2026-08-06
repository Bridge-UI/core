// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useCalendar, type CalendarOwnProps } from "@/Components/Calendar";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  defaultView: "date",
} as const satisfies Partial<CalendarOwnProps>;

function mountUseCalendar(props: Partial<CalendarOwnProps> = {}) {
  let result!: ReturnType<typeof useCalendar>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendar(
        { viewDate: new Date(2021, 4, 1), ...props },
        libDefaults,
        emit,
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default to the date view", () => {
  const { view } = mountUseCalendar();

  expect(view.value).toBe("date");
});

test("it should expose month and year labels", () => {
  const { viewYear, viewMonth, monthLabel } = mountUseCalendar();

  expect(viewYear.value).toBe(2021);
  expect(viewMonth.value).toBe(4);
  expect(monthLabel.value.toLowerCase()).toContain("may");
});
