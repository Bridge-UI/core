import { afterEach, expect, test, vi } from "vitest";

import { claimOpenMenu, resetOpenMenuLayersForTests } from "@/Utils/menu";

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
