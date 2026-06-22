// @vitest-environment happy-dom

// ** External Imports
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import {
  createFocusable,
  createFocusTrap,
  getFocusableElements,
} from "@/Utils/focus";

afterEach(() => {
  document.body.innerHTML = "";
});

test("it should collect focusable elements in order", () => {
  document.body.innerHTML = `
    <div id="container">
      <button type="button" id="first">First</button>
      <a href="#" id="second">Second</a>
      <button type="button" disabled id="disabled">Disabled</button>
    </div>
  `;

  const container = document.getElementById("container") as HTMLElement;

  expect(getFocusableElements(container).map((element) => element.id)).toEqual([
    "first",
    "second",
  ]);
});

test("it should auto-focus the first focusable element", () => {
  document.body.innerHTML = `
    <div id="container">
      <button type="button" id="first">First</button>
    </div>
  `;

  const container = document.getElementById("container") as HTMLElement;
  const trap = createFocusTrap({ container });

  expect(document.activeElement?.id).toBe("first");

  trap.release();
});

test("it should restore focus on release", () => {
  document.body.innerHTML = `
    <button type="button" id="trigger">Trigger</button>
    <div id="container">
      <button type="button" id="first">First</button>
    </div>
  `;

  const trigger = document.getElementById("trigger") as HTMLButtonElement;
  const container = document.getElementById("container") as HTMLElement;

  trigger.focus();

  const trap = createFocusTrap({ container });

  expect(document.activeElement?.id).toBe("first");

  trap.release();

  expect(document.activeElement?.id).toBe("trigger");
});

test("it should skip auto-focus and restore when disabled", () => {
  document.body.innerHTML = `
    <button type="button" id="trigger">Trigger</button>
    <div id="container">
      <button type="button" id="first">First</button>
    </div>
  `;

  const trigger = document.getElementById("trigger") as HTMLButtonElement;
  const container = document.getElementById("container") as HTMLElement;

  trigger.focus();

  const trap = createFocusTrap({
    container,
    disableAutoFocus: true,
    disableRestoreFocus: true,
  });

  expect(document.activeElement?.id).toBe("trigger");

  trap.release();

  expect(document.activeElement?.id).toBe("trigger");
});

test("it should navigate focusable elements with Focusable", () => {
  document.body.innerHTML = `
    <div id="container">
      <button type="button" id="first">First</button>
      <button type="button" id="second">Second</button>
      <button type="button" id="third">Third</button>
    </div>
  `;

  const container = document.getElementById("container") as HTMLElement;
  const focusable = createFocusable(container);

  focusable.focusFirst();
  expect(document.activeElement?.id).toBe("first");

  focusable.next()?.focus();
  expect(document.activeElement?.id).toBe("second");

  focusable.previous()?.focus();
  expect(document.activeElement?.id).toBe("first");

  focusable.focusLast();
  expect(document.activeElement?.id).toBe("third");
});
