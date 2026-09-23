// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { expect, test, vi } from "vitest";

// ** Core Imports
import { createNativeDateAdapter } from "@bridge-ui/core/Adapters";
import type { BridgeUIGlobal } from "@bridge-ui/core/Config";

// ** Local Imports
import {
  useDateTimeField,
  type DateTimeFieldProps,
} from "@/Components/DateTimeField";
import { BridgeUIProvider } from "@/Provider/BridgeUIProvider";

const SAO_PAULO = "America/Sao_Paulo";

function wallClock(timeZone: string) {
  const adapter = createNativeDateAdapter();
  let date = adapter.parse("2024-01-15", timeZone)!;

  date = adapter.setHours(date, 15, timeZone);
  date = adapter.setMinutes(date, 0, timeZone);

  return adapter.setSeconds(date, 0, timeZone);
}

function renderUseDateTimeField(
  props: DateTimeFieldProps = {},
  global?: Partial<BridgeUIGlobal>,
) {
  return renderHook(() => useDateTimeField(props), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(BridgeUIProvider, { global, children }),
  });
}

test("it should start closed", () => {
  const { result } = renderUseDateTimeField();

  expect(result.current.open).toBe(false);
});

test("it should expose a null model by default", () => {
  const { result } = renderUseDateTimeField();

  expect(result.current.modelValue).toBeNull();
});

test("it should emit a UTC instant for Sao Paulo wall clock", () => {
  const onChange = vi.fn();
  const { result } = renderUseDateTimeField(
    { onChange },
    { timeZone: SAO_PAULO },
  );

  act(() => {
    result.current.handlePickerChange(wallClock(SAO_PAULO));
  });

  expect(onChange.mock.calls[0][0].toISOString()).toBe(
    "2024-01-15T18:00:00.000Z",
  );
});

test("it should use UTC on one field without converting from Sao Paulo", () => {
  const onChange = vi.fn();
  const { result } = renderUseDateTimeField(
    { onChange, timeZone: "UTC" },
    { timeZone: SAO_PAULO },
  );

  act(() => {
    result.current.handlePickerChange(wallClock("UTC"));
  });

  expect(onChange.mock.calls[0][0].toISOString()).toBe(
    "2024-01-15T15:00:00.000Z",
  );
});
