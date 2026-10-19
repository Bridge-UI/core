<script lang="ts">
  // ** External Imports
  import type { Snippet } from "svelte";

  const { value }: { value: undefined | string | Snippet } = $props();
</script>

{#if typeof value === "function"}
  {@render value()}
{:else if value}
  {value}
{/if}
