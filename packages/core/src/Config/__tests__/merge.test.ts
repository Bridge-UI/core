// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import {
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  resolveBridgeUIOptions,
} from "@/Config/merge";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@/Config/types";

test("it should return base when no partials provided", () => {
  const result = mergeBridgeUIGlobal({
    partials: [],
    base: BRIDGE_UI_DEFAULT_GLOBAL,
  });

  expect(result).toEqual(BRIDGE_UI_DEFAULT_GLOBAL);
});

test("it should deep-merge formDefaults from partials", () => {
  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [
      { formDefaults: { size: "lg" } },
      { formDefaults: { rounded: "xl" } },
    ],
  });

  expect(result.formDefaults).toEqual({ size: "lg", rounded: "xl" });
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

test("it should replace icons adapters instead of deep-merging them", () => {
  const first = { resolve: () => "first" };
  const second = { resolve: () => "second" };

  const result = mergeBridgeUIGlobal({
    partials: [{ icons: second }],
    base: { ...BRIDGE_UI_DEFAULT_GLOBAL, icons: first },
  });

  expect(result.icons).toBe(second);
  expect(result.icons?.resolve("clear" as never)).toBe("second");
});

test("it should replace i18n adapters instead of deep-merging them", () => {
  const first = { t: () => "first" };
  const second = { t: () => "second" };

  const result = mergeBridgeUIGlobal({
    partials: [{ i18n: second }],
    base: { ...BRIDGE_UI_DEFAULT_GLOBAL, i18n: first },
  });

  expect(result.i18n).toBe(second);
  expect(result.i18n?.t("close" as never)).toBe("second");
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
