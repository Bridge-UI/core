// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useList, type ListOwnProps, type ListProps } from "@/Components/List";

const libDefaults = {
  padding: "normal",
} as const satisfies Partial<ListOwnProps>;

function renderUseList(props: ListProps = {}) {
  return renderHook(() =>
    useList(props, libDefaults as Parameters<typeof useList>[1]),
  );
}

test("it should return default padding as normal", () => {
  const { result } = renderUseList();

  expect(result.current.merged.padding).toBe("normal");
});

test("it should override padding when prop is passed", () => {
  const { result } = renderUseList({ padding: "none" });

  expect(result.current.merged.padding).toBe("none");
});

test("it should apply list root classes", () => {
  const { result } = renderUseList();

  expect(result.current.rootBind.className).toContain("m-0");
  expect(result.current.rootBind.className).toContain("list-none");
});

test("it should apply padding classes on root bind", () => {
  const { result: none } = renderUseList({ padding: "none" });
  const { result: normal } = renderUseList({ padding: "normal" });

  expect(none.current.rootBind.className).toContain("p-0");
  expect(normal.current.rootBind.className).toContain("py-2");
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
