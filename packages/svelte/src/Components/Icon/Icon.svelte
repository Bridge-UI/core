<script lang="ts">
  // ** Local Imports
  import { useIcon } from "@/Components/Icon/hooks/useIcon.svelte";
  import type { IconProps } from "@/Components/Icon/icon.types";

  const props: IconProps = $props();

  const api = useIcon(() => props, { size: "md" });
</script>

{#if api.resolvedIcon}
  <api.resolvedIcon {...api.rootBind} />
{/if}
