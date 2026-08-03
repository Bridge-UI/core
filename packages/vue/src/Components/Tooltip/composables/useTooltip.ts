// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  useAttrs,
  useId,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from "vue";

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
  mergePartBind,
  resolveVnodeRefElement,
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
   * Whether the tooltip is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;
};

export function useTooltip(
  props: TooltipOwnProps,
  libDefaults: TooltipLibDefaults,
  options: TooltipOptions = {},
) {
  const attrs = useAttrs();

  const tooltipId = useId();

  const mounted = ref(false);

  const layerStackId = ref("");

  const arrowRef = ref<null | HTMLElement>(null);

  const contentRef = ref<null | HTMLElement>(null);

  const triggerRef = ref<null | HTMLElement>(null);

  let stackOrder: null | number = null;

  let allowReferenceHiddenClose = false;
  let stackHandle: null | LayerStackHandle = null;
  let positionHandle: null | PositionHandle = null;
  let openTimer: null | ReturnType<typeof setTimeout> = null;
  let closeTimer: null | ReturnType<typeof setTimeout> = null;

  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  const show = computed(() => {
    return toValue(options.show ?? false);
  });

  function setShow(next: boolean) {
    if (options.show) {
      options.show.value = next;
    }

    options.onShowChange?.(next);
  }

  const split = computed(() => {
    return splitComponentProps<TooltipProps, typeof tooltipBridgeKeys>({
      bridgeKeys: tooltipBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeTooltip } = useBridgeUIComponent<
    TooltipMerged,
    "Tooltip"
  >({
    libDefaults,
    componentName: "Tooltip",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTooltip,
    props: () => split.value.componentProps,
  });

  const isPortaled = computed(() => {
    return merged.value.teleportTo !== false;
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTooltip.value?.tokens?.color,
    );

    return get(classes, merged.value.color);
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTooltip.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTooltip.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["anchorEl", "onShowChange"]);
  });

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

  function getReferenceElement(): null | HTMLElement {
    return props.anchorEl ?? triggerRef.value;
  }

  function requestOpen() {
    if (merged.value.disabled) {
      return;
    }

    clearTimers();

    const delay = merged.value.openDelay;

    if (delay <= 0) {
      setShow(true);

      return;
    }

    openTimer = setTimeout(() => {
      openTimer = null;
      setShow(true);
    }, delay);
  }

  function requestClose() {
    clearTimers();

    const delay = merged.value.closeDelay;

    if (delay <= 0) {
      setShow(false);

      return;
    }

    closeTimer = setTimeout(() => {
      closeTimer = null;
      setShow(false);
    }, delay);
  }

  function handlePointerEnter() {
    requestOpen();
  }

  function handlePointerLeave() {
    requestClose();
  }

  function handleFocus() {
    requestOpen();
  }

  function handleBlur() {
    requestClose();
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape" || !show.value) {
      return;
    }

    event.preventDefault();
    clearTimers();
    setShow(false);
  }

  function destroyPositionable() {
    allowReferenceHiddenClose = false;
    positionHandle?.destroy();
    positionHandle = null;
  }

  function syncPositionable() {
    destroyPositionable();

    const reference = getReferenceElement();
    const floating = contentRef.value;

    if (!show.value || !reference || !floating) {
      return;
    }

    positionHandle = createPositionable({
      floating,
      reference,
      offset: merged.value.offset,
      strategy: merged.value.strategy,
      placement: merged.value.placement,
      arrow: merged.value.arrow ? (arrowRef.value ?? undefined) : undefined,
      onReferenceHidden: () => {
        if (!allowReferenceHiddenClose || !show.value) {
          return;
        }

        clearTimers();
        setShow(false);
      },
    });

    positionHandle.start();

    void nextTick(() => {
      allowReferenceHiddenClose = true;
    });
  }

  function releaseStack() {
    stackHandle?.release();
    stackHandle = null;
    layerStackId.value = "";
    stackZIndex.value = LAYER_STACK_BASE_Z_INDEX;
  }

  function syncLayerStack() {
    releaseStack();

    if (!show.value) {
      stackOrder = null;

      return;
    }

    if (stackOrder === null) {
      stackOrder = acquireLayerStackOrder();
    }

    function handleEscape() {
      if (!show.value) {
        return;
      }

      clearTimers();
      setShow(false);
    }

    stackHandle = pushLayerStack({
      order: stackOrder,
      lockScroll: false,
      onEscape: handleEscape,
    });

    layerStackId.value = stackHandle.id;
    stackZIndex.value = stackHandle.zIndex;
  }

  function setTriggerRef(element: null | Element | ComponentPublicInstance) {
    triggerRef.value = resolveVnodeRefElement(element);
  }

  function setContentRef(element: null | Element | ComponentPublicInstance) {
    contentRef.value = resolveVnodeRefElement(element);
  }

  function setArrowRef(element: null | Element | ComponentPublicInstance) {
    arrowRef.value = resolveVnodeRefElement(element);
  }

  watch(
    show,
    (visible) => {
      if (visible) {
        mounted.value = true;

        return;
      }

      mounted.value = false;
    },
    { immediate: true },
  );

  watch(
    [
      show,
      mounted,
      () => props.anchorEl,
      () => merged.value.arrow,
      () => merged.value.offset,
      () => merged.value.strategy,
      () => merged.value.placement,
    ],
    async () => {
      if (!show.value || !mounted.value) {
        destroyPositionable();

        return;
      }

      await nextTick();
      syncPositionable();
    },
    { flush: "post" },
  );

  watch(
    show,
    () => {
      syncLayerStack();
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clearTimers();
    destroyPositionable();
    releaseStack();
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "relative inline-flex": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const triggerBind = computed(() => {
    return mergePartBind(
      customProps.value?.trigger,
      {},
      {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeydown: handleTriggerKeyDown,
        onPointerenter: handlePointerEnter,
        onPointerleave: handlePointerLeave,
        "aria-describedby": show.value ? tooltipId : undefined,
        class: cn({
          "inline-flex w-fit max-w-full outline-hidden": true,
          [get(mergedClasses.value, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      customProps.value?.content,
      {},
      {
        id: tooltipId,
        role: "tooltip",
        style: {
          zIndex: stackZIndex.value,
        },
        class: cn({
          "pointer-events-none absolute w-max max-w-xs font-medium shadow-md": true,
          [colorClasses.value?.content ?? ""]: true,
          [sizeClasses.value?.content ?? ""]: true,
          [roundedClass.value ?? ""]: true,
          [get(mergedClasses.value, "content") ?? ""]: true,
        }),
      },
    );
  });

  const arrowBind = computed(() => {
    if (!merged.value.arrow) {
      return null;
    }

    return mergePartBind(
      customProps.value?.arrow,
      {},
      {
        "aria-hidden": true,
        class: cn({
          "pointer-events-none absolute size-2 rotate-45": true,
          [colorClasses.value?.arrow ?? ""]: true,
          [get(mergedClasses.value, "arrow") ?? ""]: true,
        }),
      },
    );
  });

  return {
    show,
    merged,
    mounted,
    rootBind,
    tooltipId,
    arrowBind,
    isPortaled,
    triggerBind,
    contentBind,
    setArrowRef,
    setTriggerRef,
    setContentRef,
  };
}
