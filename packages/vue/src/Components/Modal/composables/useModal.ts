// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  onBeforeUnmount,
  onMounted,
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
   * Modal visibility (`defineModel('show')` or a ref/getter).
   *
   * @default false
   */
  show?: Ref<boolean>;

  /**
   * Called when visibility should change (optional; `v-model:show` usually handles this).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Called when the modal requests to close.
   */
  onClose?: () => void;
};

export function useModal(
  props: ModalOwnProps,
  libDefaults: ModalLibDefaults,
  options: ModalOptions = {},
) {
  const { onShowChange, onClose } = options;

  const showValue = computed(() => {
    return toValue(options.show ?? false);
  });

  function setShow(next: boolean) {
    if (options.show) {
      options.show.value = next;
    }

    onShowChange?.(next);

    if (!next) {
      onClose?.();
    }
  }
  const attrs = useAttrs();

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

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        "fixed inset-0 z-50 overflow-y-auto": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const overlayBind = computed(() => {
    return mergePartBind(
      partsProps.value?.overlay,
      {},
      cn({
        "fixed inset-0 bg-black/50 transition-opacity": true,
        [get(mergedClasses.value, "overlay") ?? ""]: true,
      }),
    );
  });

  const wrapperBind = computed(() => {
    return mergePartBind(
      partsProps.value?.wrapper,
      {},
      cn({
        "flex min-h-full w-full items-end justify-center p-4 sm:items-center": true,
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
        [sizeClass.value ?? ""]: true,
        [get(mergedClasses.value, "panel") ?? ""]: true,
      }),
    );
  });

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
    if (event.key !== "Escape" || !showValue.value) {
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
    showValue,
    (isShown) => {
      if (isShown) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    window.addEventListener("keydown", handleEscape);
  });

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
