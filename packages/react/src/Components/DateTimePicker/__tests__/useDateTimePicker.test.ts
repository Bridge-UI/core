// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useDateTimePicker,
  type DateTimePickerOwnProps,
  type DateTimePickerProps,
} from "@/Components/DateTimePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  showFooter: false,
  defaultView: "date",
} as const satisfies Partial<DateTimePickerOwnProps>;

function renderUseDateTimePicker(props: DateTimePickerProps = {}) {
  return renderHook(() =>
    useDateTimePicker(
      props,
      libDefaults as Parameters<typeof useDateTimePicker>[1],
    ),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseDateTimePicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseDateTimePicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});
