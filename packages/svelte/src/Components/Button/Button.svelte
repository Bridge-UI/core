<script lang="ts" generics="T extends LinkAsTag = 'button'">
  // ** Local Imports
  import type { ButtonProps } from "@/Components/Button/button.types";
  import { useButton } from "@/Components/Button/hooks/useButton.svelte";
  import { Icon } from "@/Components/Icon";
  import { isPropPresent } from "@/Utils";
  import type { LinkAsTag } from "@/Utils/linkAs";

  const props: ButtonProps<T> = $props();

  const api = useButton(() => props, {
    size: "md",
    as: "button",
    rounded: "md",
    color: "primary",
    variant: "solid",
    density: "default",
  });

  // The root tag is dynamic (`as` / `linkAs`), so its attributes are untyped.
  const rootAttrs: Record<string, unknown> = $derived({
    ...api.rootBind,
    href: api.rootHref,
    disabled: api.rootDisabled,
    "aria-busy": api.rootAriaBusy,
    "aria-disabled": api.rootAriaDisabled,
  });
</script>

{#snippet content()}
  {#if api.merged.loading}
    <span {...api.loadingWrapBind}>
      <Icon icon="loader" size={api.merged.size} {...api.loadingIconBind} />
    </span>
  {/if}

  <span {...api.contentBind}>
    {#if api.isMini}
      {#if props.children}
        {@render props.children()}
      {:else if api.merged.icon}
        <Icon icon={api.merged.icon} size={api.merged.size} {...api.iconBind} />
      {/if}
    {:else}
      {#if api.merged.startIcon}
        <Icon
          size={api.merged.size}
          icon={api.merged.startIcon}
          {...api.startIconBind}
        />
      {:else if props.start}
        <div {...api.startSlotBind}>{@render props.start()}</div>
      {/if}

      {#if isPropPresent(api.merged.text)}
        {api.merged.text}
      {:else}
        {@render props.children?.()}
      {/if}

      {#if api.merged.endIcon}
        <Icon
          size={api.merged.size}
          icon={api.merged.endIcon}
          {...api.endIconBind}
        />
      {:else if props.end}
        <div {...api.endSlotBind}>{@render props.end()}</div>
      {/if}
    {/if}
  </span>
{/snippet}

{#if typeof api.tag === "string"}
  <svelte:element this={api.tag as string} {...rootAttrs}>
    {@render content()}
  </svelte:element>
{:else}
  <api.tag {...rootAttrs}>
    {@render content()}
  </api.tag>
{/if}
