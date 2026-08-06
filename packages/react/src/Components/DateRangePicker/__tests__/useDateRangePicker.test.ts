// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useDateRangePicker,
  type DateRangePickerOwnProps,
  type DateRangePickerProps,
} from "@/Components/DateRangePicker";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  showFooter: false,
} as const satisfies Partial<DateRangePickerOwnProps>;

function renderUseDateRangePicker(props: DateRangePickerProps = {}) {
  return renderHook(() =>
    useDateRangePicker(
      props,
      libDefaults as Parameters<typeof useDateRangePicker>[1],
    ),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseDateRangePicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseDateRangePicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});
