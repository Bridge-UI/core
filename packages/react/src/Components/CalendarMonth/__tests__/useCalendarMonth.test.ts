// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useCalendarMonth,
  type CalendarMonthOwnProps,
  type CalendarMonthProps,
} from "@/Components/CalendarMonth";

const libDefaults = {
  rounded: "md",
  color: "primary",
} as const satisfies Partial<CalendarMonthOwnProps>;

function renderUseCalendarMonth(props: CalendarMonthProps = {}) {
  return renderHook(() =>
    useCalendarMonth(
      { year: 2021, ...props },
      libDefaults as Parameters<typeof useCalendarMonth>[1],
    ),
  );
}

test("it should expose twelve month cells", () => {
  const { result } = renderUseCalendarMonth();

  expect(result.current.months).toHaveLength(12);
});

test("it should mark the selected month", () => {
  const { result } = renderUseCalendarMonth({ value: 4 });

  expect(result.current.months[4]?.selected).toBe(true);
});

test("it should not mark a month selected when selection is null", () => {
  const { result } = renderUseCalendarMonth({ value: 4, selection: null });

  expect(result.current.months.some((cell) => cell.selected)).toBe(false);
});

test("it should mark the month from the selection model on the commit panel", () => {
  const { result } = renderUseCalendarMonth({
    value: 4,
    selection: new Date(2021, 2, 1),
  });

  expect(result.current.months[2]?.selected).toBe(true);
  expect(result.current.months[4]?.selected).toBe(false);
});
