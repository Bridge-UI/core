<script lang="ts">
  // ** Local Imports
  import type { BaseFieldSnippets } from "@/Components/BaseField/baseField.types";
  import type { UseBaseFieldReturn } from "@/Components/BaseField/hooks/useBaseField.svelte";
  import { Label } from "@/Components/Label";
  import { isPropPresent, Renderable } from "@/Utils";

  const {
    end,
    field,
    start,
    children,
  }: BaseFieldSnippets & { field: UseBaseFieldReturn } = $props();

  const showLabel = $derived(isPropPresent(field.merged.label));

  const showCorner = $derived(isPropPresent(field.merged.corner));
</script>

<div
  {...field.rootBind}
  data-invalid={field.invalidated || undefined}
  aria-disabled={field.isDisabled || undefined}
  aria-readonly={field.isReadonly || undefined}
>
  {#if showLabel || showCorner}
    <div {...field.headerBind}>
      {#if showLabel}
        <Label {...field.fieldLabelProps}>
          <Renderable value={field.merged.label} />
        </Label>
      {/if}

      {#if showCorner}
        <Label {...field.fieldCornerProps}>
          <Renderable value={field.merged.corner} />
        </Label>
      {/if}
    </div>
  {/if}

  <div {...field.groupBind}>
    {#if start}
      <div {...field.startSlotBind}>{@render start()}</div>
    {/if}

    {@render children?.()}

    {#if end}
      <div {...field.endSlotBind}>{@render end()}</div>
    {/if}
  </div>

  {#if field.showDescriptionContent}
    <p {...field.descriptionBind} id={`${field.controlId}-description`}>
      <Renderable value={field.merged.description} />
    </p>
  {/if}

  {#if field.showErrorMessageRow}
    <p
      {...field.errorBind}
      id={`${field.controlId}-error`}
      aria-hidden={field.showErrorMessageContent ? undefined : true}
    >
      {#if field.showErrorMessageContent}
        <Renderable value={field.merged.errorMessage} />
      {/if}
    </p>
  {/if}
</div>
