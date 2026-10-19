<script lang="ts">
  // ** External Imports
  import type { Snippet } from "svelte";

  // ** Local Imports
  import BaseField from "@/Components/BaseField/BaseField.svelte";
  import type { BaseFieldProps } from "@/Components/BaseField/baseField.types";
  import { useBaseField } from "@/Components/BaseField/hooks/useBaseField.svelte";

  const {
    end,
    start,
    children,
    ...props
  }: BaseFieldProps & { children?: Snippet } = $props();

  const id = $props.id();

  const field = useBaseField(
    () => props,
    { size: "md", error: false, hideErrorMessage: false },
    { autoId: id },
  );
</script>

<BaseField {field} {start} {end}>
  {@render children?.()}
</BaseField>
