// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useCalendarRange,
  type CalendarRangeOwnProps,
  type CalendarRangeProps,
} from "@/Components/CalendarRange";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} as const satisfies Partial<CalendarRangeOwnProps>;

function renderUseCalendarRange(props: CalendarRangeProps = {}) {
  return renderHook(() =>
    useCalendarRange(
      props,
      libDefaults as Parameters<typeof useCalendarRange>[1],
    ),
  );
}

test("it should default end view one month after start", () => {
  const { result } = renderUseCalendarRange({
    onViewDateChange: () => {},
    viewDate: new Date(2021, 4, 1),
  });

  expect(result.current.viewDate.getMonth()).toBe(4);
  expect(result.current.endViewDate.getMonth()).toBe(5);
});

test("it should expose end month selector bind", () => {
  const { result } = renderUseCalendarRange({
    onViewDateChange: () => {},
    viewDate: new Date(2021, 4, 1),
  });

  expect(result.current.endMonthLabel).toBe("June");
  expect(result.current.endMonthSelectorBind["aria-label"]).toBe(
    "Select end month",
  );
});
