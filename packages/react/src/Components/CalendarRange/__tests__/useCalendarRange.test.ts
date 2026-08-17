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
  orientation: "horizontal",
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

test("it should default to horizontal orientation", () => {
  const { result } = renderUseCalendarRange();

  expect(result.current.merged.orientation).toBe("horizontal");
  expect(result.current.isVertical).toBe(false);
  expect(result.current.rootBind.className).not.toContain("w-full");
  expect(result.current.rootBind.className).toContain("min-w-[38rem]");
  expect(result.current.panelsBind.className).toContain("w-full");
  expect(result.current.panelsBind.className).toContain("flex-row");
  expect(result.current.startBind.className).toContain("flex-1");
  expect(result.current.startBind.className).toContain("min-w-0");
  expect(result.current.startBind.className).toContain("w-full");
  expect(result.current.endBind.className).toContain("flex-1");
});

test("it should stack panels when orientation is vertical", () => {
  const { result } = renderUseCalendarRange({ orientation: "vertical" });

  expect(result.current.isVertical).toBe(true);
  expect(result.current.rootBind.className).toContain("w-72");
  expect(result.current.rootBind.className).toContain("min-w-72");
  expect(result.current.panelsBind.className).toContain("flex-col");
  expect(result.current.startBind.className).toContain("flex-1");
  expect(result.current.startBind.className).toContain("min-w-0");
  expect(result.current.endBind.className).toContain("flex-1");
});
