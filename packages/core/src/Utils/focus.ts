// ** Local Imports
import { hasDocument } from "@core/Utils/env";

/**
 * A handle for the focusable elements inside a container.
 */
export type FocusableHandle = {
  elements: () => HTMLElement[];
  first: () => HTMLElement | undefined;
  focusFirst: () => void;
  focusLast: () => void;
  last: () => HTMLElement | undefined;
  next: () => HTMLElement | undefined;
  previous: () => HTMLElement | undefined;
};

/**
 * Options for the focus trap.
 */
export type FocusTrapOptions = {
  container: HTMLElement;
  disableAutoFocus?: boolean;
  disableEnforceFocus?: boolean;
  disableRestoreFocus?: boolean;
};

/**
 * A focus trap.
 */
export type FocusTrap = {
  release: () => void;
};

/**
 * Checks if an element is focusable.
 */
function isFocusableElement(element: HTMLElement): boolean {
  if (element.hasAttribute("disabled")) {
    return false;
  }

  if (element.tabIndex < 0) {
    return false;
  }

  if (element.getClientRects().length === 0) {
    return false;
  }

  const tag = element.tagName;

  if (tag === "A") {
    return element.hasAttribute("href");
  }

  if (
    tag === "INPUT" ||
    tag === "SELECT" ||
    tag === "TEXTAREA" ||
    tag === "BUTTON"
  ) {
    return true;
  }

  return element.tabIndex >= 0;
}

/**
 * Focus navigation inside a container (Menu lists, Modal panels, etc.).
 */
export function createFocusable(container: HTMLElement): FocusableHandle {
  function elements() {
    return getFocusableElements(container);
  }

  function first() {
    return elements()[0];
  }

  function last() {
    const list = elements();

    return list[list.length - 1];
  }

  function next() {
    const list = elements();

    if (list.length === 0) {
      return undefined;
    }

    const active = hasDocument() ? document.activeElement : null;

    if (active instanceof HTMLElement && container.contains(active)) {
      const index = list.indexOf(active);

      if (index >= 0) {
        return list[(index + 1) % list.length];
      }
    }

    return first();
  }

  function previous() {
    const list = elements();

    if (list.length === 0) {
      return undefined;
    }

    const active = hasDocument() ? document.activeElement : null;

    if (active instanceof HTMLElement && container.contains(active)) {
      const index = list.indexOf(active);

      if (index >= 0) {
        return list[(index - 1 + list.length) % list.length];
      }
    }

    return last();
  }

  return {
    last,
    next,
    first,
    elements,
    previous,
    focusLast() {
      last()?.focus({ preventScroll: true });
    },
    focusFirst() {
      first()?.focus({ preventScroll: true });
    },
  };
}

/**
 * Traps focus inside a container (auto-focus, enforce, restore).
 */
export function createFocusTrap(options: FocusTrapOptions): FocusTrap {
  const previouslyFocused =
    hasDocument() && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  const {
    container,
    disableAutoFocus,
    disableEnforceFocus,
    disableRestoreFocus,
  } = options;

  const focusable = createFocusable(container);

  if (!disableAutoFocus) {
    if (focusable.first()) {
      focusable.focusFirst();
    } else if (!container.hasAttribute("tabindex")) {
      container.tabIndex = -1;
      container.focus({ preventScroll: true });
    }
  }

  let isEnforcingFocus = false;

  function handleFocusIn(event: FocusEvent) {
    if (disableEnforceFocus || !hasDocument() || isEnforcingFocus) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node) || container.contains(target)) {
      return;
    }

    isEnforcingFocus = true;

    try {
      if (focusable.first()) {
        focusable.focusFirst();

        return;
      }

      if (document.activeElement !== container) {
        container.focus({ preventScroll: true });
      }
    } finally {
      isEnforcingFocus = false;
    }
  }

  if (!disableEnforceFocus && hasDocument()) {
    document.addEventListener("focusin", handleFocusIn);
  }

  return {
    release() {
      if (!disableEnforceFocus && hasDocument()) {
        document.removeEventListener("focusin", handleFocusIn);
      }

      if (
        disableRestoreFocus ||
        !previouslyFocused ||
        typeof previouslyFocused.focus !== "function"
      ) {
        return;
      }

      previouslyFocused.focus();
    },
  };
}

/**
 * Returns focusable descendants inside `container` in document order.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  if (!hasDocument()) {
    return [];
  }

  const result: HTMLElement[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (!(node instanceof HTMLElement)) {
        return NodeFilter.FILTER_SKIP;
      }

      return isFocusableElement(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });

  while (walker.nextNode()) {
    result.push(walker.currentNode as HTMLElement);
  }

  return result;
}
