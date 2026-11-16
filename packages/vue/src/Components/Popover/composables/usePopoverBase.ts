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
  isInsideNestedLayer as isInsideNestedLayerOf,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  subscribeLayerStack,
  type LayerStackHandle,
} from "@bridge-ui/core/Layer";
import {
  createFocusable,
  createPositionable,
  hasDocument,
  type PositionHandle,
  type PositionPlacement,
  type PositionStrategy,
} from "@bridge-ui/core/Runtime";

// ** Local Imports
import { resolveVnodeRefElement } from "@/Utils";

/**
 * Behavior settings read reactively by {@link usePopoverBase}.
 */
export type PopoverBaseConfig = {
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
   * Whether focus moving outside the trigger and content closes the overlay.
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
 * Options for {@link usePopoverBase}.
 */
export type UsePopoverBaseOptions = {
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
    origin: null | HTMLElement;
    requestClose: () => void;
  }) => () => void;

  /**
   * Reactive behavior settings (usually the merged component props).
   */
  config: MaybeRefOrGetter<PopoverBaseConfig>;

  /**
   * Stable id for the overlay (used for the open-menu claim).
   */
  id: string;

  /**
   * Click-away targets that close the overlay only once the press ends
   * (pointer up), instead of on pointer down: another menu's trigger, whose
   * menu then takes over in the same click.
   */
  isClickAwayDeferred?: (target: Element) => boolean;

  /**
   * Called once each time the overlay opens, with the element it opened
   * from: the trigger, or the anchor when there is no trigger.
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
 * Popover base: the anchored-panel behavior shared by Popover and Menu
 * (mount state, layer stack for Escape / scroll lock / z-index, positioning,
 * click-away and auto-focus). Roles, ARIA and keyboard navigation stay in
 * the caller.
 */
export function usePopoverBase(options: UsePopoverBaseOptions) {
  const { id, setShow, claimOpen, isClickAwayDeferred } = options;

  const mounted = ref(false);
  const layerStackId = ref("");
  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  const arrowRef = ref<null | HTMLElement>(null);
  const triggerRef = ref<null | HTMLElement>(null);
  const contentRef = ref<null | HTMLElement>(null);

  let disposed = false;
  let stackOrder: null | number = null;
  let allowReferenceHiddenClose = false;
  let releaseClaim: null | (() => void) = null;
  let stackHandle: null | LayerStackHandle = null;
  let positionHandle: null | PositionHandle = null;
  let unsubscribeLayerStack: null | (() => void) = null;
  let removePointerListener: null | (() => void) = null;
  let removeDeferredListener: null | (() => void) = null;
  let removeFocusOutListener: null | (() => void) = null;
  let deferredTimeoutId: null | ReturnType<typeof setTimeout> = null;

  /**
   * Set when a pointer down outside closed the overlay: focus follows the
   * pointer, so it is not moved back to the anchor.
   */
  let closedByClickAway = false;

  /**
   * Set once a close is requested, until `show` changes (or the next task, if
   * the parent keeps it open). `show` is only updated after the parent
   * re-renders, so close paths running in the same tick (claim, Escape,
   * click-away…) would otherwise each emit `close`.
   */
  let closeRequested = false;

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

  /**
   * Element the overlay is opened from: its trigger, or the `anchorEl` when
   * it has none. Decides which menu or layer the overlay is nested in.
   */
  function getOpenerElement(): null | HTMLElement {
    return triggerRef.value ?? getReferenceElement();
  }

  /**
   * Whether `target` is inside the anchor or the trigger (which may differ
   * from an `anchorEl`).
   */
  function isInsideReference(target: Node) {
    const reference = getReferenceElement();

    if (reference?.contains(target)) {
      return true;
    }

    return triggerRef.value?.contains(target) ?? false;
  }

  /**
   * Whether `target` is in the panel: the content or a layer opened from it.
   */
  function isInsidePanel(target: Node) {
    return (
      contentRef.value?.contains(target) === true || isInsideNestedLayer(target)
    );
  }

  /**
   * Whether `target` is inside a layer opened from this overlay (a Popover or
   * Select listbox opened from inside a Menu, for example).
   */
  function isInsideNestedLayer(target: Node) {
    return isInsideNestedLayerOf(target, layerStackId.value);
  }

  /**
   * Whether `target` belongs to this overlay: its anchor, its trigger, its
   * content, or a layer opened from it.
   */
  function isInsideOverlay(target: Node) {
    return isInsideReference(target) || isInsidePanel(target);
  }

  /**
   * Asks the parent to close. Returns whether a close was requested (not
   * when persistent, already closed, or already requested this tick).
   */
  function requestClose(): boolean {
    if (!canClose.value || !show.value || closeRequested) {
      return false;
    }

    closeRequested = true;
    setTimeout(() => {
      closeRequested = false;
    }, 0);

    setShow(false);

    return true;
  }

  /**
   * Escape pressed in the content (not in a layer opened from it): closes
   * this overlay here and marks the key handled, so the layer stack does not
   * close the layer below too, nor a layer above that was not opened from
   * this one (a Tooltip). Returns whether the key was handled: not when
   * this overlay stays open.
   */
  function handleContentEscape(event: KeyboardEvent): boolean {
    const target = event.target as Node;

    if (event.key !== "Escape" || event.defaultPrevented) {
      return false;
    }

    if (!contentRef.value?.contains(target) || isInsideNestedLayer(target)) {
      return false;
    }

    // An overlay that stays open (persistent, `closeOnEscape` off) leaves
    // the key to the layer stack, so a layer above it can still close.
    if (!closeFromEscape()) {
      return false;
    }

    event.preventDefault();

    return true;
  }

  /**
   * Closes when focus leaves the trigger or content (`closeOnFocusOut`).
   * Listens on the document because `focusout` does not cross a Teleport, so
   * focus leaving a nested overlay for the outside closes this one too. An
   * external `anchorEl` does not count: focus leaving an input that anchors a
   * suggestions panel keeps it open.
   */
  function handleFocusOut(event: FocusEvent) {
    const target = event.target;
    const next = event.relatedTarget;

    if (config.value.closeOnFocusOut !== true || !(target instanceof Node)) {
      return;
    }

    const fromOverlay =
      triggerRef.value?.contains(target) === true ||
      contentRef.value?.contains(target) === true ||
      isInsideNestedLayer(target);

    if (!fromOverlay) {
      return;
    }

    if (!(next instanceof Node) || isInsideOverlay(next)) {
      return;
    }

    requestClose();
  }

  function attachFocusOutListener() {
    removeFocusOutListener?.();
    removeFocusOutListener = null;

    if (
      !hasDocument() ||
      !show.value ||
      config.value.closeOnFocusOut !== true
    ) {
      return;
    }

    document.addEventListener("focusout", handleFocusOut, true);
    removeFocusOutListener = () => {
      document.removeEventListener("focusout", handleFocusOut, true);
    };
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
        if (allowReferenceHiddenClose) {
          requestClose();
        }
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

  /**
   * After a click-away close, moves focus back to the anchor when the pointer
   * did not take it (its pointer down was default-prevented) and it would
   * otherwise stay in the hidden panel or fall to `<body>`.
   */
  function restoreFocusAfterClickAway(
    event: PointerEvent,
    focusWasInside: boolean,
  ) {
    if (!event.defaultPrevented || !focusWasInside) {
      return;
    }

    if (disposed || show.value || !options.restoreFocus) {
      return;
    }

    const active = document.activeElement;

    if (
      !active ||
      active === document.body ||
      contentRef.value?.contains(active)
    ) {
      focusReference();
    }
  }

  /**
   * Closes after a pointer down outside: focus follows the pointer, so the
   * close skips focus restore (see {@link restoreFocusAfterClickAway}).
   */
  function closeFromClickAway(event: PointerEvent) {
    const active = document.activeElement;
    const focusWasInside = Boolean(
      active && contentRef.value?.contains(active),
    );

    // Only this close: if the parent keeps the overlay open, the flag must
    // not linger.
    closedByClickAway = true;

    // A close already requested this tick still ends with this pointer
    // down: keep the marker so focus is left to it.
    if (!requestClose() && !closeRequested) {
      closedByClickAway = false;

      return;
    }

    setTimeout(() => {
      closedByClickAway = false;
      restoreFocusAfterClickAway(event, focusWasInside);
    }, 0);
  }

  function clearDeferredClickAway() {
    removeDeferredListener?.();
    removeDeferredListener = null;

    if (deferredTimeoutId !== null) {
      clearTimeout(deferredTimeoutId);
      deferredTimeoutId = null;
    }
  }

  /**
   * Closes once the press that started on a deferred target ends. The click
   * (if any) runs first, so a menu it opens closes this one itself.
   */
  function deferClickAway(event: PointerEvent) {
    function handlePressEnd() {
      removeDeferredListener?.();
      removeDeferredListener = null;

      deferredTimeoutId = setTimeout(() => {
        deferredTimeoutId = null;
        closeFromClickAway(event);
      }, 0);
    }

    document.addEventListener("pointerup", handlePressEnd, true);
    document.addEventListener("pointercancel", handlePressEnd, true);
    removeDeferredListener = () => {
      document.removeEventListener("pointerup", handlePressEnd, true);
      document.removeEventListener("pointercancel", handlePressEnd, true);
    };
  }

  function attachPointerListener() {
    removePointerListener?.();

    if (!hasDocument() || !show.value) {
      removePointerListener = null;

      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      // A new press decides again: the last deferred one may have ended
      // outside the window, with no pointer up.
      clearDeferredClickAway();

      // Cheap checks first: this runs on every pointer down in the page.
      if (!canClose.value || config.value.closeOnClickAway === false) {
        return;
      }

      if (isInsideOverlay(target)) {
        return;
      }

      if (target instanceof Element && isClickAwayDeferred?.(target)) {
        deferClickAway(event);

        return;
      }

      closeFromClickAway(event);
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
    options.onOpen?.(getOpenerElement());

    if (claimOpen) {
      releaseClaim = claimOpen({
        id,
        requestClose,
        // Only the panel: a menu whose anchor merely holds another trigger
        // (a table row) is not where that other menu opens from.
        contains: isInsidePanel,
        origin: getOpenerElement(),
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
      onEscape: closeFromEscape,
      origin: () => getOpenerElement(),
      container: contentRef.value ?? undefined,
      lockScroll: config.value.disableScrollLock !== true,
    });

    layerStackId.value = stackHandle.id;
    stackZIndex.value = stackHandle.zIndex;
    syncZIndex();
  }

  function restoreFocusIfInside() {
    // A click-away close leaves focus to the pointer (see handlePointerDown).
    if (closedByClickAway) {
      closedByClickAway = false;

      return;
    }

    if (!options.restoreFocus || !hasDocument()) {
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

  /**
   * Closes on Escape (honoring `closeOnEscape` and `persistent`) and moves
   * focus back to the anchor. Returns whether a close was requested. Called
   * by the layer stack when this is the top-most layer, and by
   * {@link handleContentEscape}.
   */
  function closeFromEscape(): boolean {
    if (config.value.closeOnEscape === false || !requestClose()) {
      return false;
    }

    focusReference();

    return true;
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
    clearDeferredClickAway();
    removeFocusOutListener?.();
    removeFocusOutListener = null;
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
      closeRequested = false;

      if (isShown) {
        closedByClickAway = false;
        mounted.value = true;

        // The layer stack is module-global: on the server nothing would
        // release the entry (no unmount), so it is not registered there.
        if (!hasDocument()) {
          return;
        }

        pushLayer();
        attachFocusOutListener();
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

  // Updates the open layer: pushing it again would give it a new id and
  // drop the layers nested in it.
  watch(
    () => config.value.disableScrollLock,
    (disableScrollLock) => {
      stackHandle?.setLockScroll(disableScrollLock !== true);
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
    () => config.value.keepMounted,
    (keepMounted) => {
      if (!keepMounted && !show.value) {
        mounted.value = false;
      }
    },
  );

  watch(
    () => config.value.closeOnFocusOut,
    () => {
      if (show.value) {
        attachFocusOutListener();
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
    closeFromEscape,
    isInsideOverlay,
    isInsideReference,
    handleContentEscape,
    isInsideNestedLayer,
    isHiddenWhileMounted,
  };
}
