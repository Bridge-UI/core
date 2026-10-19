<script lang="ts">
  // ** External Imports
  import type { Snippet } from "svelte";

  // ** Core Imports
  import type {
    BridgeUIComponentsConfig,
    BridgeUIGlobal,
  } from "@bridge-ui/core/Config";

  // ** Local Imports
  import { setBridgeUIContext, useBridgeUI } from "@/Provider/context";
  import { createBridgeUIApi } from "@/Provider/createBridgeUIApi.svelte";

  let {
    global,
    children,
    components,
  }: {
    children?: Snippet;
    components?: BridgeUIComponentsConfig;
    global?: Partial<BridgeUIGlobal>;
  } = $props();

  const api = createBridgeUIApi(useBridgeUI() ?? undefined, () => {
    return {
      global: global ?? {},
      components: components ?? {},
    };
  });

  setBridgeUIContext(api);
</script>

{@render children?.()}
