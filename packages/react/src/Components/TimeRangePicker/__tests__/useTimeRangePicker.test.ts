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
  showSeconds: false,
  orientation: "horizontal",
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

test("it should size the root to content and let panels grow", () => {
  const { result } = renderUseTimeRangePicker();

  expect(result.current.rootBind.className).toContain("w-fit");
  expect(result.current.endBind.className).toContain("flex-1");
  expect(result.current.startBind.className).toContain("flex-1");
  expect(result.current.panelsBind.className).toContain("w-full");
  expect(result.current.panelsBind.className).toContain("px-2.5");
  expect(result.current.panelsBind.className).toContain("flex-row");
  expect(result.current.rootBind.className).not.toContain("px-2.5");
});

test("it should stack panels when orientation is vertical", () => {
  const { result } = renderUseTimeRangePicker({ orientation: "vertical" });

  expect(result.current.panelsBind.className).toContain("flex-col");
  expect(result.current.startBind.className).toContain("flex-1");
  expect(result.current.endBind.className).toContain("flex-1");
});
