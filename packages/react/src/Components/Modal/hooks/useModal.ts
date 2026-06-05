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
  acquireModalStackOrder,
  cn,
  countModalTransitionLayers,
  getModalOverlayTransitionClass,
  getModalPanelTransitionClass,
  hasModalTransition,
  mergeBridgeUILayeredClasses,
  MODAL_STACK_BASE_Z_INDEX,
  pushModalStack,
  resolveEffectiveModalTransition,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type ModalStackHandle,
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
  "classes",
  "partsProps",
  "persistent",
  "teleportTo",
  "transition",
  "closeOnEscape",
  "closeOnOverlay",
] as const satisfies readonly (keyof ModalOwnProps)[];

type ModalLibDefaults = LibDefaultsShape<
  ModalOwnProps,
  | "blur"
  | "size"
  | "align"
  | "teleportTo"
  | "transition"
  | "closeOnEscape"
  | "closeOnOverlay"
>;

type ModalMerged = MergeLibDefaults<ModalOwnProps, ModalLibDefaults>;

export type ModalOptions = {
  /**
   * Whether the modal is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * Called when the modal requests to close.
   * Sugar for `onShowChange(false)`.
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;
};

export function useModal(
  props: ModalProps,
  libDefaults: ModalLibDefaults,
  options: ModalOptions = {},
) {
  // Setup
  const { onClose, onShowChange, show = false } = options;

  const modalStackIdRef = useRef("");

  const [rendered, setRendered] = useState(false);

  const leaveTransitionEndsPendingRef = useRef(0);

  const stackOrderRef = useRef<number | null>(null);

  const stackHandleRef = useRef<ModalStackHandle | null>(null);

  const [stackZIndex, setStackZIndex] = useState(MODAL_STACK_BASE_Z_INDEX);

  const [transitionState, setTransitionState] = useState<"open" | "closed">(
    "closed",
  );

  const { customProps, inheritedAttrs } = splitComponentProps<
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
    props: customProps,
    componentName: "Modal",
  });

  const partsProps = merged.partsProps;

  const rootInheritedAttrs = omit(inheritedAttrs, [
    "show",
    "onClose",
    "children",
    "onShowChange",
  ]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeModal,
    props: customProps,
  });

  const effectiveTransition = useMemo((): keyof ModalTransition => {
    return resolveEffectiveModalTransition(merged.transition ?? "none");
  }, [merged.transition]);

  const transitionEnabled = hasModalTransition(effectiveTransition);

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireModalStackOrder();
  }

  if (!show && !rendered && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  // Classes
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

  // Handlers
  function setShow(next: boolean) {
    onShowChange?.(next);

    if (!next) {
      onClose?.();
    }
  }

  function finishLeave() {
    leaveTransitionEndsPendingRef.current = 0;
    setTransitionState("closed");

    if (show) {
      setShow(false);
    }

    setRendered(false);
  }

  function startLeave() {
    if (!transitionEnabled) {
      finishLeave();

      return;
    }

    setTransitionState("closed");
    leaveTransitionEndsPendingRef.current =
      countModalTransitionLayers(effectiveTransition);

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
    if (!rendered || transitionState !== "closed") {
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

    if (!rendered) {
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

  useEffect(() => {
    if (show) {
      setRendered(true);
      scheduleOpen();

      return;
    }

    if (!rendered) {
      return;
    }

    startLeave();
  }, [show]);

  useLayoutEffect(() => {
    if (!rendered || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(MODAL_STACK_BASE_Z_INDEX);

      return;
    }

    function handleEscape() {
      if (merged.closeOnEscape === false || merged.persistent) {
        return;
      }

      requestClose();
    }

    const handle = pushModalStack({
      order: stackOrderRef.current,
      onEscape: handleEscape,
    });

    stackHandleRef.current = handle;
    modalStackIdRef.current = handle.id;
    setStackZIndex(handle.zIndex);

    return () => {
      handle.release();
      stackHandleRef.current = null;
      modalStackIdRef.current = "";
    };
  }, [
    rendered,
    merged.persistent,
    merged.transition,
    effectiveTransition,
    merged.closeOnEscape,
  ]);

  // Binds
  const rootBind = mergePartBind(partsProps?.root, rootInheritedAttrs, {
    className: cn({
      "fixed inset-0 overflow-y-auto": true,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
    style: {
      zIndex: stackZIndex,
    },
    onTransitionEnd: handleShellTransitionEnd,
  });

  const overlayBind = mergePartBind(
    partsProps?.overlay,
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
    partsProps?.wrapper,
    {},
    cn({
      "mx-auto flex min-h-full w-full transform items-end justify-center p-4": true,
      [alignClass ?? ""]: true,
      [sizeClass ?? ""]: true,
      [get(mergedClasses, "wrapper") ?? ""]: true,
    }),
  );

  const panelBind = mergePartBind(
    partsProps?.panel,
    {
      role: "dialog",
      "aria-modal": true,
    },
    {
      "data-modal-part": "panel",
      "data-state": transitionState,
      className: cn({
        "relative w-full": true,
        [panelTransitionClass]: transitionEnabled,
        [get(mergedClasses, "panel") ?? ""]: true,
      }),
    },
  );

  return {
    merged,
    rendered,
    rootBind,
    panelBind,
    overlayBind,
    wrapperBind,
    handleOverlayClick,
    handleWrapperClick,
    modalStackId: modalStackIdRef.current,
  };
}
