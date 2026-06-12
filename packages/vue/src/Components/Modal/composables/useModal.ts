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
  resolveVnodeRefElement,
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
   * Whether the modal is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;

  /**
   * Pre-assigned stack id (BridgeModalHost). When omitted, the stack generates a UUID.
   */
  stackId?: string;
};

export function useModal(
  props: ModalOwnProps,
  libDefaults: ModalLibDefaults,
  options: ModalOptions = {},
) {
  const attrs = useAttrs();

  const mounted = ref(false);

  const active = ref(false);

  const layerStackId = ref("");

  const panelRef = ref<HTMLElement | null>(null);

  let leaveTransitionEndsPending = 0;

  let stackOrder: number | null = null;

  let focusTrap: FocusTrap | null = null;

  let stackHandle: LayerStackHandle | null = null;
  let unsubscribeLayerStack: (() => void) | null = null;

  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  const transitionState = ref<"open" | "closed">("closed");

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
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeModal,
    props: () => split.value.componentProps,
  });

  const effectiveTransition = computed((): keyof ModalTransition => {
    return resolveEffectiveModalTransition(merged.value.transition ?? "none");
  });

  const transitionEnabled = computed(() => {
    return hasModalTransition(effectiveTransition.value);
  });

  const scrollMode = computed(() => {
    return merged.value.scroll ?? "body";
  });

  const isHiddenWhileMounted = computed(() => {
    return merged.value.keepMounted && !active.value;
  });

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
      customProps.value?.wrapper,
      {
        onClick: handleWrapperClick,
      },
      cn({
        "flex min-h-full w-full transform p-4": true,
        "items-end justify-center": true,
        [alignClass.value ?? ""]: true,
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
      },
      {
        "data-modal-part": "panel",
        "data-state": transitionState.value,
        class: cn({
          "relative w-full": true,
          [sizeClass.value ?? ""]: true,
          "max-h-[calc(100dvh-2rem)] overflow-y-auto":
            scrollMode.value === "paper",
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
      disableAutoFocus: merged.value.disableAutoFocus,
      disableEnforceFocus: merged.value.disableEnforceFocus,
      disableRestoreFocus: merged.value.disableRestoreFocus,
    });
  }

  function setPanelRef(element: Element | ComponentPublicInstance | null) {
    panelRef.value = resolveVnodeRefElement(element);
    syncFocusTrap();
  }

  function finishLeave() {
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
    leaveTransitionEndsPending = countModalTransitionLayers(
      effectiveTransition.value,
      { hideBackdrop: merged.value.hideBackdrop },
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
    if (!mounted.value || transitionState.value !== "closed") {
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
      () => merged.value.disableAutoFocus,
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
        stackOrder = acquireLayerStackOrder();

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
      } else {
        unsubscribeLayerStack?.();
        unsubscribeLayerStack = null;
        stackHandle?.release();
        stackHandle = null;
        stackOrder = null;
        layerStackId.value = "";
        stackZIndex.value = LAYER_STACK_BASE_Z_INDEX;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    unsubscribeLayerStack?.();
    unsubscribeLayerStack = null;
    releaseFocusTrap();
    stackHandle?.release();
    stackHandle = null;
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
