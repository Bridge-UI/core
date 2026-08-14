// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  useAttrs,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from "vue";

// ** Core Imports
import {
  acquireLayerStackOrder,
  cn,
  countDrawerTransitionLayers,
  createFocusTrap,
  DRAWER_LEAVE_FALLBACK_MS,
  getDrawerOverlayTransitionClass,
  getDrawerPanelTransitionClass,
  getLayerStackEntry,
  hasDrawerTransition,
  LAYER_STACK_BASE_Z_INDEX,
  mergeBridgeUILayeredClasses,
  pushLayerStack,
  resolveEffectiveDrawerTransition,
  splitComponentProps,
  subscribeLayerStack,
  type DrawerTransition,
  type FocusTrap,
  type LayerStackHandle,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { isModalBackdropClick } from "@bridge-ui/core/Runtime";
import {
  blurProps,
  placementPanelProps,
  placementProps,
  sizeProps,
} from "@bridge-ui/core/Tokens/Drawer";

// ** Local Imports
import type {
  DrawerOwnProps,
  DrawerProps,
} from "@/Components/Drawer/drawer.types";
import {
  mergePartBind,
  resolveVnodeRefElement,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const drawerBridgeKeys = [
  "blur",
  "size",
  "scroll",
  "classes",
  "stackId",
  "ariaLabel",
  "autoFocus",
  "placement",
  "persistent",
  "teleportTo",
  "transition",
  "customProps",
  "keepMounted",
  "hideBackdrop",
  "closeOnEscape",
  "ariaLabelledBy",
  "closeOnOverlay",
  "disableScrollLock",
  "disableEnforceFocus",
  "disableRestoreFocus",
] as const satisfies readonly (keyof DrawerOwnProps)[];

type DrawerLibDefaults = LibDefaultsShape<
  DrawerOwnProps,
  | "blur"
  | "size"
  | "scroll"
  | "autoFocus"
  | "placement"
  | "teleportTo"
  | "transition"
  | "closeOnEscape"
  | "closeOnOverlay"
>;

type DrawerMerged = MergeLibDefaults<DrawerOwnProps, DrawerLibDefaults>;

export type DrawerOptions = {
  /**
   * Called when the drawer requests to close.
   * Sugar for `onShowChange(false)`.
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the drawer is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;

  /**
   * Pre-assigned stack id (BridgeDrawerHost). When omitted, the stack generates a UUID.
   */
  stackId?: string;
};

export function useDrawer(
  props: DrawerOwnProps,
  libDefaults: DrawerLibDefaults,
  options: DrawerOptions = {},
) {
  const attrs = useAttrs();

  const active = ref(false);

  const mounted = ref(false);

  const layerStackId = ref("");

  let leaveTransitionEndsPending = 0;

  let stackOrder: null | number = null;

  let focusTrap: null | FocusTrap = null;

  const panelRef = ref<null | HTMLElement>(null);

  let stackHandle: null | LayerStackHandle = null;

  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  let unsubscribeLayerStack: null | (() => void) = null;

  const transitionState = ref<"open" | "closed">("closed");

  let leaveFallbackTimeout: null | ReturnType<typeof setTimeout> = null;

  const show = computed(() => {
    return toValue(options.show ?? false);
  });

  function setShow(next: boolean) {
    if (!next) {
      options.onClose?.();
    }

    if (options.show) {
      options.show.value = next;
    }

    options.onShowChange?.(next);
  }

  const split = computed(() => {
    return splitComponentProps<DrawerProps, typeof drawerBridgeKeys>({
      bridgeKeys: drawerBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeDrawer } = useBridgeUIComponent<
    DrawerMerged,
    "Drawer"
  >({
    libDefaults,
    componentName: "Drawer",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeDrawer,
    props: () => split.value.componentProps,
  });

  const effectiveTransition = computed((): keyof DrawerTransition => {
    return resolveEffectiveDrawerTransition(merged.value.transition ?? "none");
  });

  const transitionEnabled = computed(() => {
    return hasDrawerTransition(effectiveTransition.value);
  });

  const scrollMode = computed(() => {
    return merged.value.scroll ?? "paper";
  });

  const isHiddenWhileMounted = computed(() => {
    return merged.value.keepMounted && !active.value;
  });

  const placement = computed(() => {
    return merged.value.placement ?? "left";
  });

  const sizeAxis = computed(() => {
    return placement.value === "left" || placement.value === "right"
      ? "horizontal"
      : "vertical";
  });

  const placementClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      placementProps,
      bridgeDrawer.value?.tokens?.placement,
    );

    return get(classes, placement.value);
  });

  const placementPanelClass = computed(() => {
    return get(placementPanelProps, placement.value);
  });

  const blurClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      blurProps,
      bridgeDrawer.value?.tokens?.blur,
    );

    return get(classes, merged.value.blur);
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeDrawer.value?.tokens?.size,
    );

    return get(classes, [merged.value.size, sizeAxis.value]);
  });

  const overlayTransitionClass = computed(() => {
    return getDrawerOverlayTransitionClass(effectiveTransition.value);
  });

  const panelTransitionClass = computed(() => {
    return getDrawerPanelTransitionClass(
      effectiveTransition.value,
      placement.value,
    );
  });

  const canClose = computed(() => {
    return !merged.value.persistent;
  });

  const rootInheritedAttrs = computed(() => {
    return split.value.inheritedAttrs;
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      onTransitionend: handleShellTransitionEnd,
      style: {
        zIndex: stackZIndex.value,
      },
      "aria-hidden": isHiddenWhileMounted.value ? true : undefined,
      class: cn({
        "fixed inset-0": true,
        "overflow-y-auto": scrollMode.value === "body",
        "overflow-hidden": scrollMode.value === "paper",
        "invisible pointer-events-none": isHiddenWhileMounted.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const overlayBind = computed(() => {
    return mergePartBind(
      customProps.value?.overlay,
      {
        onClick: handleOverlayClick,
      },
      {
        "data-drawer-part": "overlay",
        "data-state": transitionState.value,
        class: cn({
          "fixed inset-0 bg-black/50": true,
          [blurClass.value ?? ""]: true,
          [overlayTransitionClass.value]: transitionEnabled.value,
          [get(mergedClasses.value, "overlay") ?? ""]: true,
        }),
      },
    );
  });

  const wrapperBind = computed(() => {
    return mergePartBind(
      customProps.value?.wrapper,
      {
        onClick: handleWrapperClick,
      },
      cn({
        "flex min-h-full w-full transform": true,
        [placementClass.value ?? ""]: true,
        [get(mergedClasses.value, "wrapper") ?? ""]: true,
      }),
    );
  });

  const panelBind = computed(() => {
    return mergePartBind(
      customProps.value?.panel,
      {
        role: "dialog",
        "aria-modal": true,
        "aria-label": merged.value.ariaLabel,
        "aria-labelledby": merged.value.ariaLabelledBy,
      },
      {
        "data-drawer-part": "panel",
        "data-state": transitionState.value,
        class: cn({
          "relative rounded-none": true,
          [placementPanelClass.value ?? ""]: true,
          [sizeClass.value ?? ""]: true,
          "overflow-y-auto": scrollMode.value === "paper",
          [panelTransitionClass.value]: transitionEnabled.value,
          [get(mergedClasses.value, "panel") ?? ""]: true,
        }),
      },
    );
  });

  function releaseFocusTrap() {
    focusTrap?.release();
    focusTrap = null;
  }

  function syncFocusTrap() {
    if (!active.value || transitionState.value !== "open" || !panelRef.value) {
      releaseFocusTrap();

      return;
    }

    releaseFocusTrap();
    focusTrap = createFocusTrap({
      container: panelRef.value,
      disableAutoFocus: !merged.value.autoFocus,
      disableEnforceFocus: merged.value.disableEnforceFocus,
      disableRestoreFocus: merged.value.disableRestoreFocus,
    });
  }

  function setPanelRef(element: null | Element | ComponentPublicInstance) {
    panelRef.value = resolveVnodeRefElement(element);
    syncFocusTrap();
  }

  function clearLeaveFallback() {
    if (leaveFallbackTimeout !== null) {
      clearTimeout(leaveFallbackTimeout);
      leaveFallbackTimeout = null;
    }
  }

  function finishLeave() {
    clearLeaveFallback();
    leaveTransitionEndsPending = 0;
    active.value = false;
    releaseFocusTrap();

    if (show.value) {
      setShow(false);
    } else {
      options.onShowChange?.(false);
    }

    transitionState.value = "closed";

    if (!merged.value.keepMounted) {
      mounted.value = false;
    }
  }

  function startLeave() {
    stackHandle?.releaseScrollLock();

    if (!transitionEnabled.value) {
      finishLeave();

      return;
    }

    transitionState.value = "closed";
    leaveTransitionEndsPending = countDrawerTransitionLayers(
      effectiveTransition.value,
      { hideBackdrop: merged.value.hideBackdrop },
    );

    if (leaveTransitionEndsPending === 0) {
      finishLeave();

      return;
    }

    clearLeaveFallback();
    leaveFallbackTimeout = setTimeout(() => {
      leaveFallbackTimeout = null;

      if (leaveTransitionEndsPending > 0) {
        finishLeave();
      }
    }, DRAWER_LEAVE_FALLBACK_MS);
  }

  function scheduleOpen() {
    if (!transitionEnabled.value) {
      transitionState.value = "open";

      return;
    }

    transitionState.value = "closed";

    void nextTick(() => {
      requestAnimationFrame(() => {
        transitionState.value = "open";
      });
    });
  }

  function handleShellTransitionEnd(event: TransitionEvent) {
    if (!mounted.value || transitionState.value !== "closed") {
      return;
    }

    const target = event.target as null | HTMLElement;

    if (
      target?.dataset.drawerPart !== "overlay" &&
      target?.dataset.drawerPart !== "panel"
    ) {
      return;
    }

    if (event.propertyName === "none" || event.elapsedTime === 0) {
      return;
    }

    leaveTransitionEndsPending -= 1;

    if (leaveTransitionEndsPending <= 0) {
      finishLeave();
    }
  }

  function requestClose() {
    if (!canClose.value) {
      return;
    }

    if (!transitionEnabled.value) {
      setShow(false);

      return;
    }

    if (!mounted.value) {
      return;
    }

    startLeave();
  }

  function handleOverlayClick() {
    if (merged.value.closeOnOverlay === false || !canClose.value) {
      return;
    }

    requestClose();
  }

  function handleWrapperClick(event: MouseEvent) {
    if (!isModalBackdropClick(event)) {
      return;
    }

    handleOverlayClick();
  }

  function handleEscape() {
    if (
      !show.value ||
      merged.value.closeOnEscape === false ||
      !canClose.value
    ) {
      return;
    }

    requestClose();
  }

  watch(
    show,
    (isShown) => {
      if (isShown) {
        mounted.value = true;
        active.value = true;
        scheduleOpen();

        return;
      }

      if (!mounted.value) {
        return;
      }

      startLeave();
    },
    { immediate: true },
  );

  watch(
    [
      active,
      transitionState,
      () => merged.value.autoFocus,
      () => merged.value.disableEnforceFocus,
      () => merged.value.disableRestoreFocus,
    ],
    () => {
      void nextTick(() => {
        syncFocusTrap();
      });
    },
  );

  function syncZIndex() {
    const snapshot = getLayerStackEntry(layerStackId.value);

    if (snapshot) {
      stackZIndex.value = snapshot.zIndex;
    }
  }

  watch(
    active,
    (isActive) => {
      if (isActive) {
        if (stackOrder === null) {
          stackOrder = acquireLayerStackOrder();
        }

        stackHandle = pushLayerStack({
          order: stackOrder,
          id: options.stackId,
          onEscape: handleEscape,
          lockScroll: merged.value.disableScrollLock !== true,
        });

        layerStackId.value = stackHandle.id;
        stackZIndex.value = stackHandle.zIndex;
        syncZIndex();
        unsubscribeLayerStack = subscribeLayerStack(syncZIndex);

        return;
      }

      unsubscribeLayerStack?.();
      unsubscribeLayerStack = null;
      stackHandle?.release();
      stackHandle = null;
      layerStackId.value = "";
      stackZIndex.value = LAYER_STACK_BASE_Z_INDEX;

      if (!mounted.value) {
        stackOrder = null;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clearLeaveFallback();
    unsubscribeLayerStack?.();
    unsubscribeLayerStack = null;
    releaseFocusTrap();
    stackHandle?.release();
    stackHandle = null;
    stackOrder = null;
  });

  return {
    merged,
    mounted,
    rootBind,
    panelBind,
    overlayBind,
    wrapperBind,
    setPanelRef,
    layerStackId,
    handleOverlayClick,
    handleWrapperClick,
  };
}
