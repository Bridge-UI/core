// ** External Imports
import { renderHook } from "@testing-library/react";
import { Star } from "lucide-react";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import { ListContext } from "@/Components/List/ListContext";
import {
  useListItem,
  type ListItemOwnProps,
  type ListItemProps,
} from "@/Components/ListItem";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = {
  role: "button",
} as const satisfies Partial<ListItemOwnProps>;

function renderUseListItem(
  props: ListItemProps = {},
  context: null | { dense: boolean; iconOnly?: boolean } = null,
  options: { registrySelectedIcon?: null | typeof Star } = {},
) {
  return renderHook(() => useListItem(props, libDefaults), {
    wrapper: ({ children }) => {
      const withList = createElement(
        ListContext.Provider,
        { value: context ? { iconOnly: false, ...context } : null },
        children,
      );

      if (!("registrySelectedIcon" in options)) {
        return withList;
      }

      return createElement(BridgeUIProvider, {
        children: withList,
        components: {
          ListItem: {
            defaultProps: { selectedIcon: options.registrySelectedIcon },
          },
        },
      });
    },
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
  expect(result.current.interactiveBind?.className).toContain("px-4");
  expect(result.current.interactiveBind?.className).toContain("cursor-pointer");
});

test("it should use a compact rounded hit target when List is iconOnly", () => {
  const { result } = renderUseListItem(
    { primary: "Home", interactive: true },
    { dense: false, iconOnly: true },
  );

  expect(result.current.interactiveBind?.className).toContain("h-8");
  expect(result.current.interactiveBind?.className).toContain("w-full");
  expect(result.current.interactiveBind?.className).toContain("px-2");
  expect(result.current.interactiveBind?.className).not.toContain("size-8");
  expect(result.current.interactiveBind?.className).not.toContain(
    "justify-center",
  );
  expect(result.current.interactiveBind?.className).toContain("rounded-lg");
});

test("it should collapse secondary rows to a square hit when List is iconOnly", () => {
  const { result } = renderUseListItem(
    {
      interactive: true,
      primary: "Acme Inc",
      secondary: "Enterprise",
    },
    { dense: false, iconOnly: true },
  );

  expect(result.current.interactiveBind?.className).toContain("size-8");
  expect(result.current.interactiveBind?.className).not.toContain("px-2");
  expect(result.current.interactiveBind?.className).not.toContain("w-full");
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

  expect(result.current.interactiveBind?.className).toContain(
    "dark:bg-white/15",
  );
  expect(result.current.interactiveBind?.className).toContain(
    "dark:text-white",
  );
  expect(result.current.interactiveBind?.className).toContain("bg-dark-100");
  expect(result.current.interactiveBind?.className).toContain("text-dark-900");
});

test("it should resolve check as the default selected icon", () => {
  const { result } = renderUseListItem({
    selected: true,
    interactive: true,
    primary: "Selected",
  });

  expect(result.current.resolvedSelectedIcon).toBe("check");
});

test("it should suppress the selected icon when selectedIcon is null", () => {
  const { result } = renderUseListItem({
    selected: true,
    interactive: true,
    selectedIcon: null,
    primary: "Selected",
  });

  expect(result.current.resolvedSelectedIcon).toBeNull();
});

test("it should use a custom selectedIcon when provided", () => {
  const { result } = renderUseListItem({
    selected: true,
    interactive: true,
    selectedIcon: Star,
    primary: "Selected",
  });

  expect(result.current.resolvedSelectedIcon).toStrictEqual(Star);
});

test("it should resolve selectedIcon from BridgeUIProvider defaultProps", () => {
  const { result } = renderUseListItem(
    { selected: true, interactive: true, primary: "Selected" },
    null,
    { registrySelectedIcon: Star },
  );

  expect(result.current.resolvedSelectedIcon).toStrictEqual(Star);
});

test("it should suppress the selected icon from BridgeUIProvider when null", () => {
  const { result } = renderUseListItem(
    { selected: true, interactive: true, primary: "Selected" },
    null,
    { registrySelectedIcon: null },
  );

  expect(result.current.resolvedSelectedIcon).toBeNull();
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
