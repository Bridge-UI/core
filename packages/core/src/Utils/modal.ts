// ** External Imports
import { maxBy, remove } from "es-toolkit/array";
import { get, isNil } from "es-toolkit/compat";

// ** Local Imports
import {
  transitionProps,
  type ModalTransition,
} from "@core/Components/Modal/Transition";
import {
  createLayerId,
  resetLayerIdCounterForTests,
} from "@core/Layer/registry";
import type { LayerId } from "@core/Layer/types";
import { hasDocument, hasWindow } from "@core/Utils/env";
import { resetOpenMenuLayersForTests } from "@core/Utils/menu";

export { createLayerId };
export type { LayerId };

/** Base `z-index` for the first layer on the global stack. Each nested layer adds 1. */
export const LAYER_STACK_BASE_Z_INDEX = 50;

type LayerStackEntry = {
  id: LayerId;
  lockScroll?: boolean;
  onEscape?: () => void;
  order: number;
  scrollLockReleased?: boolean;
};

const stack: LayerStackEntry[] = [];

const stackListeners = new Set<() => void>();

let nextStackOrder = 0;
let scrollLockCount = 0;
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";
let escapeListener: ((event: KeyboardEvent) => void) | null = null;

export type LayerStackHandle = {
  id: LayerId;
  level: number;
  order: number;
  release: () => void;
  releaseScrollLock: () => void;
  zIndex: number;
};

export type LayerStackSnapshotEntry = {
  id: LayerId;
  order: number;
  zIndex: number;
};

function notifyLayerStackListeners() {
  stackListeners.forEach((listener) => listener());
}

/**
 * Subscribes to global layer-stack changes (push / release). Use to refresh live
 * `zIndex` when a sibling layer closes and rank shifts.
 */
export function subscribeLayerStack(listener: () => void): () => void {
  stackListeners.add(listener);

  return () => {
    stackListeners.delete(listener);
  };
}

/**
 * Attaches the escape listener.
 */
function attachEscapeListener() {
  if (escapeListener || !hasWindow()) {
    return;
  }

  escapeListener = handleGlobalEscape;

  window.addEventListener("keydown", escapeListener);
}

/**
 * Detaches the escape listener.
 */
function detachEscapeListener() {
  if (!escapeListener || !hasWindow()) {
    return;
  }

  window.removeEventListener("keydown", escapeListener);

  escapeListener = null;
}

/**
 * Gets the topmost layer stack entry.
 */
function getTopStackEntry(): LayerStackEntry | undefined {
  return maxBy(stack, (entry) => entry.order);
}

/**
 * Handles the global escape key.
 */
function handleGlobalEscape(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    return;
  }

  const top = getTopStackEntry();

  if (!top?.onEscape) {
    return;
  }

  event.preventDefault();

  top.onEscape();
}

/**
 * Locks the body scroll and compensates layout shift when the scrollbar is hidden.
 */
function lockBodyScroll() {
  if (!hasDocument()) {
    return;
  }

  scrollLockCount += 1;

  if (scrollLockCount === 1) {
    const body = document.body;

    savedBodyOverflow = body.style.overflow;
    savedBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = getScrollbarWidth();

    if (scrollbarWidth > 0) {
      const computedPaddingRight =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }

    body.style.overflow = "hidden";
  }
}

/**
 * Rank of an entry among open layers sorted by `order` (used for `level` / `zIndex`).
 */
function getLayerStackOrderRank(id: LayerId): number {
  const sorted = [...stack].sort((left, right) => left.order - right.order);

  const rank = sorted.findIndex((entry) => entry.id === id);

  return rank < 0 ? 0 : rank;
}

/**
 * Width of the vertical scrollbar when the page overflows (0 when none is shown).
 */
function getScrollbarWidth(): number {
  if (!hasWindow() || !hasDocument()) {
    return 0;
  }

  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

/**
 * Restores body scroll for a layer without removing it from the stack.
 */
function releaseLayerScrollLock(id: LayerId) {
  const entry = stack.find((item) => item.id === id);

  if (!entry || entry.scrollLockReleased || entry.lockScroll === false) {
    return;
  }

  entry.scrollLockReleased = true;
  unlockBodyScroll();
}

/**
 * Maps a stack entry to a public snapshot shape.
 */
function toStackSnapshotEntry(entry: LayerStackEntry): LayerStackSnapshotEntry {
  const rank = getLayerStackOrderRank(entry.id);

  return {
    id: entry.id,
    order: entry.order,
    zIndex: LAYER_STACK_BASE_Z_INDEX + rank,
  };
}

/**
 * Unlocks the body scroll.
 */
function unlockBodyScroll() {
  if (!hasDocument()) {
    return;
  }

  scrollLockCount = Math.max(0, scrollLockCount - 1);

  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.paddingRight = savedBodyPaddingRight;
    savedBodyPaddingRight = "";
  }
}

/**
 * Assigns a monotonic open order (parent render runs before child).
 */
export function acquireLayerStackOrder(): number {
  nextStackOrder += 1;

  return nextStackOrder;
}

/** How many layers fire `transitionend` on leave (overlay + panel when animated). */
export function countModalTransitionLayers(
  transition: keyof ModalTransition,
  options: { hideBackdrop?: boolean } = {},
): number {
  if (!hasModalTransition(transition)) {
    return 0;
  }

  return options.hideBackdrop ? 1 : 2;
}

export function getModalOverlayTransitionClass(
  transition: keyof ModalTransition,
): string {
  return get(transitionProps, [transition, "overlay"], "");
}

export function getModalPanelTransitionClass(
  transition: keyof ModalTransition,
): string {
  return get(transitionProps, [transition, "panel"], "");
}

/**
 * Looks up a stack entry by id (live `zIndex` rank).
 */
export function getLayerStackEntry(
  id: LayerId,
): LayerStackSnapshotEntry | undefined {
  const entry = stack.find((item) => item.id === id);

  if (!entry) {
    return undefined;
  }

  return toStackSnapshotEntry(entry);
}

/**
 * Returns a read-only snapshot of open layers (for imperative APIs / debugging).
 */
export function getLayerStackSnapshot(): readonly LayerStackSnapshotEntry[] {
  return stack.map(toStackSnapshotEntry);
}

export function hasModalTransition(
  transition: keyof ModalTransition | undefined,
): boolean {
  return !isNil(transition) && transition !== "none";
}

/**
 * Whether the given handle is the topmost layer on the stack.
 */
export function isLayerStackTop(id: LayerId): boolean {
  const top = getTopStackEntry();

  return top?.id === id;
}

/**
 * Registers a layer on the global stack (scroll lock + escape routing).
 * Pass `order` from {@link acquireLayerStackOrder} during render so parent/child
 * stacking matches visual order. Call `release()` when the layer closes.
 */
export function pushLayerStack(
  options: {
    id?: LayerId;
    lockScroll?: boolean;
    onEscape?: () => void;
    order?: number;
  } = {},
): LayerStackHandle {
  const id = createLayerId(options.id);
  const lockScroll = options.lockScroll !== false;
  const order = options.order ?? acquireLayerStackOrder();

  stack.push({
    id,
    order,
    lockScroll,
    onEscape: options.onEscape,
  });

  const level = getLayerStackOrderRank(id);

  if (lockScroll) {
    lockBodyScroll();
  }

  attachEscapeListener();
  notifyLayerStackListeners();

  return {
    id,
    order,
    level,
    zIndex: LAYER_STACK_BASE_Z_INDEX + level,
    releaseScrollLock: () => {
      releaseLayerScrollLock(id);
    },
    release: () => {
      const entry = stack.find((item) => item.id === id);

      remove(stack, (item) => item.id === id);

      if (entry?.lockScroll !== false && !entry?.scrollLockReleased) {
        unlockBodyScroll();
      }

      if (stack.length === 0) {
        detachEscapeListener();
      }

      notifyLayerStackListeners();
    },
  };
}

/**
 * Resets stack state. For tests only.
 */
export function resetLayerStackForTests() {
  stack.length = 0;
  nextStackOrder = 0;
  scrollLockCount = 0;
  savedBodyOverflow = "";
  savedBodyPaddingRight = "";
  resetLayerIdCounterForTests();
  resetOpenMenuLayersForTests();

  if (hasDocument()) {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  detachEscapeListener();
  notifyLayerStackListeners();
}

/**
 * Respects `prefers-reduced-motion` in the browser; returns `none` when reduced motion is preferred.
 */
export function resolveEffectiveModalTransition(
  transition: keyof ModalTransition,
): keyof ModalTransition {
  if (transition === "none") {
    return "none";
  }

  if (!hasWindow()) {
    return transition;
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "none";
    }
  } catch {
    // ignore matchMedia errors (older environments)
  }

  return transition;
}
