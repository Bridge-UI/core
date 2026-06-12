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
  cn,
  countModalTransitionLayers,
  createFocusTrap,
  getLayerStackEntry,
  getModalOverlayTransitionClass,
  getModalPanelTransitionClass,
  hasModalTransition,
  LAYER_STACK_BASE_Z_INDEX,
  mergeBridgeUILayeredClasses,
  pushLayerStack,
  resolveEffectiveModalTransition,
  splitComponentProps,
  subscribeLayerStack,
  type FocusTrap,
  type LayerStackHandle,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type ModalTransition,
} from "@bridge-ui/core";
import {
  alignProps,
  blurProps,
  sizeProps,
} from "@bridge-ui/core/Components/Modal";
import { isModalBackdropClick } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ModalOwnProps, ModalProps } from "@/Components/Modal/modal.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const modalBridgeKeys = [
  "blur",
  "size",
  "align",
  "scroll",
  "classes",
  "stackId",
  "persistent",
  "teleportTo",
  "transition",
  "customProps",
  "keepMounted",
  "hideBackdrop",
  "closeOnEscape",
  "closeOnOverlay",
  "disableAutoFocus",
  "disableScrollLock",
  "disableEnforceFocus",
  "disableRestoreFocus",
] as const satisfies readonly (keyof ModalOwnProps)[];

type ModalLibDefaults = LibDefaultsShape<
  ModalOwnProps,
  | "blur"
  | "size"
  | "align"
  | "scroll"
  | "teleportTo"
  | "transition"
  | "closeOnEscape"
  | "closeOnOverlay"
>;

type ModalMerged = MergeLibDefaults<ModalOwnProps, ModalLibDefaults>;

export type ModalOptions = {
  /**
   * Called when the modal requests to close.
   * Sugar for `onShowChange(false)`.
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the modal is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * Pre-assigned stack id (BridgeModalHost). When omitted, the stack generates a UUID.
   */
  stackId?: string;
};

export function useModal(
  props: ModalProps,
  libDefaults: ModalLibDefaults,
  options: ModalOptions = {},
) {
  const { onClose, stackId, onShowChange, show = false } = options;

  const layerStackIdRef = useRef("");

  const [active, setActive] = useState(show);

  const [mounted, setMounted] = useState(show);

  const panelRef = useRef<HTMLDivElement>(null);

  const leaveTransitionEndsPendingRef = useRef(0);

  const stackOrderRef = useRef<number | null>(null);

  const focusTrapRef = useRef<FocusTrap | null>(null);

  const stackHandleRef = useRef<LayerStackHandle | null>(null);

  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const [transitionState, setTransitionState] = useState<"open" | "closed">(
    "closed",
  );

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ModalProps,
    typeof modalBridgeKeys
  >({
    props,
    bridgeKeys: modalBridgeKeys,
  });

  const { merged, entry: bridgeModal } = useBridgeUIComponent<
    ModalMerged,
    "Modal"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Modal",
  });

  const customProps = merged.customProps;

  const rootInheritedAttrs = omit(inheritedAttrs, [
    "show",
    "onClose",
    "children",
    "onShowChange",
  ]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeModal,
    props: componentProps,
  });

  const effectiveTransition = useMemo((): keyof ModalTransition => {
    return resolveEffectiveModalTransition(merged.transition ?? "none");
  }, [merged.transition]);

  const transitionEnabled = hasModalTransition(effectiveTransition);

  const scrollMode = merged.scroll ?? "body";

  const isHiddenWhileMounted = merged.keepMounted && !active;

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && !mounted && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const alignClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      alignProps,
      bridgeModal?.customProps?.align,
    );

    return get(classes, merged.align);
  }, [merged.align, bridgeModal?.customProps?.align]);

  const blurClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      blurProps,
      bridgeModal?.customProps?.blur,
    );

    return get(classes, merged.blur);
  }, [merged.blur, bridgeModal?.customProps?.blur]);

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeModal?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeModal?.customProps?.size]);

  const panelTransitionClass =
    getModalPanelTransitionClass(effectiveTransition);

  const overlayTransitionClass =
    getModalOverlayTransitionClass(effectiveTransition);

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

  function finishLeave() {
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

    if (!transitionEnabled) {
      finishLeave();

      return;
    }

    setTransitionState("closed");
    leaveTransitionEndsPendingRef.current = countModalTransitionLayers(
      effectiveTransition,
      { hideBackdrop: merged.hideBackdrop },
    );

    if (leaveTransitionEndsPendingRef.current === 0) {
      finishLeave();
    }
  }

  function scheduleOpen() {
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
    if (!mounted || transitionState !== "closed") {
      return;
    }

    const target = event.target as HTMLElement;

    if (
      target.dataset.modalPart !== "panel" &&
      target.dataset.modalPart !== "overlay"
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
      disableAutoFocus: merged.disableAutoFocus,
      disableEnforceFocus: merged.disableEnforceFocus,
      disableRestoreFocus: merged.disableRestoreFocus,
    });

    return releaseFocusTrap;
  }, [
    active,
    transitionState,
    merged.disableAutoFocus,
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

  const rootBind = mergePartBind(customProps?.root, rootInheritedAttrs, {
    style: {
      zIndex: stackZIndex,
    },
    onTransitionEnd: handleShellTransitionEnd,
    "aria-hidden": isHiddenWhileMounted ? true : undefined,
    className: cn({
      "fixed inset-0": true,
      "overflow-y-auto": scrollMode === "body",
      "overflow-hidden": scrollMode === "paper",
      "invisible pointer-events-none": isHiddenWhileMounted,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  });

  const overlayBind = mergePartBind(
    customProps?.overlay,
    {},
    {
      "data-modal-part": "overlay",
      "data-state": transitionState,
      className: cn({
        "fixed inset-0 bg-black/50": true,
        [blurClass ?? ""]: true,
        [overlayTransitionClass]: transitionEnabled,
        [get(mergedClasses, "overlay") ?? ""]: true,
      }),
    },
  );

  const wrapperBind = mergePartBind(
    customProps?.wrapper,
    {},
    cn({
      "flex min-h-full w-full transform p-4": true,
      "items-end justify-center": true,
      [alignClass ?? ""]: true,
      [get(mergedClasses, "wrapper") ?? ""]: true,
    }),
  );

  const panelBind = mergePartBind(
    customProps?.panel,
    {
      ref: panelRef,
      role: "dialog",
      "aria-modal": true,
    },
    {
      "data-modal-part": "panel",
      "data-state": transitionState,
      className: cn({
        "relative w-full": true,
        [sizeClass ?? ""]: true,
        "max-h-[calc(100dvh-2rem)] overflow-y-auto": scrollMode === "paper",
        [panelTransitionClass]: transitionEnabled,
        [get(mergedClasses, "panel") ?? ""]: true,
      }),
    },
  );

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
