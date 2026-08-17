// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTimePanel,
  type TimePanelOwnProps,
  type TimePanelProps,
} from "@/Components/TimePanel";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
  showSeconds: false,
} as const satisfies Partial<TimePanelOwnProps>;

function renderUseTimePanel(props: TimePanelProps = {}) {
  return renderHook(() =>
    useTimePanel(props, libDefaults as Parameters<typeof useTimePanel>[1]),
  );
}

test("it should expose twenty-four hour items by default", () => {
  const { result } = renderUseTimePanel({
    value: new Date(2021, 4, 21, 9, 30),
  });

  expect(result.current.hourItems).toHaveLength(24);
});

test("it should keep a compact width with flexible columns by default", () => {
  const { result } = renderUseTimePanel({
    value: new Date(2021, 4, 21, 9, 30),
  });

  expect(result.current.rootBind.className).toContain("w-fit");
  expect(result.current.rootBind.className).not.toContain("w-full");
  expect(result.current.columnBind.className).toContain("flex-1");
  expect(result.current.columnBind.className).toContain("min-w-[3.75rem]");
});

test("it should fill available width when fill is set", () => {
  const { result } = renderUseTimePanel({
    fill: true,
    value: new Date(2021, 4, 21, 9, 30),
  });

  expect(result.current.rootBind.className).toContain("w-full");
});

test("it should expose twelve hour items when ampm is set", () => {
  const { result } = renderUseTimePanel({
    ampm: true,
    value: new Date(2021, 4, 21, 9, 30),
  });

  expect(result.current.hourItems).toHaveLength(12);
  expect(result.current.showMeridiem).toBe(true);
});
