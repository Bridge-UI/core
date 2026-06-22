// @vitest-environment happy-dom

// ** External Imports
import { isString } from "es-toolkit/compat";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { createLayerId } from "@/Layer/registry";
import {
  getLayerStackEntry,
  getLayerStackSnapshot,
  isLayerStackTop,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  resetLayerStackForTests,
  subscribeLayerStack,
} from "@/Utils/modal";

afterEach(() => {
  resetLayerStackForTests();
});

test("it should increment z-index per level", () => {
  const outer = pushLayerStack();
  const inner = pushLayerStack();

  expect(outer.level).toBe(0);
  expect(inner.level).toBe(1);
  expect(outer.zIndex).toBe(LAYER_STACK_BASE_Z_INDEX);
  expect(inner.zIndex).toBe(LAYER_STACK_BASE_Z_INDEX + 1);
});

test("it should skip scroll lock when lockScroll is false", () => {
  const handle = pushLayerStack({ lockScroll: false });

  expect(document.body.style.overflow).not.toBe("hidden");

  handle.release();
});

test("it should ref-count body scroll lock", () => {
  const outer = pushLayerStack();

  expect(document.body.style.overflow).toBe("hidden");

  const inner = pushLayerStack();

  inner.release();

  expect(document.body.style.overflow).toBe("hidden");

  outer.release();

  expect(document.body.style.overflow).toBe("");
});

test("it should compensate body padding when a scrollbar is present", () => {
  const innerWidthSpy = vi
    .spyOn(window, "innerWidth", "get")
    .mockReturnValue(1024);
  const clientWidthSpy = vi
    .spyOn(document.documentElement, "clientWidth", "get")
    .mockReturnValue(1007);

  document.body.style.paddingRight = "8px";

  const handle = pushLayerStack();

  expect(document.body.style.overflow).toBe("hidden");
  expect(document.body.style.paddingRight).toBe("25px");

  handle.release();

  expect(document.body.style.overflow).toBe("");
  expect(document.body.style.paddingRight).toBe("8px");

  innerWidthSpy.mockRestore();
  clientWidthSpy.mockRestore();
});

test("it should not add body padding when no scrollbar is shown", () => {
  const innerWidthSpy = vi
    .spyOn(window, "innerWidth", "get")
    .mockReturnValue(1024);
  const clientWidthSpy = vi
    .spyOn(document.documentElement, "clientWidth", "get")
    .mockReturnValue(1024);

  const handle = pushLayerStack();

  expect(document.body.style.overflow).toBe("hidden");
  expect(document.body.style.paddingRight).toBe("");

  handle.release();

  innerWidthSpy.mockRestore();
  clientWidthSpy.mockRestore();
});

test("it should release scroll lock before the layer leaves the stack", () => {
  const handle = pushLayerStack();

  expect(document.body.style.overflow).toBe("hidden");
  expect(getLayerStackSnapshot()).toHaveLength(1);

  handle.releaseScrollLock();

  expect(document.body.style.overflow).toBe("");
  expect(getLayerStackSnapshot()).toHaveLength(1);

  handle.release();

  expect(document.body.style.overflow).toBe("");
  expect(getLayerStackSnapshot()).toHaveLength(0);
});

test("it should invoke only the topmost modal handler", () => {
  const outerEscape = vi.fn();
  const innerEscape = vi.fn();

  pushLayerStack({ order: 1, onEscape: outerEscape });
  pushLayerStack({ order: 2, onEscape: innerEscape });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(innerEscape).toHaveBeenCalledOnce();
  expect(outerEscape).not.toHaveBeenCalled();
});

test("it should reflect highest open order", () => {
  const outer = pushLayerStack({ order: 1 });
  const inner = pushLayerStack({ order: 2 });

  expect(isLayerStackTop(outer.id)).toBe(false);
  expect(isLayerStackTop(inner.id)).toBe(true);

  inner.release();

  expect(isLayerStackTop(outer.id)).toBe(true);
});

test("it should use string ids", () => {
  const handle = pushLayerStack();

  expect(isString(handle.id)).toBe(true);
  expect(handle.id.length).toBeGreaterThan(0);
});

test("it should generate unique ids", () => {
  const first = createLayerId();
  const second = createLayerId();

  expect(isString(first)).toBe(true);
  expect(first.length).toBeGreaterThan(0);
  expect(second).not.toBe(first);
});

test("it should use assigned id when provided", () => {
  expect(createLayerId("host-assigned-id")).toBe("host-assigned-id");
});

test("it should use pre-assigned id", () => {
  const handle = pushLayerStack({ id: "fixed-stack-id" });

  expect(handle.id).toBe("fixed-stack-id");
  expect(getLayerStackEntry("fixed-stack-id")?.id).toBe("fixed-stack-id");

  handle.release();
});

test("it should list open modals", () => {
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

test("it should notify on push and release", () => {
  const listener = vi.fn();

  const unsubscribe = subscribeLayerStack(listener);

  const handle = pushLayerStack();

  expect(listener).toHaveBeenCalledTimes(1);

  handle.release();

  expect(listener).toHaveBeenCalledTimes(2);

  unsubscribe();
});

test("it should rank z-index by order not push order", () => {
  const later = pushLayerStack({ order: 2 });
  const earlier = pushLayerStack({ order: 1 });

  expect(getLayerStackEntry(later.id)?.zIndex).toBe(
    LAYER_STACK_BASE_Z_INDEX + 1,
  );
  expect(getLayerStackEntry(earlier.id)?.zIndex).toBe(LAYER_STACK_BASE_Z_INDEX);

  later.release();
  earlier.release();
});

test("it should return live z-index after sibling releases", () => {
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
