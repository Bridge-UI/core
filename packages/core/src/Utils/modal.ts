// ** External Imports
import { maxBy, remove } from "es-toolkit/array";
import { get } from "es-toolkit/compat";

// ** Local Imports
import {
  transitionProps,
  type ModalTransition,
} from "@core/Components/Modal/Transition";

/** Base `z-index` for the first modal layer. Each nested modal adds 1. */
export const MODAL_STACK_BASE_Z_INDEX = 50;

export type ModalStackId = string;

type ModalStackEntry = {
  id: ModalStackId;
  order: number;
  onEscape?: () => void;
};

const stack: ModalStackEntry[] = [];

let nextStackOrder = 0;
let scrollLockCount = 0;
let fallbackIdCounter = 0;
let savedBodyOverflow = "";
let escapeListener: ((event: KeyboardEvent) => void) | null = null;

export type ModalStackHandle = {
  id: ModalStackId;
  order: number;
  level: number;
  zIndex: number;
  release: () => void;
};

export type ModalStackSnapshotEntry = {
  id: ModalStackId;
  order: number;
  zIndex: number;
};

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
 * Gets the topmost modal stack entry.
 */
function getTopStackEntry(): ModalStackEntry | undefined {
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
 * Rank of an entry among open modals sorted by `order` (used for `level` / `zIndex`).
 */
function getModalStackOrderRank(id: ModalStackId): number {
  const sorted = [...stack].sort((left, right) => left.order - right.order);

  const rank = sorted.findIndex((entry) => entry.id === id);

  return rank < 0 ? 0 : rank;
}

/**
 * Maps a stack entry to a public snapshot shape.
 */
function toStackSnapshotEntry(entry: ModalStackEntry): ModalStackSnapshotEntry {
  const rank = getModalStackOrderRank(entry.id);

  return {
    id: entry.id,
    order: entry.order,
    zIndex: MODAL_STACK_BASE_Z_INDEX + rank,
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
export function acquireModalStackOrder(): number {
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
 * Creates a modal stack id via `crypto.randomUUID()` when available.
 * When `assigned` is provided (e.g. BridgeModalHost), that value is used as-is.
 */
export function createModalStackId(assigned?: ModalStackId): ModalStackId {
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

  return `modal-${fallbackIdCounter}`;
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
 * Looks up a stack entry by id.
 */
export function getModalStackEntry(
  id: ModalStackId,
): ModalStackSnapshotEntry | undefined {
  const entry = stack.find((item) => item.id === id);

  if (!entry) {
    return undefined;
  }

  return toStackSnapshotEntry(entry);
}

/**
 * Returns a read-only snapshot of open modals (for imperative APIs / debugging).
 */
export function getModalStackSnapshot(): readonly ModalStackSnapshotEntry[] {
  return stack.map(toStackSnapshotEntry);
}

export function hasModalTransition(
  transition: keyof ModalTransition | undefined,
): boolean {
  return transition !== undefined && transition !== "none";
}

/**
 * Whether the given handle is the topmost modal on the stack.
 */
export function isModalStackTop(id: ModalStackId): boolean {
  const top = getTopStackEntry();

  return top?.id === id;
}

/**
 * Registers a modal on the global stack (scroll lock + escape routing).
 * Pass `order` from {@link acquireModalStackOrder} during render so parent/child
 * stacking matches visual order. Call `release()` when the modal closes.
 */
export function pushModalStack(
  options: {
    id?: ModalStackId;
    order?: number;
    onEscape?: () => void;
  } = {},
): ModalStackHandle {
  const id = createModalStackId(options.id);
  const order = options.order ?? acquireModalStackOrder();

  stack.push({
    id,
    order,
    onEscape: options.onEscape,
  });

  const level = getModalStackOrderRank(id);

  lockBodyScroll();
  attachEscapeListener();

  return {
    id,
    order,
    level,
    zIndex: MODAL_STACK_BASE_Z_INDEX + level,
    release: () => {
      remove(stack, (entry) => entry.id === id);

      unlockBodyScroll();

      if (stack.length === 0) {
        detachEscapeListener();
      }
    },
  };
}

/**
 * Resets stack state. For tests only.
 */
export function resetModalStackForTests() {
  stack.length = 0;
  nextStackOrder = 0;
  scrollLockCount = 0;
  fallbackIdCounter = 0;
  savedBodyOverflow = "";

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }

  detachEscapeListener();
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
