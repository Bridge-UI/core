// @vitest-environment happy-dom

import { afterEach, expect, test, vi } from "vitest";

import {
  claimOpenMenu,
  closeOpenMenu,
  isMenuClickAwayDeferred,
  resetOpenMenuLayersForTests,
} from "@/Layer/menu";

afterEach(() => {
  resetOpenMenuLayersForTests();
});

test("it should close the previous menu when another menu opens", () => {
  const closeA = vi.fn();
  const closeB = vi.fn();

  claimOpenMenu({ id: "menu-a", requestClose: closeA });
  claimOpenMenu({ id: "menu-b", requestClose: closeB });

  expect(closeA).toHaveBeenCalledOnce();
  expect(closeB).not.toHaveBeenCalled();
});

test("it should release the claim without closing the current menu", () => {
  const closeA = vi.fn();

  const release = claimOpenMenu({ id: "menu-a", requestClose: closeA });

  release();
  claimOpenMenu({ id: "menu-b", requestClose: vi.fn() });

  expect(closeA).not.toHaveBeenCalled();
});

test("it should close the open menu without claiming the slot", () => {
  const closeB = vi.fn();

  let releaseA = () => {};
  const closeA = vi.fn(() => releaseA());

  releaseA = claimOpenMenu({ id: "menu-a", requestClose: closeA });
  closeOpenMenu();
  claimOpenMenu({ id: "menu-b", requestClose: closeB });

  expect(closeA).toHaveBeenCalledOnce();
  expect(closeB).not.toHaveBeenCalled();
});

test("it should keep the claim of a menu that ignores the close request", () => {
  const closeA = vi.fn();

  claimOpenMenu({ id: "menu-a", requestClose: closeA });
  closeOpenMenu();

  expect(closeA).toHaveBeenCalledOnce();

  claimOpenMenu({ id: "menu-b", requestClose: vi.fn() });

  expect(closeA).toHaveBeenCalledTimes(2);
});

test("it should defer click-away only on other menu triggers", () => {
  const menuTrigger = document.createElement("div");
  const icon = document.createElement("span");
  const toggle = document.createElement("button");

  menuTrigger.setAttribute("aria-haspopup", "menu");
  menuTrigger.append(icon);
  toggle.setAttribute("aria-expanded", "true");

  expect(isMenuClickAwayDeferred(icon)).toBe(true);
  expect(isMenuClickAwayDeferred(toggle)).toBe(false);
});

test("it should do nothing when no menu is open", () => {
  expect(() => closeOpenMenu()).not.toThrow();
});

test("it should keep the open menu when the origin is inside it", () => {
  const closeA = vi.fn();
  const inside = {} as Node;

  claimOpenMenu({
    id: "menu-a",
    requestClose: closeA,
    contains: (node) => node === inside,
  });
  closeOpenMenu(inside);

  expect(closeA).not.toHaveBeenCalled();

  closeOpenMenu({} as Node);

  expect(closeA).toHaveBeenCalledOnce();
});

test("it should keep a menu open when another menu opens from inside it", () => {
  const closeA = vi.fn();
  const insideA = {} as Node;

  claimOpenMenu({
    id: "menu-a",
    requestClose: closeA,
    contains: (node) => node === insideA,
  });
  claimOpenMenu({ id: "menu-b", origin: insideA, requestClose: vi.fn() });

  expect(closeA).not.toHaveBeenCalled();
});

test("it should close the whole nested stack when an unrelated menu opens", () => {
  const closeA = vi.fn();
  const closeB = vi.fn();
  const insideA = {} as Node;

  claimOpenMenu({
    id: "menu-a",
    requestClose: closeA,
    contains: (node) => node === insideA,
  });
  const releaseB = claimOpenMenu({
    id: "menu-b",
    origin: insideA,
    requestClose: closeB,
  });

  releaseB();
  claimOpenMenu({ id: "menu-c", origin: {} as Node, requestClose: vi.fn() });

  expect(closeB).not.toHaveBeenCalled();
  expect(closeA).toHaveBeenCalledOnce();
});

test("it should close only the menus that do not hold the origin", () => {
  const closeA = vi.fn();
  const closeB = vi.fn();
  const insideA = {} as Node;
  const insideB = {} as Node;

  claimOpenMenu({
    id: "menu-a",
    requestClose: closeA,
    contains: (node) => node === insideA || node === insideB,
  });
  claimOpenMenu({
    id: "menu-b",
    origin: insideA,
    requestClose: closeB,
    contains: (node) => node === insideB,
  });

  closeOpenMenu(insideA);

  expect(closeA).not.toHaveBeenCalled();
  expect(closeB).toHaveBeenCalledOnce();
});

test("it should close nested menus before their parent when an unrelated menu opens", () => {
  const closed: string[] = [];
  const insideA = {} as Node;

  claimOpenMenu({
    id: "menu-a",
    contains: (node) => node === insideA,
    requestClose: () => closed.push("a"),
  });
  claimOpenMenu({
    id: "menu-b",
    origin: insideA,
    requestClose: () => closed.push("b"),
  });
  claimOpenMenu({ id: "menu-c", origin: {} as Node, requestClose: vi.fn() });

  expect(closed).toEqual(["b", "a"]);
});
