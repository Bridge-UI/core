<script lang="ts">
  const {
    hook,
    setup,
    onResult,
    ...props
  }: {
    [key: string]: unknown;
    hook: (props: () => Record<string, unknown>) => unknown;
    onResult: (result: unknown) => void;
    setup?: () => void;
  } = $props();

  // The hook runs once, like a component init; later prop changes flow
  // through the `props` getter. `setup` registers contexts first.
  // svelte-ignore state_referenced_locally
  setup?.();
  // svelte-ignore state_referenced_locally
  onResult(hook(() => props));
</script>
