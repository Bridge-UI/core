import { afterEach, expect, test, vi } from "vitest";

import {
  claimOpenMenu,
  closeOpenMenu,
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
  const closeA = vi.fn();
  const closeB = vi.fn();

  claimOpenMenu({ id: "menu-a", requestClose: closeA });
  closeOpenMenu();
  claimOpenMenu({ id: "menu-b", requestClose: closeB });

  expect(closeA).toHaveBeenCalledOnce();
  expect(closeB).not.toHaveBeenCalled();
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
