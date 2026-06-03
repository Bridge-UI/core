// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  onBeforeUnmount,
  toValue,
  useAttrs,
  watch,
  type Ref,
} from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
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
   * Whether the modal is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;

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
  props: ModalOwnProps,
  libDefaults: ModalLibDefaults,
  options: ModalOptions = {},
) {
  // Setup
  const attrs = useAttrs();

  const show = computed(() => {
    return toValue(options.show ?? false);
  });

  function setShow(next: boolean) {
    if (options.show) {
      options.show.value = next;
    }

    options.onShowChange?.(next);

    if (!next) {
      options.onClose?.();
    }
  }

  const split = computed(() => {
    return splitComponentProps<ModalProps, typeof modalBridgeKeys>({
      bridgeKeys: modalBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeModal } = useBridgeUIComponent<
    ModalMerged,
    "Modal"
  >({
    libDefaults,
    componentName: "Modal",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeModal,
    props: () => split.value.customProps,
  });

  // Classes
  const alignClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      alignProps,
      bridgeModal.value?.customProps?.align,
    );

    return get(classes, merged.value.align);
  });

  const blurClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      blurProps,
      bridgeModal.value?.customProps?.blur,
    );

    return get(classes, merged.value.blur);
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeModal.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const canClose = computed(() => {
    return !merged.value.persistent;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onClose", "onShowChange"]);
  });

  // Binds
  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "fixed inset-0 z-50 overflow-y-auto": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const overlayBind = computed(() => {
    return mergePartBind(
      partsProps.value?.overlay,
      {
        onClick: handleOverlayClick,
      },
      cn({
        "fixed inset-0 bg-black/50 transition-opacity": true,
        [blurClass.value ?? ""]: true,
        [get(mergedClasses.value, "overlay") ?? ""]: true,
      }),
    );
  });

  const wrapperBind = computed(() => {
    return mergePartBind(
      partsProps.value?.wrapper,
      {
        onClick: handleWrapperClick,
      },
      cn({
        "mx-auto flex min-h-full w-full transform items-end justify-center p-4": true,
        [alignClass.value ?? ""]: true,
        [sizeClass.value ?? ""]: true,
        [get(mergedClasses.value, "wrapper") ?? ""]: true,
      }),
    );
  });

  const panelBind = computed(() => {
    return mergePartBind(
      partsProps.value?.panel,
      {
        role: "dialog",
        "aria-modal": true,
      },
      cn({
        "relative w-full": true,
        [get(mergedClasses.value, "panel") ?? ""]: true,
      }),
    );
  });

  // Handlers
  function requestClose() {
    if (!canClose.value) {
      return;
    }

    setShow(false);
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

  function handleEscape(event: KeyboardEvent) {
    if (event.key !== "Escape") {
      return;
    }

    if (merged.value.closeOnEscape === false || !canClose.value) {
      return;
    }

    event.preventDefault();

    requestClose();
  }

  function lockBodyScroll() {
    if (typeof document === "undefined") {
      return;
    }

    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    if (typeof document === "undefined") {
      return;
    }

    document.body.style.overflow = "";
  }

  watch(
    show,
    (isShown) => {
      if (isShown) {
        lockBodyScroll();
        window.addEventListener("keydown", handleEscape);
      } else {
        unlockBodyScroll();
        window.removeEventListener("keydown", handleEscape);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleEscape);

    unlockBodyScroll();
  });

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
