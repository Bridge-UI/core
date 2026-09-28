// ** External Imports
import { get } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import {
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  resolveBridgeUIOptions,
} from "@/Config/merge";
import {
  BRIDGE_UI_DEFAULT_GLOBAL,
  type BridgeUIComponentsConfig,
  type BridgeUIGlobal,
} from "@/Config/types";

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

test("it should replace dates adapters instead of deep-merging them", () => {
  const first = createNativeDateAdapter();
  const second = createNativeDateAdapter();

  const result = mergeBridgeUIGlobal({
    partials: [{ dates: second }],
    base: { ...BRIDGE_UI_DEFAULT_GLOBAL, dates: first },
  });

  expect(result.dates).toBe(second);
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

test("it should replace richText adapters instead of deep-merging them", () => {
  const first = { mount: () => ({}) as never };
  const second = { mount: () => ({}) as never };

  const result = mergeBridgeUIGlobal({
    partials: [{ richText: second }],
    base: { ...BRIDGE_UI_DEFAULT_GLOBAL, richText: first },
  });

  expect(result.richText).toBe(second);
});

test("it should keep an adapter when a later layer leaves it undefined", () => {
  const icons = { resolve: () => "icon" };

  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [{ icons }, { theme: "dark", icons: undefined }],
  });

  expect(result.icons).toBe(icons);
  expect(result.theme).toBe("dark");
});

test("it should replace custom global values that hold functions", () => {
  const first = { theme: "snow", format: () => "first" };
  const second = { format: () => "second" };

  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [
      { editor: first } as Partial<BridgeUIGlobal>,
      { editor: second } as Partial<BridgeUIGlobal>,
    ],
  });

  expect(get(result, "editor")).toBe(second);
});

test("it should replace custom global class instances", () => {
  class Engine {
    name = "engine";
  }

  const engine = new Engine();

  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [{ engine } as Partial<BridgeUIGlobal>],
  });

  expect(get(result, "engine")).toBe(engine);
});

test("it should deep-merge custom global plain data", () => {
  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [
      { editor: { theme: "snow" } } as Partial<BridgeUIGlobal>,
      { editor: { toolbar: true } } as Partial<BridgeUIGlobal>,
    ],
  });

  expect(get(result, "editor")).toEqual({ theme: "snow", toolbar: true });
});

test("it should deep-merge breakpoints across layers", () => {
  const result = mergeBridgeUIGlobal({
    base: BRIDGE_UI_DEFAULT_GLOBAL,
    partials: [
      { breakpoints: { sm: "40rem" } },
      { breakpoints: { md: "48rem" } },
    ],
  });

  expect(result.breakpoints).toEqual({ sm: "40rem", md: "48rem" });
});

test("it should merge custom registry entries from partials", () => {
  const result = mergeBridgeUIComponents({
    base: {},
    partials: [
      { Editor: { defaultProps: { size: "sm" } } } as BridgeUIComponentsConfig,
      { Editor: { classes: { root: "p-2" } } } as BridgeUIComponentsConfig,
    ],
  });

  expect(get(result, "Editor")).toEqual({
    classes: { root: "p-2" },
    defaultProps: { size: "sm" },
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
