// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useTimePicker,
  type TimePickerOwnProps,
  type TimePickerProps,
} from "@/Components/TimePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
  showFooter: false,
} as const satisfies Partial<TimePickerOwnProps>;

function renderUseTimePicker(props: TimePickerProps = {}) {
  return renderHook(() =>
    useTimePicker(props, libDefaults as Parameters<typeof useTimePicker>[1]),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseTimePicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseTimePicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});

test("it should size the root to its content", () => {
  const { result } = renderUseTimePicker();

  expect(result.current.rootBind.className).toContain("w-fit");
});
