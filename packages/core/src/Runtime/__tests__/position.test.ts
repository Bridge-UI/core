// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { createPositionable } from "@/Runtime/position";

afterEach(() => {
  document.body.innerHTML = "";
});

function mockRect(
  element: HTMLElement,
  rect: Pick<DOMRect, "x" | "y" | "width" | "height">,
) {
  const { x, y, width, height } = rect;

  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({}),
  } as DOMRect);
}

function mountFloating(withArrow = false) {
  document.body.innerHTML = withArrow
    ? `
      <button id="reference" type="button">Open</button>
      <div id="floating">Tip<div id="arrow"></div></div>
    `
    : `
      <button id="reference" type="button">Open</button>
      <div id="floating">Menu</div>
    `;

  return {
    floating: document.getElementById("floating") as HTMLElement,
    reference: document.getElementById("reference") as HTMLElement,
    arrowEl: document.getElementById("arrow") as null | HTMLElement,
  };
}

test("it should position the floating element relative to the reference", async () => {
  const { floating, reference } = mountFloating();

  mockRect(floating, { x: 0, y: 0, width: 120, height: 80 });
  mockRect(reference, { x: 10, y: 20, width: 100, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    offset: 4,
    placement: "bottom-start",
  });

  await positionable.update();

  expect(floating.style.top).not.toBe("");
  expect(floating.style.left).not.toBe("");
  expect(floating.style.position).toBe("fixed");
});

test("it should call onReferenceHidden when the reference is off-screen", async () => {
  const { floating, reference } = mountFloating();

  const onReferenceHidden = vi.fn();

  mockRect(floating, { x: 0, y: 0, width: 120, height: 80 });
  mockRect(reference, { x: -9999, y: -9999, width: 100, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    onReferenceHidden,
  });

  await positionable.update();

  expect(onReferenceHidden).toHaveBeenCalledOnce();
});

test("it should register autoUpdate on start and cleanup on destroy", () => {
  const { floating, reference } = mountFloating();

  const positionable = createPositionable({ floating, reference });

  positionable.start();

  expect(positionable).toBeDefined();

  positionable.destroy();
});

test("it should position the arrow element when provided", async () => {
  const { arrowEl, floating, reference } = mountFloating(true);

  mockRect(arrowEl!, { x: 0, y: 0, width: 8, height: 8 });
  mockRect(floating, { x: 0, y: 0, width: 80, height: 32 });
  mockRect(reference, { x: 50, y: 80, width: 100, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    offset: 8,
    arrow: arrowEl!,
    placement: "top",
  });

  await positionable.update();

  expect(floating.style.top).not.toBe("");
  expect(floating.style.left).not.toBe("");
  expect(arrowEl!.style.bottom).toBe("-4px");
});

test("it should inset the arrow for start-aligned placements", async () => {
  const { arrowEl, floating, reference } = mountFloating(true);

  mockRect(arrowEl!, { x: 0, y: 0, width: 8, height: 8 });
  mockRect(floating, { x: 40, y: 80, width: 90, height: 32 });
  mockRect(reference, { x: 40, y: 120, width: 140, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    offset: 8,
    arrow: arrowEl!,
    placement: "top-start",
  });

  await positionable.update();

  expect(arrowEl!.style.left).toBe("8px");
  expect(arrowEl!.style.right).toBe("auto");
  expect(arrowEl!.style.bottom).toBe("-4px");
});

test("it should inset the arrow for end-aligned placements", async () => {
  const { arrowEl, floating, reference } = mountFloating(true);

  mockRect(arrowEl!, { x: 0, y: 0, width: 8, height: 8 });
  mockRect(floating, { x: 200, y: 148, width: 110, height: 32 });
  mockRect(reference, { x: 200, y: 100, width: 110, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    offset: 8,
    arrow: arrowEl!,
    placement: "bottom-end",
  });

  await positionable.update();

  const onEndEdge =
    arrowEl!.style.top === "-4px" || arrowEl!.style.bottom === "-4px";

  expect(onEndEdge).toBe(true);
  expect(arrowEl!.style.left).toBe("auto");
  expect(arrowEl!.style.right).toBe("8px");
});

test("it should inset the arrow at the top for right-start", async () => {
  const { arrowEl, floating, reference } = mountFloating(true);

  Object.defineProperty(window, "innerHeight", {
    value: 800,
    configurable: true,
  });
  Object.defineProperty(window, "innerWidth", {
    value: 1200,
    configurable: true,
  });

  mockRect(arrowEl!, { x: 0, y: 0, width: 8, height: 8 });
  mockRect(floating, { x: 528, y: 200, width: 48, height: 32 });
  mockRect(reference, { x: 400, y: 200, width: 120, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    offset: 8,
    arrow: arrowEl!,
    shiftCrossAxis: false,
    placement: "right-start",
  });

  await positionable.update();

  const onSide =
    arrowEl!.style.left === "-4px" || arrowEl!.style.right === "-4px";

  expect(onSide).toBe(true);
  expect(arrowEl!.style.top).toBe("8px");
  expect(arrowEl!.style.bottom).toBe("auto");
});

test("it should inset the arrow at the bottom for right-end", async () => {
  const { arrowEl, floating, reference } = mountFloating(true);

  Object.defineProperty(window, "innerHeight", {
    value: 800,
    configurable: true,
  });
  Object.defineProperty(window, "innerWidth", {
    value: 1200,
    configurable: true,
  });

  mockRect(arrowEl!, { x: 0, y: 0, width: 8, height: 8 });
  mockRect(floating, { x: 528, y: 208, width: 48, height: 32 });
  mockRect(reference, { x: 400, y: 200, width: 120, height: 40 });

  const positionable = createPositionable({
    floating,
    reference,
    offset: 8,
    arrow: arrowEl!,
    shiftCrossAxis: false,
    placement: "right-end",
  });

  await positionable.update();

  const onSide =
    arrowEl!.style.left === "-4px" || arrowEl!.style.right === "-4px";

  expect(onSide).toBe(true);
  expect(arrowEl!.style.top).toBe("auto");
  expect(arrowEl!.style.bottom).toBe("8px");
});
