// ** External Imports
import { toMerged } from "es-toolkit/object";

// ** Core Imports
import { createNativeDateAdapter } from "@bridge-ui/core/Adapters";
import {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  type BridgeUIComponentsConfig,
  type BridgeUIGlobal,
  type Direction,
} from "@bridge-ui/core/Config";

// ** Local Imports
import type {
  BridgeUIContextApi,
  BridgeUIOptionsGetter,
} from "@/Provider/bridgeUITypes";

/**
 * Builds the context for one `BridgeUIProvider`, layered over `parent`.
 * Patches are `$state.raw`: merged configs hold adapters and class instances
 * that must not be wrapped in deep proxies.
 */
export function createBridgeUIApi(
  parent: undefined | BridgeUIContextApi,
  options: BridgeUIOptionsGetter,
): BridgeUIContextApi {
  let globalPatch = $state.raw<Partial<BridgeUIGlobal>>({});

  let componentsPatch = $state.raw<BridgeUIComponentsConfig>({});

  const nativeDates = createNativeDateAdapter();

  const baseGlobal = $derived(
    mergeBridgeUIGlobal({
      partials: [options().global],
      base: parent ? parent.global : BRIDGE_UI_DEFAULT_GLOBAL,
    }),
  );

  const global = $derived(
    mergeBridgeUIGlobal({
      base: baseGlobal,
      partials: [globalPatch],
    }),
  );

  const baseComponents = $derived(
    mergeBridgeUIComponents({
      partials: [options().components],
      base: parent ? parent.components : {},
    }),
  );

  const components = $derived(
    mergeBridgeUIComponents({
      base: baseComponents,
      partials: [componentsPatch],
    }),
  );

  function setGlobal(patch: Partial<BridgeUIGlobal>) {
    const { icons, ...rest } = patch;
    const next = toMerged(globalPatch, rest) as Partial<BridgeUIGlobal>;

    if (icons !== undefined) {
      next.icons = icons;
    }

    globalPatch = next;
  }

  function setTheme(theme: string) {
    setGlobal({ theme });
  }

  function setLocale(locale: string) {
    setGlobal({ locale });
    global.i18n?.setLocale?.(locale);
    (global.dates ?? nativeDates).setLocale?.(locale);
  }

  function setTimeZone(timeZone: string) {
    setGlobal({ timeZone });
    (global.dates ?? nativeDates).setTimeZone?.(timeZone);
  }

  function setDirection(direction: Direction) {
    setGlobal({ direction });
  }

  function setComponents(patch: BridgeUIComponentsConfig) {
    componentsPatch = mergeBridgeUIComponents({
      partials: [patch],
      base: componentsPatch,
    });
  }

  return {
    get global() {
      return global;
    },
    get components() {
      return components;
    },
    setTheme,
    setGlobal,
    setLocale,
    nativeDates,
    setTimeZone,
    setDirection,
    setComponents,
  };
}
