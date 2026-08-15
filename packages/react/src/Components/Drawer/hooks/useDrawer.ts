// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type TransitionEvent,
} from "react";

// ** Core Imports
import {
  acquireLayerStackOrder,
  countDrawerTransitionLayers,
  DRAWER_LEAVE_FALLBACK_MS,
  getDrawerOverlayTransitionClass,
  getDrawerPanelTransitionClass,
  getLayerStackEntry,
  hasDrawerTransition,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  resolveEffectiveDrawerTransition,
  subscribeLayerStack,
  type LayerStackHandle,
} from "@bridge-ui/core/Layer";
import {
  createFocusTrap,
  isModalBackdropClick,
  type FocusTrap,
} from "@bridge-ui/core/Runtime";
import {
  drawerBlurProps as blurProps,
  drawerPlacementPanelProps as placementPanelProps,
  drawerPlacementProps as placementProps,
  drawerSizeProps as sizeProps,
  type DrawerTransition,
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
  DrawerOwnProps,
  DrawerProps,
} from "@/Components/Drawer/drawer.types";
import {
  derived,
  mergePartBind,
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
   * Whether the drawer is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * Pre-assigned stack id (BridgeDrawerHost). When omitted, the stack generates a UUID.
   */
  stackId?: string;
};

export function useDrawer(
  props: DrawerProps,
  libDefaults: DrawerLibDefaults,
  options: DrawerOptions = {},
) {
  const { onClose, stackId, onShowChange, show = false } = options;

  const layerStackIdRef = useRef("");

  const [active, setActive] = useState(show);

  const [mounted, setMounted] = useState(show);

  const panelRef = useRef<HTMLDivElement>(null);

  const leaveTransitionEndsPendingRef = useRef(0);

  const pendingLeaveRef = useRef(false);

  const leaveFallbackTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(
    null,
  );

  const stackOrderRef = useRef<null | number>(null);

  const focusTrapRef = useRef<null | FocusTrap>(null);

  const stackHandleRef = useRef<null | LayerStackHandle>(null);

  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const [transitionState, setTransitionState] = useState<"open" | "closed">(
    "closed",
  );

  const { componentProps, inheritedAttrs } = splitComponentProps<
    DrawerProps,
    typeof drawerBridgeKeys
  >({
    props,
    bridgeKeys: drawerBridgeKeys,
  });

  const { merged, entry: bridgeDrawer } = useBridgeUIComponent<
    DrawerMerged,
    "Drawer"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Drawer",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "show",
      "onClose",
      "children",
      "onShowChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeDrawer,
    props: componentProps,
  });

  const effectiveTransition = useMemo((): keyof DrawerTransition => {
    return resolveEffectiveDrawerTransition(merged.transition ?? "none");
  }, [merged.transition]);

  const transitionEnabled = derived(() => {
    return hasDrawerTransition(effectiveTransition);
  });

  const scrollMode = derived(() => {
    return merged.scroll ?? "paper";
  });

  const isHiddenWhileMounted = derived(() => {
    return Boolean(merged.keepMounted && !active);
  });

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && !mounted && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const placementClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      placementProps,
      bridgeDrawer?.tokens?.placement,
    );

    return get(classes, merged.placement);
  }, [merged.placement, bridgeDrawer?.tokens?.placement]);

  const placementPanelClass = derived(() => {
    return get(placementPanelProps, merged.placement);
  });

  const blurClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      blurProps,
      bridgeDrawer?.tokens?.blur,
    );

    return get(classes, merged.blur);
  }, [merged.blur, bridgeDrawer?.tokens?.blur]);

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeDrawer?.tokens?.size,
    );

    const sizeItem = get(classes, merged.size);

    const axis =
      merged.placement === "left" || merged.placement === "right"
        ? "horizontal"
        : "vertical";

    return get(sizeItem, axis);
  }, [merged.size, merged.placement, bridgeDrawer?.tokens?.size]);

  const panelTransitionClass = derived(() => {
    return getDrawerPanelTransitionClass(effectiveTransition, merged.placement);
  });

  const overlayTransitionClass = derived(() => {
    return getDrawerOverlayTransitionClass(effectiveTransition);
  });

  function setShow(next: boolean) {
    if (!next) {
      onClose?.();
    }

    onShowChange?.(next);
  }

  function releaseFocusTrap() {
    focusTrapRef.current?.release();
    focusTrapRef.current = null;
  }

  function clearLeaveFallback() {
    if (leaveFallbackTimeoutRef.current !== null) {
      clearTimeout(leaveFallbackTimeoutRef.current);
      leaveFallbackTimeoutRef.current = null;
    }
  }

  function finishLeave() {
    if (!pendingLeaveRef.current) {
      return;
    }

    pendingLeaveRef.current = false;
    clearLeaveFallback();
    leaveTransitionEndsPendingRef.current = 0;
    setActive(false);
    releaseFocusTrap();
    setTransitionState("closed");

    if (show) {
      setShow(false);
    } else {
      onShowChange?.(false);
    }

    if (!merged.keepMounted) {
      setMounted(false);
    }
  }

  function startLeave() {
    stackHandleRef.current?.releaseScrollLock();
    pendingLeaveRef.current = true;

    if (!transitionEnabled) {
      finishLeave();

      return;
    }

    setTransitionState("closed");
    leaveTransitionEndsPendingRef.current = countDrawerTransitionLayers(
      effectiveTransition,
      { hideBackdrop: merged.hideBackdrop },
    );

    if (leaveTransitionEndsPendingRef.current === 0) {
      finishLeave();

      return;
    }

    clearLeaveFallback();
    leaveFallbackTimeoutRef.current = setTimeout(() => {
      leaveFallbackTimeoutRef.current = null;

      if (leaveTransitionEndsPendingRef.current > 0) {
        finishLeave();
      }
    }, DRAWER_LEAVE_FALLBACK_MS);
  }

  function scheduleOpen() {
    pendingLeaveRef.current = false;
    clearLeaveFallback();
    leaveTransitionEndsPendingRef.current = 0;

    if (!transitionEnabled) {
      setTransitionState("open");

      return;
    }

    setTransitionState("closed");

    requestAnimationFrame(() => {
      setTransitionState("open");
    });
  }

  function handleShellTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (!pendingLeaveRef.current || !mounted || transitionState !== "closed") {
      return;
    }

    const target = event.target as HTMLElement;

    if (
      target.dataset.drawerPart !== "panel" &&
      target.dataset.drawerPart !== "overlay"
    ) {
      return;
    }

    if (event.propertyName === "none" || event.elapsedTime === 0) {
      return;
    }

    leaveTransitionEndsPendingRef.current -= 1;

    if (leaveTransitionEndsPendingRef.current <= 0) {
      finishLeave();
    }
  }

  function requestClose() {
    if (merged.persistent) {
      return;
    }

    if (!transitionEnabled) {
      setShow(false);

      return;
    }

    if (!mounted) {
      return;
    }

    startLeave();
  }

  function handleOverlayClick() {
    if (merged.closeOnOverlay === false || merged.persistent) {
      return;
    }

    requestClose();
  }

  function handleWrapperClick(event: MouseEvent<HTMLDivElement>) {
    if (!isModalBackdropClick(event)) {
      return;
    }

    handleOverlayClick();
  }

  useLayoutEffect(() => {
    if (show) {
      setMounted(true);
      setActive(true);
      scheduleOpen();

      return;
    }

    if (!mounted) {
      return;
    }

    startLeave();
  }, [show]);

  useLayoutEffect(() => {
    if (!active || transitionState !== "open" || !panelRef.current) {
      releaseFocusTrap();

      return;
    }

    releaseFocusTrap();
    focusTrapRef.current = createFocusTrap({
      container: panelRef.current,
      disableAutoFocus: !merged.autoFocus,
      disableEnforceFocus: merged.disableEnforceFocus,
      disableRestoreFocus: merged.disableRestoreFocus,
    });

    return releaseFocusTrap;
  }, [
    active,
    transitionState,
    merged.autoFocus,
    merged.disableEnforceFocus,
    merged.disableRestoreFocus,
  ]);

  useLayoutEffect(() => {
    if (!active || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(LAYER_STACK_BASE_Z_INDEX);

      return;
    }

    function handleEscape() {
      if (!show || merged.closeOnEscape === false || merged.persistent) {
        return;
      }

      requestClose();
    }

    const handle = pushLayerStack({
      id: stackId,
      onEscape: handleEscape,
      order: stackOrderRef.current,
      lockScroll: merged.disableScrollLock !== true,
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
  }, [
    show,
    active,
    stackId,
    merged.persistent,
    merged.closeOnEscape,
    merged.disableScrollLock,
  ]);

  useEffect(() => {
    return () => {
      if (leaveFallbackTimeoutRef.current !== null) {
        clearTimeout(leaveFallbackTimeoutRef.current);
        leaveFallbackTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }

    function syncZIndex() {
      const snapshot = getLayerStackEntry(layerStackIdRef.current);

      if (!snapshot) {
        return;
      }

      setStackZIndex((previous) => {
        return previous === snapshot.zIndex ? previous : snapshot.zIndex;
      });
    }

    syncZIndex();

    return subscribeLayerStack(syncZIndex);
  }, [active]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      onTransitionEnd: handleShellTransitionEnd,
      style: {
        zIndex: stackZIndex,
      },
      "aria-hidden": isHiddenWhileMounted ? true : undefined,
      className: cn({
        "fixed inset-0": true,
        "overflow-y-auto": scrollMode === "body",
        "overflow-hidden": scrollMode === "paper",
        "invisible pointer-events-none": isHiddenWhileMounted,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const overlayBind = derived(() => {
    return mergePartBind(
      customProps?.overlay,
      {},
      {
        "data-drawer-part": "overlay",
        "data-state": transitionState,
        className: cn({
          "fixed inset-0 bg-black/50": true,
          [blurClass ?? ""]: true,
          [overlayTransitionClass]: transitionEnabled,
          [get(mergedClasses, "overlay") ?? ""]: true,
        }),
      },
    );
  });

  const wrapperBind = derived(() => {
    return mergePartBind(
      customProps?.wrapper,
      {},
      cn({
        "flex min-h-full w-full transform p-0": true,
        [placementClass ?? ""]: true,
        [get(mergedClasses, "wrapper") ?? ""]: true,
      }),
    );
  });

  const panelBind = derived(() => {
    return mergePartBind(
      customProps?.panel,
      {
        ref: panelRef,
        role: "dialog",
        "aria-modal": true,
        "aria-label": merged.ariaLabel,
        "aria-labelledby": merged.ariaLabelledBy,
      },
      {
        "data-drawer-part": "panel",
        "data-state": transitionState,
        className: cn({
          "relative rounded-none": true,
          [sizeClass ?? ""]: true,
          [placementPanelClass ?? ""]: true,
          "overflow-y-auto": scrollMode === "paper",
          [panelTransitionClass]: transitionEnabled,
          [get(mergedClasses, "panel") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    mounted,
    rootBind,
    panelBind,
    overlayBind,
    wrapperBind,
    handleOverlayClick,
    handleWrapperClick,
  };
}
