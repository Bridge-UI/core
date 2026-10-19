<script lang="ts">
  // ** Local Imports
  import { useLabel } from "@/Components/Label/hooks/useLabel.svelte";
  import type { LabelProps } from "@/Components/Label/label.types";

  const { children, ...props }: LabelProps = $props();

  const api = useLabel(() => props, { size: "md" });
</script>

<label {...api.rootBind}>
  {@render children?.()}

  {#if api.merged.required}
    <span {...api.requiredBind}>*</span>
  {/if}
</label>
