// ** External Imports
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

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
  type PositionHandle,
  type PositionPlacement,
  type PositionStrategy,
} from "@bridge-ui/core/Runtime";

// ** Local Imports
import { resolveAnchorElement, type AnchorElement } from "@/Utils";

/**
 * Element (or ref) that anchors a floating overlay.
 */
export type PopoverBaseAnchor = AnchorElement;

/**
 * Options for {@link usePopoverBase}.
 */
export type UsePopoverBaseOptions = {
  /**
   * Anchor used instead of the trigger wrapper.
   */
  anchorEl?: PopoverBaseAnchor;

  /**
   * When true, positions the element in `arrowRef` against the anchor.
   */
  arrow?: boolean;

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
   * Called once each time the overlay opens, with the element it opened
   * from: the trigger, or the anchor when there is no trigger.
   */
  onOpen?: (reference: null | HTMLElement) => void;

  /**
   * When true, Escape, click-away and reference-hidden do not close.
   */
  persistent?: boolean;

  /**
   * Preferred placement relative to the anchor.
   */
  placement?: PositionPlacement;

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
  show: boolean;

  /**
   * CSS position strategy for the content.
   */
  strategy?: PositionStrategy;
};

/**
 * Popover base: the anchored-panel behavior shared by Popover and Menu
 * (mount state, layer stack for Escape / scroll lock / z-index, positioning,
 * click-away and auto-focus). Roles, ARIA and keyboard navigation stay in
 * the caller.
 */
export function usePopoverBase(options: UsePopoverBaseOptions) {
  const {
    id,
    show,
    arrow,
    offset,
    onOpen,
    setShow,
    anchorEl,
    strategy,
    claimOpen,
    placement,
    matchWidth,
    persistent,
    keepMounted,
    restoreFocus,
    closeOnEscape,
    closeOnFocusOut,
    autoFocusContent,
    closeOnClickAway,
    disableAutoFocus,
    disableScrollLock,
    isClickAwayDeferred,
  } = options;

  const [mounted, setMounted] = useState(show);
  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const arrowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openedRef = useRef(false);
  const layerStackIdRef = useRef("");
  const stackOrderRef = useRef<null | number>(null);
  const allowReferenceHiddenCloseRef = useRef(false);
  const releaseClaimRef = useRef<null | (() => void)>(null);
  const stackHandleRef = useRef<null | LayerStackHandle>(null);
  const positionHandleRef = useRef<null | PositionHandle>(null);

  /**
   * Set when a pointer down outside closed the overlay: focus follows the
   * pointer, so it is not moved back to the anchor.
   */
  const closedByClickAwayRef = useRef(false);

  /**
   * Set once a close is requested, until `show` changes (or the next task, if
   * the parent keeps it open). `show` is only updated after a re-render, so
   * close paths running in the same tick (claim, Escape, click-away…) would
   * otherwise each call `onClose`.
   */
  const closeRequestedRef = useRef(false);

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const isHiddenWhileMounted = Boolean(keepMounted && !show);

  function getReferenceElement(): null | HTMLElement {
    return resolveAnchorElement(anchorEl) ?? triggerRef.current;
  }

  function focusReference() {
    const reference = getReferenceElement();

    if (reference instanceof HTMLElement) {
      reference.focus({ preventScroll: true });
    }
  }

  /**
   * Element the overlay is opened from: its trigger, or the `anchorEl` when
   * it has none. Decides which menu or layer the overlay is nested in.
   */
  function getOpenerElement(): null | HTMLElement {
    return triggerRef.current ?? getReferenceElement();
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

    return triggerRef.current?.contains(target) ?? false;
  }

  /**
   * Whether `target` is inside a layer opened from this overlay (a Popover or
   * Select listbox opened from inside a Menu, for example).
   */
  function isInsideNestedLayer(target: Node) {
    return isInsideNestedLayerOf(target, layerStackIdRef.current);
  }

  /**
   * Whether `target` is in the panel: the content or a layer opened from it.
   */
  function isInsidePanel(target: Node) {
    return (
      contentRef.current?.contains(target) === true ||
      isInsideNestedLayer(target)
    );
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
    if (persistent || !show || closeRequestedRef.current) {
      return false;
    }

    closeRequestedRef.current = true;
    setTimeout(() => {
      closeRequestedRef.current = false;
    }, 0);

    setShow(false);

    return true;
  }

  /**
   * Closes on Escape (honoring `closeOnEscape` and `persistent`) and moves
   * focus back to the anchor. Returns whether a close was requested. Called
   * by the layer stack when this is the top-most layer, and by
   * {@link handleContentEscape}.
   */
  function closeFromEscape(): boolean {
    if (closeOnEscape === false || !requestClose()) {
      return false;
    }

    focusReference();

    return true;
  }

  /**
   * Escape pressed in the content (not in a layer opened from it): closes
   * this overlay here and marks the key handled, so the layer stack does not
   * close the layer below too, nor a layer above that was not opened from
   * this one (a Tooltip). Returns whether the key was handled: not when
   * this overlay stays open.
   */
  function handleContentEscape(event: KeyboardEvent<HTMLElement>): boolean {
    const target = event.target as Node;

    if (event.key !== "Escape" || event.defaultPrevented) {
      return false;
    }

    if (!contentRef.current?.contains(target) || isInsideNestedLayer(target)) {
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
   * Closes when focus leaves the trigger or content (`closeOnFocusOut`):
   * `target` lost focus to `next`. Layers opened from this overlay count as
   * content, so focus leaving a nested overlay for the outside closes this
   * one too. An external `anchorEl` does not count: focus leaving an input
   * that anchors a suggestions panel keeps it open.
   */
  function handleFocusOut(target: EventTarget, next: null | EventTarget) {
    if (closeOnFocusOut !== true || !(target instanceof Node)) {
      return;
    }

    const fromOverlay =
      triggerRef.current?.contains(target) === true ||
      contentRef.current?.contains(target) === true ||
      isInsideNestedLayer(target);

    if (!fromOverlay) {
      return;
    }

    if (!(next instanceof Node) || isInsideOverlay(next)) {
      return;
    }

    requestClose();
  }

  function toggle() {
    if (persistent && show) {
      return;
    }

    setShow(!show);
  }

  function destroyPositionable() {
    allowReferenceHiddenCloseRef.current = false;
    positionHandleRef.current?.destroy();
    positionHandleRef.current = null;
  }

  function syncPositionable() {
    destroyPositionable();

    const reference = getReferenceElement();
    const floating = contentRef.current;

    if (!show || !reference || !floating) {
      return;
    }

    const handle = createPositionable({
      offset,
      floating,
      strategy,
      reference,
      placement,
      matchWidth: matchWidth === true,
      arrow: arrow ? () => arrowRef.current : undefined,
      onReferenceHidden: () => {
        if (allowReferenceHiddenCloseRef.current) {
          latestRef.current.requestClose();
        }
      },
    });

    positionHandleRef.current = handle;
    handle.start();

    queueMicrotask(() => {
      allowReferenceHiddenCloseRef.current = true;
    });
  }

  /**
   * Latest per-render values read by effects that do not re-run on every
   * change (open-menu claim, open callback, auto-focus).
   */
  const latest = {
    show,
    onOpen,
    claimOpen,
    persistent,
    requestClose,
    restoreFocus,
    closeOnEscape,
    isInsidePanel,
    handleFocusOut,
    focusReference,
    closeFromEscape,
    isInsideOverlay,
    closeOnClickAway,
    autoFocusContent,
    getOpenerElement,
    disableScrollLock,
    isClickAwayDeferred,
    getReferenceElement,
  };

  const latestRef = useRef(latest);

  useLayoutEffect(() => {
    latestRef.current = latest;
  });

  function releaseClaim() {
    releaseClaimRef.current?.();
    releaseClaimRef.current = null;
  }

  useLayoutEffect(() => {
    if (show) {
      setMounted(true);

      closedByClickAwayRef.current = false;
      closeRequestedRef.current = false;

      if (!openedRef.current) {
        openedRef.current = true;
        latestRef.current.onOpen?.(getOpenerElement());
      }

      return;
    }

    openedRef.current = false;
    closeRequestedRef.current = false;

    if (!keepMounted) {
      setMounted(false);
    }
  }, [show, keepMounted]);

  /**
   * Open-menu claim, held for the whole open. Kept apart from the mount
   * effect so a prop change while open (`keepMounted`) does not release and
   * claim again, which would close the menus nested in this one.
   */
  useLayoutEffect(() => {
    if (!show || !latestRef.current.claimOpen) {
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      const claimOpen = latestRef.current.claimOpen;

      if (cancelled || !claimOpen) {
        return;
      }

      releaseClaimRef.current = claimOpen({
        id,
        origin: latestRef.current.getOpenerElement(),
        requestClose: () => {
          latestRef.current.requestClose();
        },
        // Only the panel: a menu whose anchor merely holds another trigger
        // (a table row) is not where that other menu opens from.
        contains: (node) => {
          return latestRef.current.isInsidePanel(node);
        },
      });
    });

    return () => {
      cancelled = true;
      releaseClaim();
    };
  }, [show, id]);

  useLayoutEffect(() => {
    if (show) {
      return;
    }

    // A click-away close leaves focus to the pointer (see handlePointerDown).
    if (closedByClickAwayRef.current) {
      closedByClickAwayRef.current = false;

      return;
    }

    if (!restoreFocus) {
      return;
    }

    const content = contentRef.current;
    const active = document.activeElement;

    if (content && active && content.contains(active)) {
      focusReference();
    }
  }, [show, restoreFocus]);

  useLayoutEffect(() => {
    if (!show || !mounted) {
      destroyPositionable();

      return;
    }

    syncPositionable();

    return () => {
      destroyPositionable();
    };
  }, [show, arrow, offset, mounted, anchorEl, strategy, placement, matchWidth]);

  useLayoutEffect(() => {
    if (!show || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(LAYER_STACK_BASE_Z_INDEX);

      return;
    }

    const handle = pushLayerStack({
      order: stackOrderRef.current,
      container: contentRef.current ?? undefined,
      origin: () => latestRef.current.getOpenerElement(),
      lockScroll: latestRef.current.disableScrollLock !== true,
      onEscape: () => {
        latestRef.current.closeFromEscape();
      },
    });

    stackHandleRef.current = handle;
    layerStackIdRef.current = handle.id;
    setStackZIndex((previous) => {
      return previous === handle.zIndex ? previous : handle.zIndex;
    });

    return () => {
      handle.release();
      stackHandleRef.current = null;
      layerStackIdRef.current = "";
    };
  }, [show]);

  /**
   * `disableScrollLock` changes update the open layer: pushing it again would
   * give it a new id and drop the layers nested in it.
   */
  useLayoutEffect(() => {
    stackHandleRef.current?.setLockScroll(disableScrollLock !== true);
  }, [disableScrollLock]);

  useLayoutEffect(() => {
    if (!show || !mounted) {
      return;
    }

    stackHandleRef.current?.setContainer(contentRef.current);

    const content = contentRef.current;

    if (disableAutoFocus || !content) {
      return;
    }

    const focusable = createFocusable(content);

    if (focusable.first()) {
      focusable.focusFirst();

      return;
    }

    if (latestRef.current.autoFocusContent) {
      content.focus({ preventScroll: true });
    }
  }, [show, mounted, disableAutoFocus]);

  useEffect(() => {
    if (!show) {
      return;
    }

    function syncZIndex() {
      const snapshot = getLayerStackEntry(layerStackIdRef.current);

      if (!snapshot) {
        return;
      }

      setStackZIndex((previous) => {
        return previous === snapshot.zIndex ? previous : snapshot.zIndex;
      });
    }

    syncZIndex();

    return subscribeLayerStack(syncZIndex);
  }, [show]);

  useEffect(() => {
    if (!show || closeOnFocusOut !== true) {
      return;
    }

    function handleDocumentFocusOut(event: FocusEvent) {
      latestRef.current.handleFocusOut(
        event.target as EventTarget,
        event.relatedTarget,
      );
    }

    document.addEventListener("focusout", handleDocumentFocusOut, true);

    return () => {
      document.removeEventListener("focusout", handleDocumentFocusOut, true);
    };
  }, [show, closeOnFocusOut]);

  /**
   * After a click-away close, moves focus back to the anchor when the pointer
   * did not take it (its pointer down was default-prevented) and it would
   * otherwise stay in the hidden panel or fall to `<body>`.
   */
  function restoreFocusAfterClickAway(
    event: PointerEvent,
    focusWasInside: boolean,
  ) {
    const latest = latestRef.current;

    if (!event.defaultPrevented || !focusWasInside) {
      return;
    }

    if (latest.show || !latest.restoreFocus) {
      return;
    }

    const active = document.activeElement;

    if (
      !active ||
      active === document.body ||
      contentRef.current?.contains(active)
    ) {
      latest.focusReference();
    }
  }

  /**
   * Closes after a pointer down outside: focus follows the pointer, so the
   * close skips focus restore (see {@link restoreFocusAfterClickAway}).
   */
  function closeFromClickAway(event: PointerEvent) {
    const active = document.activeElement;
    const focusWasInside = Boolean(
      active && contentRef.current?.contains(active),
    );

    // Only this close: if the parent keeps the overlay open, the flag must
    // not linger.
    closedByClickAwayRef.current = true;

    // A close already requested this tick still ends with this pointer
    // down: keep the marker so focus is left to it.
    if (!latestRef.current.requestClose() && !closeRequestedRef.current) {
      closedByClickAwayRef.current = false;

      return;
    }

    setTimeout(() => {
      closedByClickAwayRef.current = false;
      restoreFocusAfterClickAway(event, focusWasInside);
    }, 0);
  }

  useEffect(() => {
    if (!show) {
      return;
    }

    let removePointerListener: null | (() => void) = null;

    let removeDeferredListener: null | (() => void) = null;

    let deferredTimeoutId: null | ReturnType<typeof setTimeout> = null;

    /**
     * Drops a pending deferred close: a new press decides again (the last
     * one may have ended outside the window, with no pointer up).
     */
    function clearDeferredClickAway() {
      removeDeferredListener?.();
      removeDeferredListener = null;

      if (deferredTimeoutId !== null) {
        clearTimeout(deferredTimeoutId);
        deferredTimeoutId = null;
      }
    }

    /**
     * Closes once the press that started on a deferred target ends. The
     * click (if any) runs first, so a menu it opens closes this one itself.
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

    const frameId = requestAnimationFrame(() => {
      function handlePointerDown(event: PointerEvent) {
        const latest = latestRef.current;
        const target = event.target as Node;

        clearDeferredClickAway();

        // Cheap checks first: this runs on every pointer down in the page.
        if (latest.persistent || latest.closeOnClickAway === false) {
          return;
        }

        if (latest.isInsideOverlay(target)) {
          return;
        }

        if (target instanceof Element && latest.isClickAwayDeferred?.(target)) {
          deferClickAway(event);

          return;
        }

        closeFromClickAway(event);
      }

      document.addEventListener("pointerdown", handlePointerDown, true);
      removePointerListener = () => {
        document.removeEventListener("pointerdown", handlePointerDown, true);
      };
    });

    return () => {
      cancelAnimationFrame(frameId);
      removePointerListener?.();
      clearDeferredClickAway();
    };
  }, [show]);

  return {
    toggle,
    mounted,
    arrowRef,
    triggerRef,
    contentRef,
    stackZIndex,
    requestClose,
    focusReference,
    closeFromEscape,
    isInsideOverlay,
    isInsideReference,
    handleContentEscape,
    isInsideNestedLayer,
    isHiddenWhileMounted,
  };
}
