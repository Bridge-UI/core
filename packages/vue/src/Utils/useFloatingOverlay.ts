// ** External Imports
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  watch,
  type ComponentPublicInstance,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import {
  acquireLayerStackOrder,
  getLayerStackEntry,
  isFocusInHigherLayer,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  subscribeLayerStack,
  type LayerStackHandle,
} from "@bridge-ui/core/Layer";
import {
  createFocusable,
  createPositionable,
  type PositionHandle,
  type PositionPlacement,
  type PositionStrategy,
} from "@bridge-ui/core/Runtime";

// ** Local Imports
import { resolveVnodeRefElement } from "@/Utils/vnodeRef";

/**
 * Behavior settings read reactively by {@link useFloatingOverlay}.
 */
export type FloatingOverlayConfig = {
  /**
   * When true, positions the element set with `setArrowRef` against the anchor.
   */
  arrow?: boolean;

  /**
   * Whether a pointer down outside the trigger and content closes the overlay.
   */
  closeOnClickAway?: boolean;

  /**
   * Whether Escape closes the overlay (top-most layer only).
   */
  closeOnEscape?: boolean;

  /**
   * When true, opening does not move focus into the content.
   */
  disableAutoFocus?: boolean;

  /**
   * When true, body scroll stays enabled while open.
   */
  disableScrollLock?: boolean;

  /**
   * Keeps the content mounted (hidden) after closing.
   */
  keepMounted?: boolean;

  /**
   * Content width matches the anchor.
   */
  matchWidth?: boolean;

  /**
   * Gap between the anchor and the content (px).
   */
  offset?: number;

  /**
   * When true, Escape, click-away and reference-hidden do not close.
   */
  persistent?: boolean;

  /**
   * Preferred placement relative to the anchor.
   */
  placement?: PositionPlacement;

  /**
   * CSS position strategy for the content.
   */
  strategy?: PositionStrategy;
};

/**
 * Options for {@link useFloatingOverlay}.
 */
export type UseFloatingOverlayOptions = {
  /**
   * Anchor used instead of the trigger wrapper.
   */
  anchorEl?: MaybeRefOrGetter<null | undefined | HTMLElement>;

  /**
   * Focuses the content itself when it has no focusable children.
   */
  autoFocusContent?: boolean;

  /**
   * Registers the overlay as the single open menu. Returns a release callback.
   */
  claimOpen?: (claim: { id: string; requestClose: () => void }) => () => void;

  /**
   * Reactive behavior settings (usually the merged component props).
   */
  config: MaybeRefOrGetter<FloatingOverlayConfig>;

  /**
   * Stable id for the overlay (used for the open-menu claim).
   */
  id: string;

  /**
   * Extra click-away targets that must not close the overlay.
   */
  isClickAwayIgnored?: (target: Element) => boolean;

  /**
   * Called once each time the overlay opens.
   */
  onOpen?: () => void;

  /**
   * Requests a visibility change (controlled state).
   */
  setShow: (show: boolean) => void;

  /**
   * Whether the overlay is open.
   */
  show: MaybeRefOrGetter<boolean>;
};

/**
 * Shared floating-overlay behavior for anchored panels (Menu, Popover):
 * mount state, layer stack (Escape, scroll lock, z-index), positioning,
 * click-away and auto-focus. Roles and keyboard navigation stay in the caller.
 */
export function useFloatingOverlay(options: UseFloatingOverlayOptions) {
  const { id, setShow, claimOpen, isClickAwayIgnored } = options;

  const mounted = ref(false);

  const layerStackId = ref("");

  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  const triggerRef = ref<null | HTMLElement>(null);

  const contentRef = ref<null | HTMLElement>(null);

  const arrowRef = ref<null | HTMLElement>(null);

  let stackHandle: null | LayerStackHandle = null;
  let unsubscribeLayerStack: null | (() => void) = null;
  let positionHandle: null | PositionHandle = null;
  let removePointerListener: null | (() => void) = null;
  let releaseClaim: null | (() => void) = null;
  let allowReferenceHiddenClose = false;

  const show = computed(() => {
    return toValue(options.show);
  });

  const config = computed(() => {
    return toValue(options.config);
  });

  const anchorEl = computed(() => {
    return toValue(options.anchorEl) ?? null;
  });

  const canClose = computed(() => {
    return !config.value.persistent;
  });

  const isHiddenWhileMounted = computed(() => {
    return Boolean(config.value.keepMounted && !show.value);
  });

  function getReferenceElement(): null | HTMLElement {
    return anchorEl.value ?? triggerRef.value;
  }

  function focusReference() {
    getReferenceElement()?.focus({ preventScroll: true });
  }

  function isInsideReference(target: Node) {
    const reference = getReferenceElement();

    return reference?.contains(target) ?? false;
  }

  /**
   * Whether `target` belongs to this overlay: its anchor, its content, or a
   * layer stacked above it (a Select listbox opened from inside, for example).
   */
  function isInsideOverlay(target: Node) {
    if (isInsideReference(target)) {
      return true;
    }

    if (contentRef.value?.contains(target)) {
      return true;
    }

    return isFocusInHigherLayer(target, layerStackId.value);
  }

  function requestClose() {
    if (!canClose.value || !show.value) {
      return;
    }

    setShow(false);
  }

  function toggle() {
    if (config.value.persistent && show.value) {
      return;
    }

    setShow(!show.value);
  }

  function destroyPositionable() {
    allowReferenceHiddenClose = false;
    positionHandle?.destroy();
    positionHandle = null;
  }

  function syncPositionable() {
    destroyPositionable();

    const reference = getReferenceElement();
    const floating = contentRef.value;

    if (!show.value || !reference || !floating) {
      return;
    }

    positionHandle = createPositionable({
      floating,
      reference,
      offset: config.value.offset,
      strategy: config.value.strategy,
      placement: config.value.placement,
      matchWidth: config.value.matchWidth === true,
      arrow: config.value.arrow ? () => arrowRef.value : undefined,
      onReferenceHidden: () => {
        if (!allowReferenceHiddenClose || !canClose.value || !show.value) {
          return;
        }

        requestClose();
      },
    });

    positionHandle.start();

    void nextTick(() => {
      allowReferenceHiddenClose = true;
    });
  }

  function syncAutoFocus() {
    const content = contentRef.value;

    if (!show.value || config.value.disableAutoFocus || !content) {
      return;
    }

    const focusable = createFocusable(content);

    if (focusable.first()) {
      focusable.focusFirst();

      return;
    }

    if (options.autoFocusContent) {
      content.focus({ preventScroll: true });
    }
  }

  function attachPointerListener() {
    removePointerListener?.();

    if (!show.value) {
      removePointerListener = null;

      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (isInsideOverlay(target)) {
        return;
      }

      if (config.value.closeOnClickAway === false || !canClose.value) {
        return;
      }

      if (target instanceof Element && isClickAwayIgnored?.(target)) {
        return;
      }

      requestClose();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    removePointerListener = () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }

  function syncLayerContainer() {
    stackHandle?.setContainer(contentRef.value);
  }

  function setTriggerRef(element: null | Element | ComponentPublicInstance) {
    const next = resolveVnodeRefElement(element);

    if (triggerRef.value === next) {
      return;
    }

    triggerRef.value = next;

    if (!next) {
      return;
    }

    void nextTick(() => {
      syncPositionable();
    });
  }

  function setContentRef(element: null | Element | ComponentPublicInstance) {
    const next = resolveVnodeRefElement(element);

    if (contentRef.value === next) {
      return;
    }

    contentRef.value = next;
    syncLayerContainer();

    if (!next) {
      return;
    }

    void nextTick(() => {
      syncPositionable();
      syncAutoFocus();
    });
  }

  function setArrowRef(element: null | Element | ComponentPublicInstance) {
    arrowRef.value = resolveVnodeRefElement(element);
  }

  function handleEscape() {
    if (
      !show.value ||
      config.value.closeOnEscape === false ||
      !canClose.value
    ) {
      return;
    }

    requestClose();
    focusReference();
  }

  function syncZIndex() {
    const snapshot = getLayerStackEntry(layerStackId.value);

    if (snapshot) {
      stackZIndex.value = snapshot.zIndex;
    }
  }

  function teardownOpenState() {
    releaseClaim?.();
    releaseClaim = null;
    removePointerListener?.();
    removePointerListener = null;
    unsubscribeLayerStack?.();
    unsubscribeLayerStack = null;
    stackHandle?.release();
    stackHandle = null;
    layerStackId.value = "";
    stackZIndex.value = LAYER_STACK_BASE_Z_INDEX;
    destroyPositionable();
  }

  watch(
    show,
    (isShown) => {
      if (isShown) {
        mounted.value = true;
        options.onOpen?.();

        if (claimOpen) {
          void nextTick(() => {
            if (!show.value) {
              return;
            }

            releaseClaim = claimOpen({ id, requestClose });
          });
        }

        stackHandle = pushLayerStack({
          onEscape: handleEscape,
          order: acquireLayerStackOrder(),
          container: contentRef.value ?? undefined,
          lockScroll: config.value.disableScrollLock !== true,
        });

        layerStackId.value = stackHandle.id;
        stackZIndex.value = stackHandle.zIndex;
        syncZIndex();
        unsubscribeLayerStack = subscribeLayerStack(syncZIndex);

        void nextTick(() => {
          syncLayerContainer();
          syncPositionable();
          syncAutoFocus();
          attachPointerListener();
        });

        return;
      }

      teardownOpenState();

      if (!config.value.keepMounted) {
        mounted.value = false;
      }
    },
    { immediate: true },
  );

  watch(
    [
      show,
      anchorEl,
      () => config.value.arrow,
      () => config.value.offset,
      () => config.value.strategy,
      () => config.value.placement,
      () => config.value.matchWidth,
    ],
    () => {
      void nextTick(() => {
        syncPositionable();
      });
    },
  );

  watch([show, () => config.value.disableAutoFocus], () => {
    void nextTick(() => {
      syncAutoFocus();
    });
  });

  onBeforeUnmount(() => {
    teardownOpenState();
  });

  return {
    toggle,
    mounted,
    arrowRef,
    triggerRef,
    contentRef,
    stackZIndex,
    setArrowRef,
    requestClose,
    setTriggerRef,
    setContentRef,
    focusReference,
    isInsideOverlay,
    isInsideReference,
    isHiddenWhileMounted,
  };
}
