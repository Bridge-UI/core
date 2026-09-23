// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import {
  createNativeDateAdapter,
  defaultNativeDateAdapter,
} from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useDateAdapter } from "@/Adapters/Date";
import { BridgeUIProvider } from "@/Provider/BridgeUIProvider";
import { useBridgeUI } from "@/Provider/useBridgeUI";

afterEach(() => cleanup());

function wrapper({ children }: { children: ReactNode }) {
  return createElement(BridgeUIProvider, { children });
}

test("it should update locale theme direction and timeZone via aliases", () => {
  const { result } = renderHook(() => useBridgeUI()!, { wrapper });

  act(() => {
    result.current.setLocale("pt-BR");
    result.current.setTheme("dark");
    result.current.setDirection("rtl");
    result.current.setTimeZone("America/Sao_Paulo");
  });

  expect(result.current.global.theme).toBe("dark");
  expect(result.current.global.locale).toBe("pt-BR");
  expect(result.current.global.direction).toBe("rtl");
  expect(result.current.global.timeZone).toBe("America/Sao_Paulo");
});

test("it should call date adapter setLocale when setLocale is used", () => {
  const setLocale = vi.fn();
  const dates = {
    ...createNativeDateAdapter(),
    setLocale,
  };

  const { result } = renderHook(() => useBridgeUI()!, {
    wrapper: ({ children }) =>
      createElement(BridgeUIProvider, { children, global: { dates } }),
  });

  act(() => {
    result.current.setLocale("pt-BR");
  });

  expect(result.current.global.locale).toBe("pt-BR");
  expect(setLocale).toHaveBeenCalledWith("pt-BR");
});

test("it should call date adapter setTimeZone when setTimeZone is used", () => {
  const setTimeZone = vi.fn();
  const dates = {
    ...createNativeDateAdapter(),
    setTimeZone,
  };

  const { result } = renderHook(() => useBridgeUI()!, {
    wrapper: ({ children }) =>
      createElement(BridgeUIProvider, { children, global: { dates } }),
  });

  act(() => {
    result.current.setTimeZone("UTC");
  });

  expect(result.current.global.timeZone).toBe("UTC");
  expect(setTimeZone).toHaveBeenCalledWith("UTC");
});

test("it should keep a native date adapter per provider", () => {
  const probe = new Date("2024-01-15T15:00:00.000Z");

  const { result: utc } = renderHook(() => useDateAdapter(), {
    wrapper: ({ children }) =>
      createElement(BridgeUIProvider, {
        children,
        global: { timeZone: "UTC" },
      }),
  });

  const { result: saoPaulo } = renderHook(() => useDateAdapter(), {
    wrapper: ({ children }) =>
      createElement(BridgeUIProvider, {
        children,
        global: { timeZone: "America/Sao_Paulo" },
      }),
  });

  expect(utc.current).not.toBe(saoPaulo.current);
  expect(utc.current).not.toBe(defaultNativeDateAdapter);
  expect(utc.current.getHours(probe)).toBe(15);
  expect(saoPaulo.current.getHours(probe)).toBe(12);
});
