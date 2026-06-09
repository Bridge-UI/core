// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { ListContext } from "@/Components/List/ListContext";
import {
  useListItem,
  type ListItemOwnProps,
  type ListItemProps,
} from "@/Components/ListItem";

const libDefaults = {
  role: "button",
  align: "center",
} as const satisfies Partial<ListItemOwnProps>;

function renderUseListItem(
  props: ListItemProps = {},
  context: { dense: boolean } | null = null,
) {
  return renderHook(() => useListItem(props, libDefaults), {
    wrapper: ({ children }) => (
      <ListContext.Provider value={context}>{children}</ListContext.Provider>
    ),
  });
}

test("it should return default role as button", () => {
  const { result } = renderUseListItem();

  expect(result.current.merged.role).toBe("button");
});

test("it should override role when prop is passed", () => {
  const { result } = renderUseListItem({ role: "menuitem" });

  expect(result.current.merged.role).toBe("menuitem");
});

test("it should expose interactive bind when interactive is true", () => {
  const { result } = renderUseListItem({
    interactive: true,
    primary: "Action",
  });

  expect(result.current.interactiveBind?.role).toBe("button");
  expect(result.current.interactiveBind?.className).toContain("cursor-pointer");
});

test("it should apply dense padding on interactive bind", () => {
  const { result } = renderUseListItem({
    dense: true,
    interactive: true,
    primary: "Dense item",
  });

  expect(result.current.interactiveBind?.className).toContain("py-1.5");
  expect(result.current.interactiveBind?.className).not.toContain("py-2");
});

test("it should inherit dense padding from parent List context", () => {
  const { result } = renderUseListItem(
    { role: "menuitem", interactive: true, primary: "Dense item" },
    { dense: true },
  );

  expect(result.current.interactiveBind?.className).toContain("py-1.5");
});

test("it should apply selected styles on interactive bind", () => {
  const { result } = renderUseListItem({
    selected: true,
    interactive: true,
    primary: "Selected",
  });

  expect(result.current.interactiveBind?.className).toContain("bg-primary-50");
});

test("it should disable interaction when disabled is true", () => {
  const { result } = renderUseListItem({
    disabled: true,
    interactive: true,
    primary: "Disabled",
  });

  expect(result.current.interactiveBind?.tabIndex).toBe(-1);
  expect(result.current.interactiveBind?.["aria-disabled"]).toBe(true);
});

test("it should apply divider border on root bind", () => {
  const { result } = renderUseListItem({ divider: true, primary: "Item" });

  expect(result.current.rootBind.className).toContain("border-b");
});
