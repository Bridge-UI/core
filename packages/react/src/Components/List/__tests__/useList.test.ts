// ** External Imports
import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import { useList, type ListProps } from "@/Components/List";
import { ListContext } from "@/Components/List/ListContext";

function renderUseList(props: ListProps = {}) {
  return renderHook(() => useList(props));
}

test("it should apply list root classes", () => {
  const { result } = renderUseList();

  expect(result.current.rootBind.className).toContain("m-0");
  expect(result.current.rootBind.className).toContain("px-2");
  expect(result.current.rootBind.className).toContain("py-2");
  expect(result.current.rootBind.className).toContain("list-none");
  expect(result.current.rootBind.className).toContain("flex");
  expect(result.current.rootBind.className).toContain("gap-1");
});

test("it should apply nested indent and a start-edge guide line", () => {
  const { result } = renderUseList({ nested: true });

  expect(result.current.rootBind.className).toContain("border-l");
  expect(result.current.rootBind.className).toContain("ml-3.5");
});

test("it should expose dense context value", () => {
  const { result } = renderUseList({ dense: true });

  expect(result.current.contextValue.dense).toBe(true);
});

test("it should expose iconOnly context value", () => {
  const { result } = renderUseList({ iconOnly: true });

  expect(result.current.contextValue.iconOnly).toBe(true);
});

test("it should inherit iconOnly from parent List context", () => {
  const { result } = renderHook(() => useList({}), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return createElement(
        ListContext.Provider,
        { value: { dense: false, iconOnly: true } },
        children,
      );
    },
  });

  expect(result.current.contextValue.iconOnly).toBe(true);
});

test("it should hide nested lists when an ancestor is iconOnly", () => {
  const { result } = renderHook(() => useList({ nested: true }), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return createElement(
        ListContext.Provider,
        { value: { dense: false, iconOnly: true } },
        children,
      );
    },
  });

  expect(result.current.rootBind.hidden).toBe(true);
  expect(result.current.rootBind.className).toContain("hidden");
});

test("it should merge className into root bind", () => {
  const { result } = renderUseList({ className: "custom-list" });

  expect(result.current.rootBind.className).toContain("custom-list");
});
