// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

// ** Core Imports
import {
  acquireModalStackOrder,
  cn,
  mergeBridgeUILayeredClasses,
  MODAL_STACK_BASE_Z_INDEX,
  pushModalStack,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type ModalStackHandle,
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
  "closeOnEscape",
  "closeOnOverlay",
] as const satisfies readonly (keyof ModalOwnProps)[];

type ModalLibDefaults = LibDefaultsShape<
  ModalOwnProps,
  "blur" | "size" | "align" | "teleportTo" | "closeOnEscape" | "closeOnOverlay"
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

  const stackOrderRef = useRef<number | null>(null);

  const stackHandleRef = useRef<ModalStackHandle | null>(null);

  const [stackZIndex, setStackZIndex] = useState(MODAL_STACK_BASE_Z_INDEX);

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

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireModalStackOrder();
  }

  if (!show && stackOrderRef.current !== null) {
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

  // Binds
  const rootBind = mergePartBind(partsProps?.root, rootInheritedAttrs, {
    className: cn({
      "fixed inset-0 overflow-y-auto": true,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
    style: {
      zIndex: stackZIndex,
    },
  });

  const overlayBind = mergePartBind(
    partsProps?.overlay,
    {},
    cn({
      "fixed inset-0 bg-black/50 transition-opacity": true,
      [blurClass ?? ""]: true,
      [get(mergedClasses, "overlay") ?? ""]: true,
    }),
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
    cn({
      "relative w-full": true,
      [get(mergedClasses, "panel") ?? ""]: true,
    }),
  );

  // Handlers
  function setShow(next: boolean) {
    onShowChange?.(next);

    if (!next) {
      onClose?.();
    }
  }

  function requestClose() {
    if (merged.persistent) {
      return;
    }

    setShow(false);
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
    if (!show || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(MODAL_STACK_BASE_Z_INDEX);

      return;
    }

    function handleEscape() {
      if (merged.closeOnEscape === false || merged.persistent) {
        return;
      }

      setShow(false);
    }

    const handle = pushModalStack({
      order: stackOrderRef.current,
      onEscape: handleEscape,
    });

    stackHandleRef.current = handle;
    setStackZIndex(handle.zIndex);

    return () => {
      handle.release();
      stackHandleRef.current = null;
    };
  }, [show, merged.closeOnEscape, merged.persistent]);

  return {
    merged,
    rootBind,
    panelBind,
    overlayBind,
    wrapperBind,
    handleOverlayClick,
    handleWrapperClick,
  };
}
