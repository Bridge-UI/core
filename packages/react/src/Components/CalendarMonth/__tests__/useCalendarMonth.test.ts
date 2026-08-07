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
