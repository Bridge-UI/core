// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useCalendarYear,
  type CalendarYearOwnProps,
} from "@/Components/CalendarYear";

const libDefaults = {
  pageSize: 15,
  color: "primary",
} satisfies Partial<CalendarYearOwnProps>;

function mountUseCalendarYear(props: Partial<CalendarYearOwnProps> = {}) {
  let result!: ReturnType<typeof useCalendarYear>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendarYear({ value: 2021, ...props }, libDefaults, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should expose pageSize year cells", () => {
  const { years } = mountUseCalendarYear();

  expect(years.value).toHaveLength(15);
});

test("it should mark the selected year", () => {
  const { years } = mountUseCalendarYear({ value: 2021 });

  expect(years.value.some((cell) => cell.selected)).toBe(true);
});
