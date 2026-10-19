// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { onDestroy, tick } from "svelte";
import type { Attachment } from "svelte/attachments";

// ** Core Imports
import {
  acquireLayerStackOrder,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  type LayerStackHandle,
} from "@bridge-ui/core/Layer";
import {
  createPositionable,
  type PositionHandle,
} from "@bridge-ui/core/Runtime";
import {
  tooltipColorProps as colorProps,
  tooltipRoundedProps as roundedProps,
  tooltipSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TooltipClasses,
  TooltipOwnProps,
  TooltipProps,
  TooltipSnippets,
} from "@/Components/Tooltip/tooltip.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tooltipBridgeKeys = [
  "size",
  "arrow",
  "color",
  "offset",
  "classes",
  "content",
  "rounded",
  "disabled",
  "strategy",
  "openDelay",
  "placement",
  "closeDelay",
  "teleportTo",
  "customProps",
] as const satisfies readonly (keyof TooltipOwnProps)[];

const tooltipSnippetKeys = [
  "trigger",
  "children",
] as const satisfies readonly (keyof TooltipSnippets)[];

type TooltipLibDefaults = LibDefaultsShape<
  TooltipOwnProps,
  | "size"
  | "arrow"
  | "color"
  | "offset"
  | "rounded"
  | "strategy"
  | "openDelay"
  | "placement"
  | "closeDelay"
  | "teleportTo"
>;

type TooltipMerged = MergeLibDefaults<TooltipOwnProps, TooltipLibDefaults>;

export type TooltipOptions = {
  /**
   * Content id, from `$props.id()` in the owning component.
   */
  id: string;

  /**
   * Writes `show` (the bindable prop) and notifies `onShowChange`.
   */
  setShow: (show: boolean) => void;

  /**
   * Reads `show` (the bindable prop).
   */
  show: () => boolean;
};

export function useTooltip(
  props: () => TooltipProps,
  libDefaults: TooltipLibDefaults,
  options: TooltipOptions,
) {
  let arrowEl = $state<null | HTMLElement>(null);

  let contentEl = $state<null | HTMLElement>(null);

  let triggerEl = $state<null | HTMLElement>(null);

  let stackZIndex = $state(LAYER_STACK_BASE_Z_INDEX);

  let stackOrder: null | number = null;
  let allowReferenceHiddenClose = false;
  let stackHandle: null | LayerStackHandle = null;
  let positionHandle: null | PositionHandle = null;
  let openTimer: null | ReturnType<typeof setTimeout> = null;
  let closeTimer: null | ReturnType<typeof setTimeout> = null;

  const show = $derived(options.show());

  const split = $derived(
    splitComponentProps<TooltipProps, typeof tooltipBridgeKeys>({
      props: { ...props() },
      bridgeKeys: tooltipBridgeKeys,
    }),
  );

  const anchorEl = $derived(props().anchorEl ?? null);

  const bridgeTooltip = useBridgeUIComponent<TooltipMerged, "Tooltip">({
    libDefaults,
    componentName: "Tooltip",
    props: () => split.componentProps,
  });

  const customProps = $derived(bridgeTooltip.merged.customProps);

  const mergedClasses = useBridgeUIMergedRegistryClasses<TooltipClasses>(() => {
    return {
      entry: bridgeTooltip.entry,
      props: split.componentProps,
    };
  });

  const colorClasses = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTooltip.entry?.tokens?.color,
    );

    return get(classes, bridgeTooltip.merged.color);
  });

  const sizeClasses = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTooltip.entry?.tokens?.size,
    );

    return get(classes, bridgeTooltip.merged.size);
  });

  const roundedClass = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTooltip.entry?.tokens?.rounded,
    );

    return get(classes, bridgeTooltip.merged.rounded);
  });

  const rootInheritedAttrs = $derived(
    omit(split.inheritedAttrs, [
      "show",
      "anchorEl",
      "onShowChange",
      ...tooltipSnippetKeys,
    ]),
  );

  function clearTimers() {
    if (openTimer !== null) {
      clearTimeout(openTimer);
      openTimer = null;
    }

    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function requestOpen() {
    if (bridgeTooltip.merged.disabled) {
      return;
    }

    clearTimers();

    const delay = bridgeTooltip.merged.openDelay;

    if (delay <= 0) {
      options.setShow(true);

      return;
    }

    openTimer = setTimeout(() => {
      openTimer = null;
      options.setShow(true);
    }, delay);
  }

  function requestClose() {
    clearTimers();

    const delay = bridgeTooltip.merged.closeDelay;

    if (delay <= 0) {
      options.setShow(false);

      return;
    }

    closeTimer = setTimeout(() => {
      closeTimer = null;
      options.setShow(false);
    }, delay);
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape" || !show) {
      return;
    }

    event.preventDefault();
    clearTimers();
    options.setShow(false);
  }

  function destroyPositionable() {
    allowReferenceHiddenClose = false;
    positionHandle?.destroy();
    positionHandle = null;
  }

  function syncPositionable(reference: HTMLElement, floating: HTMLElement) {
    destroyPositionable();

    positionHandle = createPositionable({
      floating,
      reference,
      shiftCrossAxis: false,
      offset: bridgeTooltip.merged.offset,
      strategy: bridgeTooltip.merged.strategy,
      placement: bridgeTooltip.merged.placement,
      arrow: bridgeTooltip.merged.arrow ? () => arrowEl : undefined,
      onReferenceHidden: () => {
        if (!allowReferenceHiddenClose || !options.show()) {
          return;
        }

        clearTimers();
        options.setShow(false);
      },
    });

    positionHandle.start();

    void tick().then(() => {
      allowReferenceHiddenClose = true;
    });
  }

  function releaseStack() {
    stackHandle?.release();
    stackHandle = null;
    stackZIndex = LAYER_STACK_BASE_Z_INDEX;
  }

  // Position while visible; re-run when the anchor, panel, or placement changes.
  $effect(() => {
    const reference = anchorEl ?? triggerEl;
    const floating = contentEl;

    void [
      bridgeTooltip.merged.arrow,
      bridgeTooltip.merged.offset,
      bridgeTooltip.merged.strategy,
      bridgeTooltip.merged.placement,
    ];

    if (!show || !reference || !floating) {
      destroyPositionable();

      return;
    }

    syncPositionable(reference, floating);

    return destroyPositionable;
  });

  // Join the layer stack (z-index + Escape) while visible.
  $effect(() => {
    if (!show) {
      stackOrder = null;
      releaseStack();

      return;
    }

    stackOrder ??= acquireLayerStackOrder();

    stackHandle = pushLayerStack({
      order: stackOrder,
      lockScroll: false,
      onEscape: () => {
        clearTimers();
        options.setShow(false);
      },
    });

    stackZIndex = stackHandle.zIndex;

    return releaseStack;
  });

  onDestroy(() => {
    clearTimers();
    destroyPositionable();
    releaseStack();
  });

  const attachTrigger: Attachment<HTMLElement> = (element) => {
    triggerEl = element;

    return () => {
      triggerEl = null;
    };
  };

  const attachContent: Attachment<HTMLElement> = (element) => {
    contentEl = element;

    return () => {
      contentEl = null;
    };
  };

  const attachArrow: Attachment<HTMLElement> = (element) => {
    arrowEl = element;

    return () => {
      arrowEl = null;
    };
  };

  const rootBind = $derived(
    mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "relative inline-flex": true,
        [mergedClasses().root ?? ""]: true,
      }),
    ),
  );

  const triggerBind = $derived(
    mergePartBind(
      customProps?.trigger,
      {},
      {
        onblur: requestClose,
        onfocus: requestOpen,
        onkeydown: handleTriggerKeyDown,
        onpointerenter: requestOpen,
        onpointerleave: requestClose,
        "aria-describedby": show ? options.id : undefined,
        class: cn({
          "inline-flex w-fit max-w-full outline-hidden": true,
          [mergedClasses().trigger ?? ""]: true,
        }),
      },
    ),
  );

  const contentBind = $derived(
    mergePartBind(
      customProps?.content,
      {},
      {
        id: options.id,
        role: "tooltip",
        style: `z-index: ${stackZIndex}`,
        class: cn({
          "pointer-events-none absolute w-max max-w-xs font-medium shadow-md": true,
          [colorClasses?.content ?? ""]: true,
          [sizeClasses?.content ?? ""]: true,
          [roundedClass ?? ""]: true,
          [mergedClasses().content ?? ""]: true,
        }),
      },
    ),
  );

  const arrowBind = $derived.by(() => {
    if (!bridgeTooltip.merged.arrow) {
      return null;
    }

    return mergePartBind(
      customProps?.arrow,
      {},
      {
        "aria-hidden": true,
        class: cn({
          "pointer-events-none absolute size-2 rotate-45": true,
          [colorClasses?.arrow ?? ""]: true,
          [mergedClasses().arrow ?? ""]: true,
        }),
      },
    );
  });

  return {
    attachArrow,
    attachContent,
    attachTrigger,
    get show() {
      return show;
    },
    get merged() {
      return bridgeTooltip.merged;
    },
    get rootBind() {
      return rootBind;
    },
    get arrowBind() {
      return arrowBind;
    },
    get triggerBind() {
      return triggerBind;
    },
    get contentBind() {
      return contentBind;
    },
  };
}
