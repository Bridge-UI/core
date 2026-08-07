// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useCalendarDate,
  type CalendarDateOwnProps,
  type CalendarDateProps,
} from "@/Components/CalendarDate";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} as const satisfies Partial<CalendarDateOwnProps>;

function renderUseCalendarDate(props: CalendarDateProps = {}) {
  return renderHook(() =>
    useCalendarDate(
      { viewDate: new Date(2021, 4, 1), ...props },
      libDefaults as Parameters<typeof useCalendarDate>[1],
    ),
  );
}

test("it should build a 42-day grid", () => {
  const { result } = renderUseCalendarDate();

  expect(result.current.days).toHaveLength(42);
});

test("it should default color to primary", () => {
  const { result } = renderUseCalendarDate();

  expect(result.current.merged.color).toBe("primary");
});

test("it should rotate weekdays for startOfWeek", () => {
  const { result } = renderUseCalendarDate({ startOfWeek: 1 });

  expect(result.current.weekdays[0]?.toLowerCase().startsWith("m")).toBe(true);
});

test("it should mark selected day cells", () => {
  const { result } = renderUseCalendarDate({
    value: new Date(2021, 4, 21),
  });

  const selected = result.current.days.filter((day) => day.selected);

  expect(selected).toHaveLength(1);
  expect(selected[0]?.label).toBe("21");
});
