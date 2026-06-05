// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  useAttrs,
  watch,
  type Ref,
} from "vue";

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
  "stackId",
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
   * Whether the modal is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;

  /**
   * Pre-assigned stack id (BridgeModalHost). When omitted, the stack generates a UUID.
   */
  stackId?: string;

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

  const rendered = ref(false);

  const modalStackId = ref("");

  let leaveTransitionEndsPending = 0;

  let stackOrder: number | null = null;

  let stackHandle: ModalStackHandle | null = null;

  const stackZIndex = ref(MODAL_STACK_BASE_Z_INDEX);

  const transitionState = ref<"open" | "closed">("closed");

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

  const effectiveTransition = computed((): keyof ModalTransition => {
    return resolveEffectiveModalTransition(merged.value.transition ?? "none");
  });

  const transitionEnabled = computed(() => {
    return hasModalTransition(effectiveTransition.value);
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

  const overlayTransitionClass = computed(() => {
    return getModalOverlayTransitionClass(effectiveTransition.value);
  });

  const panelTransitionClass = computed(() => {
    return getModalPanelTransitionClass(effectiveTransition.value);
  });

  const canClose = computed(() => {
    return !merged.value.persistent;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onShowChange"]);
  });

  // Binds
  const rootBind = computed(() => {
    return mergePartBind(partsProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        "fixed inset-0 overflow-y-auto": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
      style: {
        zIndex: stackZIndex.value,
      },
      onTransitionend: handleShellTransitionEnd,
    });
  });

  const overlayBind = computed(() => {
    return mergePartBind(
      partsProps.value?.overlay,
      {
        onClick: handleOverlayClick,
      },
      {
        "data-modal-part": "overlay",
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
      {
        "data-modal-part": "panel",
        "data-state": transitionState.value,
        class: cn({
          "relative w-full": true,
          [panelTransitionClass.value]: transitionEnabled.value,
          [get(mergedClasses.value, "panel") ?? ""]: true,
        }),
      },
    );
  });

  // Handlers
  function finishLeave() {
    leaveTransitionEndsPending = 0;

    if (show.value) {
      setShow(false);
    } else {
      options.onShowChange?.(false);
    }

    rendered.value = false;
    transitionState.value = "closed";
  }

  function startLeave() {
    if (!transitionEnabled.value) {
      finishLeave();

      return;
    }

    transitionState.value = "closed";
    leaveTransitionEndsPending = countModalTransitionLayers(
      effectiveTransition.value,
    );

    if (leaveTransitionEndsPending === 0) {
      finishLeave();
    }
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
    if (!rendered.value || transitionState.value !== "closed") {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (
      target?.dataset.modalPart !== "overlay" &&
      target?.dataset.modalPart !== "panel"
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

  // Handlers
  function requestClose() {
    if (!canClose.value) {
      return;
    }

    if (!transitionEnabled.value) {
      setShow(false);

      return;
    }

    if (!rendered.value) {
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
    if (merged.value.closeOnEscape === false || !canClose.value) {
      return;
    }

    requestClose();
  }

  watch(
    show,
    (isShown) => {
      if (isShown) {
        rendered.value = true;
        scheduleOpen();

        return;
      }

      if (!rendered.value) {
        return;
      }

      startLeave();
    },
    { immediate: true },
  );

  watch(
    rendered,
    (isRendered) => {
      if (isRendered) {
        stackOrder = acquireModalStackOrder();

        stackHandle = pushModalStack({
          order: stackOrder,
          id: options.stackId,
          onEscape: handleEscape,
        });

        modalStackId.value = stackHandle.id;
        stackZIndex.value = stackHandle.zIndex;
      } else {
        stackHandle?.release();
        stackHandle = null;
        stackOrder = null;
        modalStackId.value = "";
        stackZIndex.value = MODAL_STACK_BASE_Z_INDEX;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    stackHandle?.release();
    stackHandle = null;
  });

  return {
    merged,
    rendered,
    rootBind,
    panelBind,
    overlayBind,
    wrapperBind,
    modalStackId,
    handleOverlayClick,
    handleWrapperClick,
  };
}
