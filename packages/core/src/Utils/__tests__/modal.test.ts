// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  createLayerId,
  getModalStackEntry,
  getModalStackSnapshot,
  isModalStackTop,
  MODAL_STACK_BASE_Z_INDEX,
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

test("pushModalStack should use string ids", () => {
  const handle = pushModalStack();

  expect(typeof handle.id).toBe("string");
  expect(handle.id.length).toBeGreaterThan(0);
});

test("createLayerId should generate unique ids", () => {
  const first = createLayerId();
  const second = createLayerId();

  expect(typeof first).toBe("string");
  expect(first.length).toBeGreaterThan(0);
  expect(second).not.toBe(first);
});

test("createLayerId should use assigned id when provided", () => {
  expect(createLayerId("host-assigned-id")).toBe("host-assigned-id");
});

test("pushModalStack should use pre-assigned id", () => {
  const handle = pushModalStack({ id: "fixed-stack-id" });

  expect(handle.id).toBe("fixed-stack-id");
  expect(getModalStackEntry("fixed-stack-id")?.id).toBe("fixed-stack-id");

  handle.release();
});

test("getModalStackSnapshot should list open modals", () => {
  const outer = pushModalStack({ order: 1 });
  const inner = pushModalStack({ order: 2 });

  expect(getModalStackSnapshot()).toEqual([
    {
      id: outer.id,
      order: 1,
      zIndex: MODAL_STACK_BASE_Z_INDEX,
    },
    {
      id: inner.id,
      order: 2,
      zIndex: MODAL_STACK_BASE_Z_INDEX + 1,
    },
  ]);

  expect(getModalStackEntry(outer.id)?.id).toBe(outer.id);
  expect(getModalStackEntry(inner.id)?.id).toBe(inner.id);

  inner.release();
  outer.release();
});

test("getModalStackEntry should rank z-index by order not push order", () => {
  const later = pushModalStack({ order: 2 });
  const earlier = pushModalStack({ order: 1 });

  expect(getModalStackEntry(later.id)?.zIndex).toBe(
    MODAL_STACK_BASE_Z_INDEX + 1,
  );
  expect(getModalStackEntry(earlier.id)?.zIndex).toBe(MODAL_STACK_BASE_Z_INDEX);

  later.release();
  earlier.release();
});
