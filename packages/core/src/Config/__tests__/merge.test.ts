// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import {
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  resolveBridgeUIOptions,
} from "@core/Config/merge";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@core/Config/types";

test("it should return base when no partials provided", () => {
  const result = mergeBridgeUIGlobal({
    partials: [],
    base: BRIDGE_UI_DEFAULT_GLOBAL,
  });

  expect(result).toEqual(BRIDGE_UI_DEFAULT_GLOBAL);
});

test("it should override specific global fields from partials", () => {
  const result = mergeBridgeUIGlobal({
    partials: [{ theme: "dark" }],
    base: BRIDGE_UI_DEFAULT_GLOBAL,
  });

  expect(result).toEqual({
    ...BRIDGE_UI_DEFAULT_GLOBAL,
    theme: "dark",
  });
});

test("it should apply multiple global partials in order", () => {
  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [{ theme: "dark", locale: "pt-BR" }, { locale: "es-ES" }],
  });

  expect(result).toEqual({
    ...BRIDGE_UI_DEFAULT_GLOBAL,
    theme: "dark",
    locale: "es-ES",
  });
});

test("it should skip undefined global partials", () => {
  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [undefined, { direction: "rtl" }],
  });

  expect(result).toEqual({
    ...BRIDGE_UI_DEFAULT_GLOBAL,
    direction: "rtl",
  });
});

test("it should return base when no component partials provided", () => {
  const result = mergeBridgeUIComponents({
    base: {},
    partials: [],
  });

  expect(result).toEqual({});
});

test("it should merge component configs from partials", () => {
  const result = mergeBridgeUIComponents({
    base: {},
    partials: [{ Alert: { defaultProps: { color: "error" } } }],
  });

  expect(result).toEqual({
    Alert: { defaultProps: { color: "error" } },
  });
});

test("it should return defaults when called with no options", () => {
  const result = resolveBridgeUIOptions();

  expect(result).toEqual({
    components: {},
    global: BRIDGE_UI_DEFAULT_GLOBAL,
  });
});

test("it should merge user options over defaults", () => {
  const result = resolveBridgeUIOptions({
    global: { theme: "dark" },
    components: { Alert: { defaultProps: { color: "success" } } },
  });

  expect(result.global.theme).toBe("dark");
  expect(result.global.locale).toBe("en-US");
  expect(result.components.Alert?.defaultProps?.color).toBe("success");
});
