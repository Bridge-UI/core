/** Base `z-index` for the first modal layer. Each nested modal adds 1. */
export const MODAL_STACK_BASE_Z_INDEX = 50;

type ModalStackEntry = {
  id: symbol;
  order: number;
  onEscape?: () => void;
};

const stack: ModalStackEntry[] = [];

let nextStackOrder = 0;
let scrollLockCount = 0;
let savedBodyOverflow = "";
let escapeListener: ((event: KeyboardEvent) => void) | null = null;

export type ModalStackHandle = {
  id: symbol;
  order: number;
  level: number;
  zIndex: number;
  release: () => void;
};

/**
 * Assigns a monotonic open order (parent render runs before child).
 */
export function acquireModalStackOrder(): number {
  nextStackOrder += 1;

  return nextStackOrder;
}

/**
 * Gets the topmost modal stack entry.
 */
function getTopStackEntry(): ModalStackEntry | undefined {
  if (stack.length === 0) {
    return undefined;
  }

  return stack.reduce((top, entry) => {
    return entry.order > top.order ? entry : top;
  });
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
 * Registers a modal on the global stack (scroll lock + escape routing).
 * Pass `order` from {@link acquireModalStackOrder} during render so parent/child
 * stacking matches visual order. Call `release()` when the modal closes.
 */
export function pushModalStack(
  options: {
    order?: number;
    onEscape?: () => void;
  } = {},
): ModalStackHandle {
  const id = Symbol("bridge-ui-modal-stack");
  const order = options.order ?? acquireModalStackOrder();
  const level = stack.length;

  stack.push({
    id,
    order,
    onEscape: options.onEscape,
  });

  lockBodyScroll();
  attachEscapeListener();

  return {
    id,
    order,
    level,
    zIndex: MODAL_STACK_BASE_Z_INDEX + order - 1,
    release: () => {
      const index = stack.findIndex((entry) => entry.id === id);

      if (index !== -1) {
        stack.splice(index, 1);
      }

      unlockBodyScroll();

      if (stack.length === 0) {
        detachEscapeListener();
      }
    },
  };
}

/**
 * Whether the given handle is the topmost modal on the stack.
 */
export function isModalStackTop(id: symbol): boolean {
  const top = getTopStackEntry();

  return top?.id === id;
}

/**
 * Resets stack state. For tests only.
 */
export function resetModalStackForTests() {
  stack.length = 0;
  nextStackOrder = 0;
  scrollLockCount = 0;
  savedBodyOverflow = "";

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }

  detachEscapeListener();
}
