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
   * Whether focus moving outside the trigger and content closes the overlay
   * (wire `handleContentFocusOut` on the content).
   */
  closeOnFocusOut?: boolean;

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
  claimOpen?: (claim: {
    contains: (node: Node) => boolean;
    id: string;
    requestClose: () => void;
  }) => () => void;

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
   * Called once each time the overlay opens, with the anchor element.
   */
  onOpen?: (reference: null | HTMLElement) => void;

  /**
   * When true, closing while focus is inside the content moves focus back
   * to the anchor (instead of letting it fall to `<body>`).
   */
  restoreFocus?: boolean;

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
  let stackOrder: null | number = null;
  let disposed = false;

  /**
   * Work deferred to the next tick (after the content renders). Coalesced so
   * each open runs it once, and dropped on close or unmount.
   */
  type PendingSync = {
    focus: boolean;
    open: boolean;
    position: boolean;
  };

  let pendingSync: null | PendingSync = null;

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

  /**
   * Closes when focus leaves the trigger and content (`closeOnFocusOut`).
   * Pass the focus event's `relatedTarget`.
   */
  function handleContentFocusOut(next: null | EventTarget) {
    if (config.value.closeOnFocusOut !== true) {
      return;
    }

    if (!(next instanceof Node) || isInsideOverlay(next)) {
      return;
    }

    requestClose();
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

  function runOpenTasks() {
    options.onOpen?.(getReferenceElement());

    if (claimOpen) {
      releaseClaim = claimOpen({
        id,
        requestClose,
        contains: isInsideOverlay,
      });
    }

    attachPointerListener();
  }

  function scheduleSync(parts: Partial<PendingSync>) {
    if (pendingSync) {
      pendingSync.open ||= parts.open === true;
      pendingSync.focus ||= parts.focus === true;
      pendingSync.position ||= parts.position === true;

      return;
    }

    const task: PendingSync = {
      open: parts.open === true,
      focus: parts.focus === true,
      position: parts.position === true,
    };

    pendingSync = task;

    void nextTick(() => {
      if (pendingSync !== task) {
        return;
      }

      pendingSync = null;

      if (disposed || !show.value) {
        return;
      }

      syncLayerContainer();

      if (task.open) {
        runOpenTasks();
      }

      if (task.position) {
        syncPositionable();
      }

      if (task.focus) {
        syncAutoFocus();
      }
    });
  }

  function pushLayer() {
    stackHandle?.release();

    stackOrder ??= acquireLayerStackOrder();

    stackHandle = pushLayerStack({
      order: stackOrder,
      onEscape: handleEscape,
      container: contentRef.value ?? undefined,
      lockScroll: config.value.disableScrollLock !== true,
    });

    layerStackId.value = stackHandle.id;
    stackZIndex.value = stackHandle.zIndex;
    syncZIndex();
  }

  function restoreFocusIfInside() {
    if (!options.restoreFocus) {
      return;
    }

    const content = contentRef.value;
    const active = document.activeElement;

    if (content && active && content.contains(active)) {
      focusReference();
    }
  }

  function setTriggerRef(element: null | Element | ComponentPublicInstance) {
    const next = resolveVnodeRefElement(element);

    if (triggerRef.value === next) {
      return;
    }

    triggerRef.value = next;

    if (!next || !show.value) {
      return;
    }

    scheduleSync({ position: true });
  }

  function setContentRef(element: null | Element | ComponentPublicInstance) {
    const next = resolveVnodeRefElement(element);

    if (contentRef.value === next) {
      return;
    }

    contentRef.value = next;
    syncLayerContainer();

    if (!next || !show.value) {
      return;
    }

    scheduleSync({ focus: true, position: true });
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
    pendingSync = null;
    stackOrder = null;
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
        pushLayer();
        unsubscribeLayerStack = subscribeLayerStack(syncZIndex);
        scheduleSync({ open: true, focus: true, position: true });

        return;
      }

      restoreFocusIfInside();
      teardownOpenState();

      if (!config.value.keepMounted) {
        mounted.value = false;
      }
    },
    { immediate: true },
  );

  watch(
    () => config.value.disableScrollLock,
    () => {
      if (show.value && stackHandle) {
        pushLayer();
      }
    },
  );

  watch(
    [
      anchorEl,
      () => config.value.arrow,
      () => config.value.offset,
      () => config.value.strategy,
      () => config.value.placement,
      () => config.value.matchWidth,
    ],
    () => {
      if (show.value) {
        scheduleSync({ position: true });
      }
    },
  );

  watch(
    () => config.value.disableAutoFocus,
    () => {
      if (show.value) {
        scheduleSync({ focus: true });
      }
    },
  );

  onBeforeUnmount(() => {
    disposed = true;
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
    handleContentFocusOut,
  };
}
