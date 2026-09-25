// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import {
  useCalendarYear,
  type CalendarYearOwnProps,
} from "@/Components/CalendarYear";

const libDefaults = {
  pageSize: 15,
  rounded: "md",
  color: "primary",
} satisfies Partial<CalendarYearOwnProps>;

function mountUseCalendarYear(
  props: Partial<CalendarYearOwnProps> = {},
  modelValue: number | undefined = 2021,
) {
  let result!: ReturnType<typeof useCalendarYear>;

  const model = ref<number | undefined>(modelValue);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendarYear(props, libDefaults, model, emit);

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
  const { years } = mountUseCalendarYear();

  expect(years.value.some((cell) => cell.selected)).toBe(true);
});

test("it should not mark a year selected when selection is null", () => {
  const { years } = mountUseCalendarYear({ selection: null });

  expect(years.value.some((cell) => cell.selected)).toBe(false);
});

test("it should mark the year from the selection model on the commit panel", () => {
  const { years } = mountUseCalendarYear({
    selection: new Date(2018, 0, 1),
  });

  const selected = years.value.find((cell) => cell.selected);

  expect(selected?.year).toBe(2018);
});
