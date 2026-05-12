// ** External Imports
import type { App, Plugin } from "vue";
import { computed } from "vue";

// ** Local Imports
import type { BridgeUIOptions } from "@/Config";
import { createBridgeUIApi } from "@/Provider/createBridgeUIApi";
import { BRIDGE_UI_INJECTION_KEY } from "@/Provider/injectionKey";

export function createBridgeUI(options: BridgeUIOptions = {}): Plugin {
  const plugin: Plugin = {
    install(app: App) {
      const optionsRef = computed(() => ({
        global: options.global ?? {},
        components: options.components ?? {},
      }));

      const api = createBridgeUIApi(undefined, optionsRef);

      app.provide(BRIDGE_UI_INJECTION_KEY, api);
    },
  };

  return plugin;
}
