// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useDatePicker,
  type DatePickerOwnProps,
  type DatePickerProps,
} from "@/Components/DatePicker";

const libDefaults = {
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
} as const satisfies Partial<DatePickerOwnProps>;

function renderUseDatePicker(props: DatePickerProps = {}) {
  return renderHook(() =>
    useDatePicker(props, libDefaults as Parameters<typeof useDatePicker>[1]),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseDatePicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseDatePicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});

test("it should size the root to its content", () => {
  const { result } = renderUseDatePicker();

  expect(result.current.rootBind.className).toContain("w-fit");
});

test("it should apply shell rounded from the rounded prop", () => {
  const { result } = renderUseDatePicker({ rounded: "xl" });

  expect(result.current.rootBind.className).toContain("rounded-xl");
  expect(result.current.rootBind.className).not.toContain("rounded-lg");
});

test("it should cap full shell rounded to panel-full", () => {
  const { result } = renderUseDatePicker({ rounded: "full" });

  expect(result.current.rootBind.className).not.toContain("rounded-full");
  expect(result.current.rootBind.className).toContain("rounded-panel-full");
});
