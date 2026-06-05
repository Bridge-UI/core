// ** External Imports
import { maxBy, remove } from "es-toolkit/array";
import { get } from "es-toolkit/compat";

// ** Local Imports
import {
  transitionProps,
  type ModalTransition,
} from "@core/Components/Modal/Transition";
import type { LayerId } from "@core/Layer/registry";

export type { LayerId };

/** Base `z-index` for the first layer on the global stack. Each nested layer adds 1. */
export const LAYER_STACK_BASE_Z_INDEX = 50;

type LayerStackEntry = {
  id: LayerId;
  order: number;
  lockScroll?: boolean;
  onEscape?: () => void;
};

const stack: LayerStackEntry[] = [];

const stackListeners = new Set<() => void>();

let nextStackOrder = 0;
let scrollLockCount = 0;
let fallbackIdCounter = 0;
let savedBodyOverflow = "";
let escapeListener: ((event: KeyboardEvent) => void) | null = null;

export type LayerStackHandle = {
  id: LayerId;
  order: number;
  level: number;
  zIndex: number;
  release: () => void;
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
  if (escapeListener || typeof window === "undefined") {
    return;
  }

  escapeListener = handleGlobalEscape;

  window.addEventListener("keydown", escapeListener);
}

/**
 * Detaches the escape listener.
 */
function detachEscapeListener() {
  if (!escapeListener || typeof window === "undefined") {
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
 * Locks the body scroll.
 */
function lockBodyScroll() {
  if (typeof document === "undefined") {
    return;
  }

  scrollLockCount += 1;

  if (scrollLockCount === 1) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
  if (typeof document === "undefined") {
    return;
  }

  scrollLockCount = Math.max(0, scrollLockCount - 1);

  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow;
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
): number {
  if (!hasModalTransition(transition)) {
    return 0;
  }

  return 2;
}

/**
 * Creates a layer id via `crypto.randomUUID()` when available.
 * When `assigned` is provided (e.g. BridgeModalHost), that value is used as-is.
 */
export function createLayerId(assigned?: LayerId): LayerId {
  if (assigned !== undefined && assigned !== "") {
    return assigned;
  }

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  fallbackIdCounter += 1;

  return `layer-${fallbackIdCounter}`;
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
  return transition !== undefined && transition !== "none";
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
    order?: number;
    onEscape?: () => void;
    /**
     * Locks `document.body` overflow while this layer is open.
     *
     * @default true
     */
    lockScroll?: boolean;
  } = {},
): LayerStackHandle {
  const id = createLayerId(options.id);
  const lockScroll = options.lockScroll !== false;
  const order = options.order ?? acquireLayerStackOrder();

  stack.push({
    id,
    order,
    onEscape: options.onEscape,
    lockScroll,
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
    release: () => {
      const entry = stack.find((item) => item.id === id);

      remove(stack, (item) => item.id === id);

      if (entry?.lockScroll !== false) {
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
  fallbackIdCounter = 0;
  savedBodyOverflow = "";

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
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

  if (typeof window === "undefined") {
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
