// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, useMemo, type MouseEvent } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Modal";
import { isModalBackdropClick } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ModalOwnProps, ModalProps } from "@/Components/Modal/modal.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const modalBridgeKeys = [
  "classes",
  "size",
  "persistent",
  "teleportTo",
  "partsProps",
  "closeOnEscape",
  "closeOnOverlay",
] as const satisfies readonly (keyof ModalOwnProps)[];

type ModalLibDefaults = LibDefaultsShape<
  ModalOwnProps,
  "size" | "teleportTo" | "closeOnEscape" | "closeOnOverlay"
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
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Called when the modal requests to close.
   * Sugar for `onShowChange(false)`.
   */
  onClose?: () => void;
};

export function useModal(
  props: ModalProps,
  libDefaults: ModalLibDefaults,
  options: ModalOptions = {},
) {
  const { show = false, onShowChange, onClose } = options;
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
    "children",
    "show",
    "onClose",
    "onShowChange",
  ]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeModal,
    props: customProps,
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeModal?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeModal?.customProps?.size]);

  const rootBind = mergePartBind(
    partsProps?.root,
    rootInheritedAttrs,
    cn({
      "fixed inset-0 z-50 overflow-y-auto": true,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  );

  const overlayBind = mergePartBind(
    partsProps?.overlay,
    {},
    cn({
      "fixed inset-0 bg-black/50 transition-opacity": true,
      [get(mergedClasses, "overlay") ?? ""]: true,
    }),
  );

  const wrapperBind = mergePartBind(
    partsProps?.wrapper,
    {},
    cn({
      "flex min-h-full w-full items-end justify-center p-4 sm:items-center": true,
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
      [sizeClass ?? ""]: true,
      [get(mergedClasses, "panel") ?? ""]: true,
    }),
  );

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

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (merged.closeOnEscape === false || merged.persistent) {
        return;
      }

      event.preventDefault();
      setShow(false);
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
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
