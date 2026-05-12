// ** External Imports
import { toMerged } from "es-toolkit/object";
import { computed, shallowRef, type ComputedRef } from "vue";

// ** Local Imports
import {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  type BridgeUIComponentsConfig,
  type BridgeUIGlobal,
} from "@/Config";
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";

export function createBridgeUIApi(
  parent: BridgeUIContextApi | undefined,
  optionsRef: ComputedRef<{
    global: Partial<BridgeUIGlobal>;
    components: BridgeUIComponentsConfig;
  }>,
): BridgeUIContextApi {
  const globalPatch = shallowRef<Partial<BridgeUIGlobal>>({});

  const componentsPatch = shallowRef<BridgeUIComponentsConfig>({});

  const baseGlobal = computed(() => {
    return mergeBridgeUIGlobal(
      parent ? parent.global.value : BRIDGE_UI_DEFAULT_GLOBAL,
      optionsRef.value.global,
    );
  });

  const global = computed(() => {
    return mergeBridgeUIGlobal(baseGlobal.value, globalPatch.value);
  });

  const baseComponents = computed(() => {
    return mergeBridgeUIComponents(
      parent ? parent.components.value : {},
      optionsRef.value.components,
    );
  });

  const components = computed(() => {
    return mergeBridgeUIComponents(baseComponents.value, componentsPatch.value);
  });

  function setGlobal(patch: Partial<BridgeUIGlobal>) {
    globalPatch.value = toMerged(globalPatch.value, patch);
  }

  function setComponents(patch: BridgeUIComponentsConfig) {
    componentsPatch.value = mergeBridgeUIComponents(
      componentsPatch.value,
      patch,
    );
  }

  return { global, components, setGlobal, setComponents };
}
