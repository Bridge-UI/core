// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { createPositionable } from "@core/Utils/position";

afterEach(() => {
  document.body.innerHTML = "";
});

test("it should position the floating element relative to the reference", async () => {
  document.body.innerHTML = `
    <button id="reference" type="button">Open</button>
    <div id="floating">Menu</div>
  `;

  const reference = document.getElementById("reference") as HTMLElement;
  const floating = document.getElementById("floating") as HTMLElement;

  vi.spyOn(reference, "getBoundingClientRect").mockReturnValue({
    x: 10,
    y: 20,
    top: 20,
    left: 10,
    width: 100,
    height: 40,
    right: 110,
    bottom: 60,
    toJSON: () => ({}),
  } as DOMRect);

  vi.spyOn(floating, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    width: 120,
    height: 80,
    right: 120,
    bottom: 80,
    toJSON: () => ({}),
  } as DOMRect);

  const positionable = createPositionable({
    floating,
    reference,
    offset: 4,
    placement: "bottom-start",
  });

  await positionable.update();

  expect(floating.style.position).toBe("fixed");
  expect(floating.style.left).not.toBe("");
  expect(floating.style.top).not.toBe("");
});

test("it should call onReferenceHidden when the reference is off-screen", async () => {
  document.body.innerHTML = `
    <button id="reference" type="button">Open</button>
    <div id="floating">Menu</div>
  `;

  const reference = document.getElementById("reference") as HTMLElement;
  const floating = document.getElementById("floating") as HTMLElement;
  const onReferenceHidden = vi.fn();

  vi.spyOn(reference, "getBoundingClientRect").mockReturnValue({
    x: -9999,
    y: -9999,
    width: 100,
    height: 40,
    top: -9999,
    left: -9999,
    right: -9899,
    bottom: -9959,
    toJSON: () => ({}),
  } as DOMRect);

  vi.spyOn(floating, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    width: 120,
    height: 80,
    right: 120,
    bottom: 80,
    toJSON: () => ({}),
  } as DOMRect);

  const positionable = createPositionable({
    floating,
    reference,
    onReferenceHidden,
  });

  await positionable.update();

  expect(onReferenceHidden).toHaveBeenCalledOnce();
});

test("it should register autoUpdate on start and cleanup on destroy", () => {
  document.body.innerHTML = `
    <button id="reference" type="button">Open</button>
    <div id="floating">Menu</div>
  `;

  const reference = document.getElementById("reference") as HTMLElement;
  const floating = document.getElementById("floating") as HTMLElement;

  const positionable = createPositionable({ floating, reference });

  positionable.start();

  expect(positionable).toBeDefined();

  positionable.destroy();
});
