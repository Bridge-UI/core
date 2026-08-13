// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useBreadcrumb } from "@/Components/Breadcrumb/hooks/useBreadcrumb";

afterEach(() => {
  cleanup();
});

test("it should expose defaults from useBreadcrumb", () => {
  const { result } = renderHook(() =>
    useBreadcrumb(
      {},
      {
        size: "md",
        separator: "chevronRight",
      },
    ),
  );

  expect(result.current.rootBind["aria-label"]).toBe("Breadcrumb");
  expect(result.current.contextValue.separator).toBe("chevronRight");
  expect(result.current.contextValue.tokenClasses.iconSize).toBe("sm");
});

test("it should collapse items when maxItems is set", () => {
  const { result } = renderHook(() =>
    useBreadcrumb(
      {
        maxItems: 3,
        items: [
          { href: "/", label: "Home" },
          { href: "/a", label: "A" },
          { href: "/b", label: "B" },
          { label: "Page", current: true },
        ],
      },
      {
        size: "md",
        separator: "chevronRight",
      },
    ),
  );

  expect(result.current.collapsedItems).toEqual([
    {
      index: 0,
      type: "item",
      item: { href: "/", label: "Home" },
    },
    { type: "ellipsis" },
    {
      index: 3,
      type: "item",
      item: { label: "Page", current: true },
    },
  ]);
});
