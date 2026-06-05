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
} from "@bridge-ui/core";

// ** Local Imports
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";

export function createBridgeUIApi(
  parent: BridgeUIContextApi | undefined,
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
    globalPatch.value = toMerged(globalPatch.value, patch);
  }

  function setComponents(patch: BridgeUIComponentsConfig) {
    componentsPatch.value = mergeBridgeUIComponents({
      base: componentsPatch.value,
      partials: [patch],
    });
  }

  return { global, components, setGlobal, setComponents };
}
