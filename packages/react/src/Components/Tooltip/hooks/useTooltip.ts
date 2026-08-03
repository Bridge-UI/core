// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

// ** Core Imports
import {
  acquireLayerStackOrder,
  cn,
  createPositionable,
  LAYER_STACK_BASE_Z_INDEX,
  mergeBridgeUILayeredClasses,
  pushLayerStack,
  splitComponentProps,
  type LayerStackHandle,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type PositionHandle,
} from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Tokens/Tooltip";

// ** Local Imports
import type {
  TooltipOwnProps,
  TooltipProps,
} from "@/Components/Tooltip/tooltip.types";
import {
  derived,
  hasNamedSlot,
  isPropPresent,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tooltipBridgeKeys = [
  "size",
  "arrow",
  "color",
  "slots",
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
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the tooltip is visible. Omit for uncontrolled hover/focus behavior.
   *
   * @default undefined
   */
  show?: boolean;
};

export function useTooltip(
  props: TooltipProps,
  libDefaults: TooltipLibDefaults,
  options: TooltipOptions = {},
) {
  const { onShowChange, show: showProp } = options;

  const tooltipId = useId();

  const layerStackIdRef = useRef("");

  const isControlled = showProp !== undefined;

  const arrowRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<HTMLDivElement>(null);

  const stackOrderRef = useRef<null | number>(null);

  const allowReferenceHiddenCloseRef = useRef(false);

  const stackHandleRef = useRef<null | LayerStackHandle>(null);

  const positionHandleRef = useRef<null | PositionHandle>(null);

  const [uncontrolledShow, setUncontrolledShow] = useState(false);

  const show = isControlled ? Boolean(showProp) : uncontrolledShow;

  const [mounted, setMounted] = useState(show);

  const openTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const closeTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TooltipProps,
    typeof tooltipBridgeKeys
  >({
    props,
    bridgeKeys: tooltipBridgeKeys,
  });

  const { merged, entry: bridgeTooltip } = useBridgeUIComponent<
    TooltipMerged,
    "Tooltip"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Tooltip",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const hasTrigger = derived(() => {
    return hasNamedSlot(props.slots, "trigger");
  });

  const panelBody = derived(() => {
    if (isPropPresent(props.children)) {
      return props.children;
    }

    return isPropPresent(merged.content) ? merged.content : null;
  });

  const anchorEl = derived(() => {
    return props.anchorEl ?? null;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "show",
      "anchorEl",
      "children",
      "onShowChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTooltip,
    props: componentProps,
  });

  const isPortaled = derived(() => {
    return merged.teleportTo !== false;
  });

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && !mounted && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTooltip?.tokens?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeTooltip?.tokens?.color]);

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTooltip?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeTooltip?.tokens?.size]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTooltip?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeTooltip?.tokens?.rounded]);

  function clearTimers() {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function setShow(next: boolean) {
    if (!isControlled) {
      setUncontrolledShow(next);
    }

    onShowChange?.(next);
  }

  function getReferenceElement(): null | HTMLElement {
    if (anchorEl instanceof HTMLElement) {
      return anchorEl;
    }

    if (anchorEl && "current" in anchorEl) {
      return anchorEl.current;
    }

    return triggerRef.current;
  }

  function requestOpen() {
    if (merged.disabled) {
      return;
    }

    clearTimers();

    const delay = merged.openDelay;

    if (delay <= 0) {
      setShow(true);

      return;
    }

    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      setShow(true);
    }, delay);
  }

  function requestClose() {
    clearTimers();

    const delay = merged.closeDelay;

    if (delay <= 0) {
      setShow(false);

      return;
    }

    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setShow(false);
    }, delay);
  }

  function handlePointerEnter(_event: PointerEvent<HTMLDivElement>) {
    requestOpen();
  }

  function handlePointerLeave(_event: PointerEvent<HTMLDivElement>) {
    requestClose();
  }

  function handleFocus(_event: FocusEvent<HTMLDivElement>) {
    requestOpen();
  }

  function handleBlur(_event: FocusEvent<HTMLDivElement>) {
    requestClose();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !show) {
      return;
    }

    event.preventDefault();
    clearTimers();
    setShow(false);
  }

  function destroyPositionable() {
    allowReferenceHiddenCloseRef.current = false;
    positionHandleRef.current?.destroy();
    positionHandleRef.current = null;
  }

  function syncPositionable() {
    destroyPositionable();

    const reference = getReferenceElement();
    const floating = contentRef.current;

    if (!show || !reference || !floating) {
      return;
    }

    const handle = createPositionable({
      floating,
      reference,
      offset: merged.offset,
      shiftCrossAxis: false,
      strategy: merged.strategy,
      placement: merged.placement,
      arrow: merged.arrow ? () => arrowRef.current : undefined,
      onReferenceHidden: () => {
        if (!allowReferenceHiddenCloseRef.current || !show) {
          return;
        }

        clearTimers();
        setShow(false);
      },
    });

    positionHandleRef.current = handle;
    handle.start();

    queueMicrotask(() => {
      allowReferenceHiddenCloseRef.current = true;
    });
  }

  useLayoutEffect(() => {
    if (show) {
      setMounted(true);

      return;
    }

    setMounted(false);
  }, [show]);

  useLayoutEffect(() => {
    if (!show || !mounted) {
      destroyPositionable();

      return;
    }

    syncPositionable();

    return () => {
      destroyPositionable();
    };
  }, [
    show,
    mounted,
    anchorEl,
    merged.arrow,
    merged.offset,
    merged.strategy,
    merged.placement,
  ]);

  useLayoutEffect(() => {
    if (!show || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(LAYER_STACK_BASE_Z_INDEX);

      return;
    }

    function handleEscape() {
      if (!show) {
        return;
      }

      clearTimers();
      setShow(false);
    }

    const handle = pushLayerStack({
      lockScroll: false,
      onEscape: handleEscape,
      order: stackOrderRef.current,
    });

    stackHandleRef.current = handle;
    layerStackIdRef.current = handle.id;
    setStackZIndex((previous) => {
      return previous === handle.zIndex ? previous : handle.zIndex;
    });

    return () => {
      handle.release();
      stackHandleRef.current = null;
      layerStackIdRef.current = "";
    };
  }, [show]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "relative inline-flex": hasTrigger,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  const triggerBind = derived(() => {
    return mergePartBind(
      customProps?.trigger,
      { ref: triggerRef },
      {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleTriggerKeyDown,
        onPointerEnter: handlePointerEnter,
        onPointerLeave: handlePointerLeave,
        "aria-describedby": show ? tooltipId : undefined,
        className: cn({
          "inline-flex w-fit max-w-full outline-hidden": true,
          [get(mergedClasses, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      { ref: contentRef },
      {
        id: tooltipId,
        role: "tooltip",
        style: {
          zIndex: stackZIndex,
        },
        className: cn({
          "pointer-events-none absolute w-max max-w-xs font-medium shadow-md": true,
          [colorClasses?.content ?? ""]: true,
          [sizeClasses?.content ?? ""]: true,
          [roundedClass ?? ""]: true,
          [get(mergedClasses, "content") ?? ""]: true,
        }),
      },
    );
  });

  const arrowBind = derived(() => {
    if (!merged.arrow) {
      return null;
    }

    return mergePartBind(
      customProps?.arrow,
      { ref: arrowRef },
      {
        "aria-hidden": true,
        className: cn({
          "pointer-events-none absolute size-2 rotate-45": true,
          [colorClasses?.arrow ?? ""]: true,
          [get(mergedClasses, "arrow") ?? ""]: true,
        }),
      },
    );
  });

  return {
    show,
    slots,
    merged,
    mounted,
    rootBind,
    panelBody,
    tooltipId,
    arrowBind,
    hasTrigger,
    isPortaled,
    triggerBind,
    contentBind,
  };
}
