<script lang="ts">
  // ** External Imports
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  const {
    method,
    children,
    ...rest
  }: HTMLAnchorAttributes & { children?: Snippet; method?: string } = $props();
</script>

<a data-method={method} {...rest}>{@render children?.()}</a>
