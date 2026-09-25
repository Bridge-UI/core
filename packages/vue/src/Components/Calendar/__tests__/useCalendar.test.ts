// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core/Domain";

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

  const model = ref<DatePickerModel>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useCalendar(
        { viewDate: new Date(2021, 4, 1), ...props },
        libDefaults,
        model,
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

test("it should size the root to the minimum width by default", () => {
  const { rootBind } = mountUseCalendar();

  expect(rootBind.value.class).toContain("w-72");
  expect(rootBind.value.class).not.toContain("w-full");
});

test("it should fill available width when fill is set", () => {
  const { rootBind } = mountUseCalendar({ fill: true });

  expect(rootBind.value.class).toContain("w-full");
  expect(rootBind.value.class).toContain("min-w-72");
});

test("it should expose month and year labels", () => {
  const { viewYear, viewMonth, monthLabel } = mountUseCalendar();

  expect(viewYear.value).toBe(2021);
  expect(viewMonth.value).toBe(4);
  expect(monthLabel.value.toLowerCase()).toContain("may");
});

test("it should open on the month view when granularity is month", () => {
  const { view } = mountUseCalendar({ granularity: "month" });

  expect(view.value).toBe("month");
});

test("it should clamp defaultView so it is not deeper than granularity", () => {
  const { view } = mountUseCalendar({
    granularity: "year",
    defaultView: "date",
  });

  expect(view.value).toBe("year");
});
