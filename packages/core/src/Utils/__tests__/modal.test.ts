// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  MODAL_STACK_BASE_Z_INDEX,
  isModalStackTop,
  pushModalStack,
  resetModalStackForTests,
} from "@core/Utils/modal";

afterEach(() => {
  resetModalStackForTests();
});

test("pushModalStack should increment z-index per level", () => {
  const outer = pushModalStack();
  const inner = pushModalStack();

  expect(outer.level).toBe(0);
  expect(inner.level).toBe(1);
  expect(outer.zIndex).toBe(MODAL_STACK_BASE_Z_INDEX);
  expect(inner.zIndex).toBe(MODAL_STACK_BASE_Z_INDEX + 1);
});

test("pushModalStack should ref-count body scroll lock", () => {
  const outer = pushModalStack();

  expect(document.body.style.overflow).toBe("hidden");

  const inner = pushModalStack();

  inner.release();

  expect(document.body.style.overflow).toBe("hidden");

  outer.release();

  expect(document.body.style.overflow).toBe("");
});

test("escape should invoke only the topmost modal handler", () => {
  const outerEscape = vi.fn();
  const innerEscape = vi.fn();

  pushModalStack({ order: 1, onEscape: outerEscape });
  pushModalStack({ order: 2, onEscape: innerEscape });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(innerEscape).toHaveBeenCalledOnce();
  expect(outerEscape).not.toHaveBeenCalled();
});

test("isModalStackTop should reflect highest open order", () => {
  const outer = pushModalStack({ order: 1 });
  const inner = pushModalStack({ order: 2 });

  expect(isModalStackTop(outer.id)).toBe(false);
  expect(isModalStackTop(inner.id)).toBe(true);

  inner.release();

  expect(isModalStackTop(outer.id)).toBe(true);
});
