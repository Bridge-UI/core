// @vitest-environment happy-dom

// ** External Imports
import { isString } from "es-toolkit/compat";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  getLayerStackEntry,
  getLayerStackSnapshot,
  hasHigherFocusTrap,
  isFocusInHigherLayer,
  isInsideNestedLayer,
  isLayerStackTop,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  resetLayerStackForTests,
  SCROLLBAR_COMPENSATION_VAR,
  subscribeLayerStack,
} from "@/Layer/modal";
import { createLayerId } from "@/Layer/registry";

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

  expect(document.body.style.position).not.toBe("fixed");
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
  expect(
    document.documentElement.style.getPropertyValue(SCROLLBAR_COMPENSATION_VAR),
  ).toBe("17px");

  handle.release();

  expect(document.body.style.overflow).toBe("");
  expect(document.body.style.paddingRight).toBe("8px");
  expect(
    document.documentElement.style.getPropertyValue(SCROLLBAR_COMPENSATION_VAR),
  ).toBe("");

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

  expect(document.body.style.paddingRight).toBe("");
  expect(document.body.style.overflow).toBe("hidden");

  handle.release();

  innerWidthSpy.mockRestore();
  clientWidthSpy.mockRestore();
});

test("it should pin body and restore viewport scroll when unlocking", () => {
  const scrollXSpy = vi.spyOn(window, "scrollX", "get").mockReturnValue(12);
  const scrollYSpy = vi.spyOn(window, "scrollY", "get").mockReturnValue(480);
  const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

  document.body.style.position = "relative";

  const handle = pushLayerStack();

  expect(scrollToSpy).not.toHaveBeenCalled();
  expect(document.body.style.right).toBe("0px");
  expect(document.body.style.top).toBe("-480px");
  expect(document.body.style.left).toBe("-12px");
  expect(document.body.style.width).toBe("100%");
  expect(document.body.style.position).toBe("fixed");
  expect(document.body.style.overflow).toBe("hidden");

  handle.release();

  expect(document.body.style.top).toBe("");
  expect(document.body.style.overflow).toBe("");
  expect(document.body.style.position).toBe("relative");
  expect(scrollToSpy).toHaveBeenCalledWith({
    left: 12,
    top: 480,
    behavior: "instant",
  });

  scrollXSpy.mockRestore();
  scrollYSpy.mockRestore();
  scrollToSpy.mockRestore();
});

test("it should restore viewport scroll only after the last lock releases", () => {
  const scrollXSpy = vi.spyOn(window, "scrollX", "get").mockReturnValue(0);
  const scrollYSpy = vi.spyOn(window, "scrollY", "get").mockReturnValue(240);
  const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

  const outer = pushLayerStack();
  const inner = pushLayerStack();

  inner.release();

  expect(scrollToSpy).not.toHaveBeenCalled();
  expect(document.body.style.position).toBe("fixed");

  outer.release();

  expect(document.body.style.position).toBe("");
  expect(scrollToSpy).toHaveBeenCalledWith({
    left: 0,
    top: 240,
    behavior: "instant",
  });

  scrollXSpy.mockRestore();
  scrollYSpy.mockRestore();
  scrollToSpy.mockRestore();
});

test("it should release scroll lock before the layer leaves the stack", () => {
  const handle = pushLayerStack();

  expect(getLayerStackSnapshot()).toHaveLength(1);
  expect(document.body.style.overflow).toBe("hidden");

  handle.releaseScrollLock();

  expect(document.body.style.overflow).toBe("");
  expect(document.body.style.position).toBe("");
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

  expect(isLayerStackTop(inner.id)).toBe(true);
  expect(isLayerStackTop(outer.id)).toBe(false);

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

  expect(second).not.toBe(first);
  expect(isString(first)).toBe(true);
  expect(first.length).toBeGreaterThan(0);
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

test("it should treat focus in a higher layer as nested overlay focus", () => {
  document.body.innerHTML = `
    <div id="outer"><button type="button" id="outer-btn">Outer</button></div>
    <div id="inner"><button type="button" id="inner-btn">Inner</button></div>
  `;

  const outerEl = document.getElementById("outer") as HTMLElement;
  const innerEl = document.getElementById("inner") as HTMLElement;
  const innerBtn = document.getElementById("inner-btn") as HTMLButtonElement;

  const outer = pushLayerStack({ trapsFocus: true, container: outerEl });
  const inner = pushLayerStack({ container: innerEl });

  expect(hasHigherFocusTrap(inner.id)).toBe(false);
  expect(hasHigherFocusTrap(outer.id)).toBe(false);
  expect(isFocusInHigherLayer(innerBtn, inner.id)).toBe(false);
  expect(isFocusInHigherLayer(innerBtn, outer.id)).toBe(true);

  inner.setContainer(null);

  expect(isFocusInHigherLayer(innerBtn, outer.id)).toBe(false);

  inner.release();
  outer.release();
});

test("it should detect a higher trapping layer", () => {
  const outer = pushLayerStack({ trapsFocus: true });
  const inner = pushLayerStack({ trapsFocus: true });

  expect(hasHigherFocusTrap(inner.id)).toBe(false);
  expect(hasHigherFocusTrap(outer.id)).toBe(true);

  inner.release();
  outer.release();
});

test("it should treat only layers opened from a layer as nested in it", () => {
  const outerPanel = document.createElement("div");
  const anchor = document.createElement("button");
  const childPanel = document.createElement("div");
  const childField = document.createElement("input");
  const unrelatedOpener = document.createElement("button");
  const unrelatedPanel = document.createElement("div");
  const unrelatedField = document.createElement("input");

  outerPanel.append(anchor);
  childPanel.append(childField);
  unrelatedPanel.append(unrelatedField);
  document.body.append(outerPanel, childPanel, unrelatedOpener, unrelatedPanel);

  const outer = pushLayerStack({ origin: () => null, container: outerPanel });
  const child = pushLayerStack({ origin: () => anchor, container: childPanel });
  const unrelated = pushLayerStack({
    container: unrelatedPanel,
    origin: () => unrelatedOpener,
  });

  expect(isInsideNestedLayer(childField, outer.id)).toBe(true);
  expect(isInsideNestedLayer(unrelatedField, outer.id)).toBe(false);
  expect(isFocusInHigherLayer(unrelatedField, outer.id)).toBe(true);

  unrelated.release();
  child.release();
  outer.release();
  document.body.innerHTML = "";
});

test("it should follow nesting through intermediate layers", () => {
  const outerPanel = document.createElement("div");
  const middleAnchor = document.createElement("button");
  const middlePanel = document.createElement("div");
  const innerAnchor = document.createElement("button");
  const innerPanel = document.createElement("div");
  const innerField = document.createElement("input");

  outerPanel.append(middleAnchor);
  middlePanel.append(innerAnchor);
  innerPanel.append(innerField);
  document.body.append(outerPanel, middlePanel, innerPanel);

  const outer = pushLayerStack({ container: outerPanel });
  const middle = pushLayerStack({
    container: middlePanel,
    origin: () => middleAnchor,
  });
  const inner = pushLayerStack({
    container: innerPanel,
    origin: () => innerAnchor,
  });

  expect(isInsideNestedLayer(innerField, outer.id)).toBe(true);

  inner.release();
  middle.release();
  outer.release();
  document.body.innerHTML = "";
});

test("it should use the focused element as the default origin", () => {
  const opener = document.createElement("button");
  const outerPanel = document.createElement("div");
  const panel = document.createElement("div");
  const field = document.createElement("input");

  panel.append(field);
  document.body.append(opener, outerPanel, panel);

  const outer = pushLayerStack({ container: outerPanel });

  opener.focus();

  const modal = pushLayerStack({ container: panel });

  expect(isInsideNestedLayer(field, outer.id)).toBe(false);

  modal.release();
  outer.release();
  document.body.innerHTML = "";
});

test("it should not treat a layer with an unknown origin as nested", () => {
  const outerPanel = document.createElement("div");
  const panel = document.createElement("div");
  const field = document.createElement("input");

  panel.append(field);
  document.body.append(outerPanel, panel);

  const outer = pushLayerStack({ container: outerPanel });
  const inner = pushLayerStack({ container: panel, origin: () => null });

  expect(isInsideNestedLayer(field, outer.id)).toBe(false);
  expect(isFocusInHigherLayer(field, outer.id)).toBe(true);

  inner.release();
  outer.release();
  document.body.innerHTML = "";
});

test("it should resolve nesting again when a container changes", () => {
  const outerPanel = document.createElement("div");
  const anchor = document.createElement("button");
  const childPanel = document.createElement("div");
  const childField = document.createElement("input");

  outerPanel.append(anchor);
  childPanel.append(childField);
  document.body.append(outerPanel, childPanel);

  const outer = pushLayerStack({ origin: () => null });
  const child = pushLayerStack({ origin: () => anchor, container: childPanel });

  expect(isInsideNestedLayer(childField, outer.id)).toBe(false);

  outer.setContainer(outerPanel);

  expect(isInsideNestedLayer(childField, outer.id)).toBe(true);

  child.release();
  outer.release();
  document.body.innerHTML = "";
});

test("it should toggle the scroll lock without leaving the stack", () => {
  const handle = pushLayerStack({ lockScroll: false });

  expect(document.body.style.overflow).toBe("");

  handle.setLockScroll(true);

  expect(document.body.style.overflow).toBe("hidden");
  expect(isLayerStackTop(handle.id)).toBe(true);

  handle.setLockScroll(false);

  expect(document.body.style.overflow).toBe("");

  handle.setLockScroll(true);
  handle.release();

  expect(document.body.style.overflow).toBe("");
});

test("it should only record the scroll lock setting once it was released", () => {
  const handle = pushLayerStack();

  handle.releaseScrollLock();
  handle.setLockScroll(false);
  handle.setLockScroll(true);

  expect(document.body.style.overflow).toBe("");

  handle.release();

  expect(document.body.style.overflow).toBe("");
});

test("it should resolve nesting again when the origin changes", () => {
  const outerPanel = document.createElement("div");
  const inside = document.createElement("button");
  const outside = document.createElement("button");
  const childPanel = document.createElement("div");
  const childField = document.createElement("input");

  let origin: Node = outside;

  outerPanel.append(inside);
  childPanel.append(childField);
  document.body.append(outerPanel, outside, childPanel);

  const outer = pushLayerStack({ container: outerPanel });
  const child = pushLayerStack({ origin: () => origin, container: childPanel });

  expect(isInsideNestedLayer(childField, outer.id)).toBe(false);

  origin = inside;

  expect(isInsideNestedLayer(childField, outer.id)).toBe(true);

  child.release();
  outer.release();
  document.body.innerHTML = "";
});

test("it should lock scroll again when restored after a release", () => {
  const handle = pushLayerStack();

  handle.releaseScrollLock();

  expect(document.body.style.overflow).toBe("");

  handle.restoreScrollLock();
  handle.restoreScrollLock();

  expect(document.body.style.overflow).toBe("hidden");

  handle.release();

  expect(document.body.style.overflow).toBe("");
});
