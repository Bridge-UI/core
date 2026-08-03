// ** External Imports
import { toMerged } from "es-toolkit/object";
import { computed, shallowRef, type ComputedRef } from "vue";

// ** Core Imports
import {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  type BridgeUIComponentsConfig,
  type BridgeUIGlobal,
  type Direction,
} from "@bridge-ui/core";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";

export function createBridgeUIApi(
  parent: undefined | BridgeUIContextApi,
  optionsRef: ComputedRef<{
    components: BridgeUIComponentsConfig;
    global: Partial<BridgeUIGlobal>;
  }>,
): BridgeUIContextApi {
  const globalPatch = shallowRef<Partial<BridgeUIGlobal>>({});

  const componentsPatch = shallowRef<BridgeUIComponentsConfig>({});

  const baseGlobal = computed(() => {
    return mergeBridgeUIGlobal({
      partials: [optionsRef.value.global],
      base: parent ? parent.global.value : BRIDGE_UI_DEFAULT_GLOBAL,
    });
  });

  const global = computed(() => {
    return mergeBridgeUIGlobal({
      base: baseGlobal.value,
      partials: [globalPatch.value],
    });
  });

  const baseComponents = computed(() => {
    return mergeBridgeUIComponents({
      partials: [optionsRef.value.components],
      base: parent ? parent.components.value : {},
    });
  });

  const components = computed(() => {
    return mergeBridgeUIComponents({
      base: baseComponents.value,
      partials: [componentsPatch.value],
    });
  });

  function setGlobal(patch: Partial<BridgeUIGlobal>) {
    const { icons, ...rest } = patch;
    const next = toMerged(globalPatch.value, rest) as Partial<BridgeUIGlobal>;

    if (icons !== undefined) {
      next.icons = icons;
    }

    globalPatch.value = next;
  }

  function setTheme(theme: string) {
    setGlobal({ theme });
  }

  function setLocale(locale: string) {
    setGlobal({ locale });
    global.value.i18n?.setLocale?.(locale);
  }

  function setDirection(direction: Direction) {
    setGlobal({ direction });
  }

  function setComponents(patch: BridgeUIComponentsConfig) {
    componentsPatch.value = mergeBridgeUIComponents({
      partials: [patch],
      base: componentsPatch.value,
    });
  }

  return {
    global,
    setTheme,
    setGlobal,
    setLocale,
    components,
    setDirection,
    setComponents,
  };
}
