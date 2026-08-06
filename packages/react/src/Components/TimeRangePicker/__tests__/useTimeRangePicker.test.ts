// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTimeRangePicker,
  type TimeRangePickerOwnProps,
  type TimeRangePickerProps,
} from "@/Components/TimeRangePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
  showFooter: false,
} as const satisfies Partial<TimeRangePickerOwnProps>;

function renderUseTimeRangePicker(props: TimeRangePickerProps = {}) {
  return renderHook(() =>
    useTimeRangePicker(
      props,
      libDefaults as Parameters<typeof useTimeRangePicker>[1],
    ),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseTimeRangePicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseTimeRangePicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});
