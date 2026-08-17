// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useDateTimeRangePicker,
  type DateTimeRangePickerOwnProps,
  type DateTimeRangePickerProps,
} from "@/Components/DateTimeRangePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  showSeconds: false,
} as const satisfies Partial<DateTimeRangePickerOwnProps>;

function renderUseDateTimeRangePicker(props: DateTimeRangePickerProps = {}) {
  return renderHook(() =>
    useDateTimeRangePicker(
      props,
      libDefaults as Parameters<typeof useDateTimeRangePicker>[1],
    ),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseDateTimeRangePicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseDateTimeRangePicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});

test("it should not shrink the calendar shell below its content", () => {
  const { result } = renderUseDateTimeRangePicker();

  expect(result.current.contentBind).toContain("w-full");
  expect(result.current.contentBind).not.toContain("min-w-0");
  expect(result.current.calendarBind).toContain("w-full");
});

test("it should fill the overlay width when fill is set", () => {
  const { result } = renderUseDateTimeRangePicker({ fill: true });

  expect(result.current.rootBind.className).toContain("w-full");
  expect(result.current.contentBind).toContain("w-full");
  expect(result.current.calendarBind).toContain("w-full");
});
