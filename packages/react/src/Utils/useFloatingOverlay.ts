// ** External Imports
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

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

/**
 * Element (or ref) that anchors a floating overlay.
 */
export type FloatingOverlayAnchor =
  null | HTMLElement | RefObject<null | HTMLElement>;

/**
 * Options for {@link useFloatingOverlay}.
 */
export type UseFloatingOverlayOptions = {
  /**
   * Anchor used instead of the trigger wrapper.
   */
  anchorEl?: FloatingOverlayAnchor;

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
  claimOpen?: (claim: { id: string; requestClose: () => void }) => () => void;

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
   * Stable id for the overlay (used for the open-menu claim).
   */
  id: string;

  /**
   * Extra click-away targets that must not close the overlay.
   */
  isClickAwayIgnored?: (target: Element) => boolean;

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
   * Called once each time the overlay opens.
   */
  onOpen?: () => void;

  /**
   * When true, Escape, click-away and reference-hidden do not close.
   */
  persistent?: boolean;

  /**
   * Preferred placement relative to the anchor.
   */
  placement?: PositionPlacement;

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
 * Shared floating-overlay behavior for anchored panels (Menu, Popover):
 * mount state, layer stack (Escape, scroll lock, z-index), positioning,
 * click-away and auto-focus. Roles and keyboard navigation stay in the caller.
 */
export function useFloatingOverlay(options: UseFloatingOverlayOptions) {
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
    closeOnEscape,
    autoFocusContent,
    closeOnClickAway,
    disableAutoFocus,
    disableScrollLock,
    isClickAwayIgnored,
  } = options;

  const [mounted, setMounted] = useState(show);

  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const triggerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const arrowRef = useRef<HTMLDivElement>(null);

  const layerStackIdRef = useRef("");

  const stackOrderRef = useRef<null | number>(null);

  const stackHandleRef = useRef<null | LayerStackHandle>(null);

  const positionHandleRef = useRef<null | PositionHandle>(null);

  const releaseClaimRef = useRef<null | (() => void)>(null);

  const allowReferenceHiddenCloseRef = useRef(false);

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && !mounted && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const isHiddenWhileMounted = Boolean(keepMounted && !show);

  function getReferenceElement(): null | HTMLElement {
    if (anchorEl instanceof HTMLElement) {
      return anchorEl;
    }

    if (anchorEl && "current" in anchorEl) {
      return anchorEl.current;
    }

    return triggerRef.current;
  }

  function focusReference() {
    const reference = getReferenceElement();

    if (reference instanceof HTMLElement) {
      reference.focus({ preventScroll: true });
    }
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

    if (contentRef.current?.contains(target)) {
      return true;
    }

    return isFocusInHigherLayer(target, layerStackIdRef.current);
  }

  function requestClose() {
    if (persistent || !show) {
      return;
    }

    setShow(false);
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
        if (!allowReferenceHiddenCloseRef.current || persistent || !show) {
          return;
        }

        requestClose();
      },
    });

    positionHandleRef.current = handle;
    handle.start();

    queueMicrotask(() => {
      allowReferenceHiddenCloseRef.current = true;
    });
  }

  useLayoutEffect(() => {
    if (show) {
      setMounted(true);
      onOpen?.();

      if (!claimOpen) {
        return;
      }

      let cancelled = false;

      queueMicrotask(() => {
        if (cancelled || !show) {
          return;
        }

        releaseClaimRef.current = claimOpen({ id, requestClose });
      });

      return () => {
        cancelled = true;
      };
    }

    releaseClaimRef.current?.();
    releaseClaimRef.current = null;

    if (!keepMounted) {
      setMounted(false);
    }
  }, [show, id, keepMounted]);

  useLayoutEffect(() => {
    if (!show || !mounted) {
      destroyPositionable();

      return;
    }

    syncPositionable();

    return () => {
      destroyPositionable();
    };
  }, [
    show,
    arrow,
    offset,
    mounted,
    anchorEl,
    strategy,
    placement,
    matchWidth,
    persistent,
  ]);

  useLayoutEffect(() => {
    if (!show || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(LAYER_STACK_BASE_Z_INDEX);

      return;
    }

    function handleEscape() {
      if (!show || closeOnEscape === false || persistent) {
        return;
      }

      requestClose();
      focusReference();
    }

    const handle = pushLayerStack({
      onEscape: handleEscape,
      order: stackOrderRef.current,
      lockScroll: disableScrollLock !== true,
      container: contentRef.current ?? undefined,
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
  }, [show, persistent, closeOnEscape, disableScrollLock]);

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

    if (autoFocusContent) {
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
    if (!show) {
      return;
    }

    let removePointerListener: null | (() => void) = null;

    const frameId = requestAnimationFrame(() => {
      function handlePointerDown(event: PointerEvent) {
        const target = event.target as Node;

        if (isInsideOverlay(target)) {
          return;
        }

        if (closeOnClickAway === false || persistent) {
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
    });

    return () => {
      cancelAnimationFrame(frameId);
      removePointerListener?.();
    };
  }, [show, anchorEl, persistent, closeOnClickAway]);

  return {
    toggle,
    mounted,
    arrowRef,
    triggerRef,
    contentRef,
    stackZIndex,
    requestClose,
    focusReference,
    isInsideOverlay,
    isInsideReference,
    isHiddenWhileMounted,
  };
}
