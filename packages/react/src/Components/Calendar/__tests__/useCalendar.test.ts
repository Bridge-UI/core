// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useCalendar,
  type CalendarOwnProps,
  type CalendarProps,
} from "@/Components/Calendar";

const libDefaults = {
  startOfWeek: 0,
  color: "primary",
  defaultView: "date",
} as const satisfies Partial<CalendarOwnProps>;

function renderUseCalendar(props: CalendarProps = {}) {
  return renderHook(() =>
    useCalendar(
      { viewDate: new Date(2021, 4, 1), ...props },
      libDefaults as Parameters<typeof useCalendar>[1],
    ),
  );
}

test("it should default to the date view", () => {
  const { result } = renderUseCalendar();

  expect(result.current.view).toBe("date");
});

test("it should expose month and year labels", () => {
  const { result } = renderUseCalendar();

  expect(result.current.viewYear).toBe(2021);
  expect(result.current.viewMonth).toBe(4);
  expect(result.current.monthLabel.toLowerCase()).toContain("may");
});
