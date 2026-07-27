// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useList, type ListProps } from "@/Components/List";

function renderUseList(props: ListProps = {}) {
  return renderHook(() => useList(props));
}

test("it should apply list root classes", () => {
  const { result } = renderUseList();

  expect(result.current.rootBind.className).toContain("m-0");
  expect(result.current.rootBind.className).toContain("list-none");
  expect(result.current.rootBind.className).toContain("py-2");
});

test("it should apply nested indent on root bind", () => {
  const { result } = renderUseList({ nested: true });

  expect(result.current.rootBind.className).toContain("pl-4");
});

test("it should expose dense context value", () => {
  const { result } = renderUseList({ dense: true });

  expect(result.current.contextValue.dense).toBe(true);
});

test("it should merge className into root bind", () => {
  const { result } = renderUseList({ className: "custom-list" });

  expect(result.current.rootBind.className).toContain("custom-list");
});
