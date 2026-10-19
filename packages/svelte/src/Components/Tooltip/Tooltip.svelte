<script lang="ts">
  // ** Local Imports
  import { useTooltip } from "@/Components/Tooltip/hooks/useTooltip.svelte";
  import type { TooltipProps } from "@/Components/Tooltip/tooltip.types";
  import { isPropPresent, portal } from "@/Utils";

  let {
    show = $bindable(false),
    trigger,
    children,
    onShowChange,
    ...props
  }: TooltipProps = $props();

  const id = $props.id();

  const api = useTooltip(
    () => props,
    {
      offset: 8,
      size: "md",
      arrow: true,
      color: "dark",
      rounded: "md",
      closeDelay: 0,
      openDelay: 200,
      placement: "top",
      strategy: "fixed",
      teleportTo: "body",
    },
    {
      id,
      show: () => show,
      setShow: (next) => {
        show = next;
        onShowChange?.(next);
      },
    },
  );
</script>

{#if trigger}
  <div {...api.rootBind}>
    <div {...api.triggerBind} {@attach api.attachTrigger}>
      {@render trigger()}
    </div>
  </div>
{/if}

{#if api.show}
  <div
    {...api.contentBind}
    {@attach portal(api.merged.teleportTo)}
    {@attach api.attachContent}
  >
    {#if children}
      {@render children()}
    {:else if isPropPresent(api.merged.content)}
      {api.merged.content}
    {/if}

    {#if api.arrowBind}
      <div {...api.arrowBind} {@attach api.attachArrow}></div>
    {/if}
  </div>
{/if}
