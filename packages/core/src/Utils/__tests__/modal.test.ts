// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  createLayerId,
  getLayerStackEntry,
  getLayerStackSnapshot,
  isLayerStackTop,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  resetLayerStackForTests,
  subscribeLayerStack,
} from "@core/Utils/modal";

afterEach(() => {
  resetLayerStackForTests();
});

test("pushLayerStack should increment z-index per level", () => {
  const outer = pushLayerStack();
  const inner = pushLayerStack();

  expect(outer.level).toBe(0);
  expect(inner.level).toBe(1);
  expect(outer.zIndex).toBe(LAYER_STACK_BASE_Z_INDEX);
  expect(inner.zIndex).toBe(LAYER_STACK_BASE_Z_INDEX + 1);
});

test("pushLayerStack should skip scroll lock when lockScroll is false", () => {
  const handle = pushLayerStack({ lockScroll: false });

  expect(document.body.style.overflow).not.toBe("hidden");

  handle.release();
});

test("pushLayerStack should ref-count body scroll lock", () => {
  const outer = pushLayerStack();

  expect(document.body.style.overflow).toBe("hidden");

  const inner = pushLayerStack();

  inner.release();

  expect(document.body.style.overflow).toBe("hidden");

  outer.release();

  expect(document.body.style.overflow).toBe("");
});

test("escape should invoke only the topmost modal handler", () => {
  const outerEscape = vi.fn();
  const innerEscape = vi.fn();

  pushLayerStack({ order: 1, onEscape: outerEscape });
  pushLayerStack({ order: 2, onEscape: innerEscape });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(innerEscape).toHaveBeenCalledOnce();
  expect(outerEscape).not.toHaveBeenCalled();
});

test("isLayerStackTop should reflect highest open order", () => {
  const outer = pushLayerStack({ order: 1 });
  const inner = pushLayerStack({ order: 2 });

  expect(isLayerStackTop(outer.id)).toBe(false);
  expect(isLayerStackTop(inner.id)).toBe(true);

  inner.release();

  expect(isLayerStackTop(outer.id)).toBe(true);
});

test("pushLayerStack should use string ids", () => {
  const handle = pushLayerStack();

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

test("pushLayerStack should use pre-assigned id", () => {
  const handle = pushLayerStack({ id: "fixed-stack-id" });

  expect(handle.id).toBe("fixed-stack-id");
  expect(getLayerStackEntry("fixed-stack-id")?.id).toBe("fixed-stack-id");

  handle.release();
});

test("getLayerStackSnapshot should list open modals", () => {
  const outer = pushLayerStack({ order: 1 });
  const inner = pushLayerStack({ order: 2 });

  expect(getLayerStackSnapshot()).toEqual([
    {
      order: 1,
      id: outer.id,
      zIndex: LAYER_STACK_BASE_Z_INDEX,
    },
    {
      order: 2,
      id: inner.id,
      zIndex: LAYER_STACK_BASE_Z_INDEX + 1,
    },
  ]);

  expect(getLayerStackEntry(outer.id)?.id).toBe(outer.id);
  expect(getLayerStackEntry(inner.id)?.id).toBe(inner.id);

  inner.release();
  outer.release();
});

test("subscribeLayerStack should notify on push and release", () => {
  const listener = vi.fn();

  const unsubscribe = subscribeLayerStack(listener);

  const handle = pushLayerStack();

  expect(listener).toHaveBeenCalledTimes(1);

  handle.release();

  expect(listener).toHaveBeenCalledTimes(2);

  unsubscribe();
});

test("getLayerStackEntry should rank z-index by order not push order", () => {
  const later = pushLayerStack({ order: 2 });
  const earlier = pushLayerStack({ order: 1 });

  expect(getLayerStackEntry(later.id)?.zIndex).toBe(
    LAYER_STACK_BASE_Z_INDEX + 1,
  );
  expect(getLayerStackEntry(earlier.id)?.zIndex).toBe(LAYER_STACK_BASE_Z_INDEX);

  later.release();
  earlier.release();
});

test("getLayerStackEntry should return live z-index after sibling releases", () => {
  const outer = pushLayerStack({ order: 1 });
  const middle = pushLayerStack({ order: 2 });
  const inner = pushLayerStack({ order: 3 });

  expect(getLayerStackEntry(inner.id)?.zIndex).toBe(
    LAYER_STACK_BASE_Z_INDEX + 2,
  );

  middle.release();

  expect(getLayerStackEntry(inner.id)?.zIndex).toBe(
    LAYER_STACK_BASE_Z_INDEX + 1,
  );

  inner.release();
  outer.release();
});
