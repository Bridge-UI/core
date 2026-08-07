// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useCalendarYear,
  type CalendarYearOwnProps,
  type CalendarYearProps,
} from "@/Components/CalendarYear";

const libDefaults = {
  pageSize: 15,
  rounded: "md",
  color: "primary",
} as const satisfies Partial<CalendarYearOwnProps>;

function renderUseCalendarYear(props: CalendarYearProps = {}) {
  return renderHook(() =>
    useCalendarYear(
      { value: 2021, ...props },
      libDefaults as Parameters<typeof useCalendarYear>[1],
    ),
  );
}

test("it should expose pageSize year cells", () => {
  const { result } = renderUseCalendarYear();

  expect(result.current.years).toHaveLength(15);
});

test("it should mark the selected year", () => {
  const { result } = renderUseCalendarYear({ value: 2021 });

  expect(result.current.years.some((cell) => cell.selected)).toBe(true);
});
