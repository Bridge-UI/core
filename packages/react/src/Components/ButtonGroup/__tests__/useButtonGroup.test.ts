// ** External Imports
import { renderHook } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useButtonGroup,
  type ButtonGroupOwnProps,
  type ButtonGroupProps,
} from "@/Components/ButtonGroup";
import { ButtonGroupContext } from "@/Components/ButtonGroup/ButtonGroupContext";

const libDefaults = {
  full: false,
  color: "primary",
  variant: "solid",
  separator: true,
  orientation: "horizontal",
} as const satisfies Partial<ButtonGroupOwnProps>;

function renderUseButtonGroup(props: ButtonGroupProps = {}) {
  return renderHook(() =>
    useButtonGroup(props, libDefaults as Parameters<typeof useButtonGroup>[1]),
  );
}

test("it should merge default orientation", () => {
  const { result } = renderUseButtonGroup();

  expect(result.current.merged.full).toBe(false);
  expect(result.current.merged.separator).toBe(true);
  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.orientation).toBe("horizontal");
});

test("it should override orientation when prop is passed", () => {
  const { result } = renderUseButtonGroup({ orientation: "vertical" });

  expect(result.current.merged.orientation).toBe("vertical");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseButtonGroup();

  expect(isString(result.current.rootBind.className)).toBe(true);
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseButtonGroup({ className: "mt-4" });

  expect(result.current.rootBind.className).toContain("mt-4");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseButtonGroup({
    id: "export-group",
    "data-testid": "button-group",
  });

  expect(result.current.rootBind.id).toBe("export-group");
  expect(result.current.rootBind["data-testid"]).toBe("button-group");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseButtonGroup({
    className: "mt-8",
    classes: { root: "mt-2" },
  });

  expect(result.current.rootBind.className).toContain("mt-8");
  expect(result.current.rootBind.className).not.toContain("mt-2");
});

test("it should apply vertical orientation classes", () => {
  const { result } = renderUseButtonGroup({ orientation: "vertical" });

  expect(result.current.rootBind.className).toContain("flex-col");
});

test("it should set group role and data-slot on rootBind", () => {
  const { result } = renderUseButtonGroup();

  expect(result.current.rootBind.role).toBe("group");
  expect(result.current.rootBind["data-slot"]).toBe("button-group");
});

test("it should apply full width classes when full is set", () => {
  const { result } = renderUseButtonGroup({ full: true });

  expect(result.current.rootBind.className).toContain("w-full");
});

test("it should include nested group spacing classes on rootBind", () => {
  const { result } = renderUseButtonGroup();

  expect(result.current.rootBind.className).toContain(
    "has-[>[data-slot=button-group]]:gap-2",
  );
});

test("it should draw a hairline on the default orientation", () => {
  const { result } = renderUseButtonGroup();

  expect(result.current.rootBind.className).toContain("before:w-px");
  expect(result.current.rootBind.className).toContain("before:inset-y-0");
  expect(result.current.rootBind.className).not.toContain("-ms-px");
  expect(result.current.rootBind.className).not.toContain("gap-px");
  expect(result.current.rootBind.className).toContain("before:bg-white/25");
});

test("it should overlap adjacent children when separator is false", () => {
  const { result } = renderUseButtonGroup({ separator: false });

  expect(result.current.rootBind.className).toContain("-ms-px");
  expect(result.current.rootBind.className).toContain("border-e-0");
  expect(result.current.rootBind.className).not.toContain("before:w-px");
});

test("it should color the hairline from the group variant", () => {
  const { result } = renderUseButtonGroup({ variant: "outline" });

  expect(result.current.rootBind.className).toContain("before:bg-primary-600");
});

test("it should use a light divider fill when variant is light", () => {
  const { result } = renderUseButtonGroup({ variant: "light" });

  expect(result.current.rootBind.className).toContain("before:bg-white/50");
});

test("it should color the hairline when color is set", () => {
  const { result } = renderUseButtonGroup({
    color: "error",
    variant: "outline",
  });

  expect(result.current.rootBind.className).toContain("before:bg-error-600");
});

test("it should apply a vertical hairline when orientation is vertical", () => {
  const { result } = renderUseButtonGroup({ orientation: "vertical" });

  expect(result.current.rootBind.className).toContain("before:h-px");
});

test("it should expose inherited button props on contextValue", () => {
  const { result } = renderUseButtonGroup({
    size: "sm",
    variant: "outline",
  });

  expect(result.current.contextValue.size).toBe("sm");
  expect(result.current.contextValue.color).toBeUndefined();
  expect(result.current.contextValue.variant).toBe("outline");
});

test("it should inherit divider fill from parent ButtonGroup variant", () => {
  const { result } = renderHook(
    () =>
      useButtonGroup({}, libDefaults as Parameters<typeof useButtonGroup>[1]),
    {
      wrapper: ({ children }) =>
        createElement(
          ButtonGroupContext.Provider,
          { value: { variant: "outline" } },
          children,
        ),
    },
  );

  expect(result.current.rootBind.className).toContain("before:bg-primary-600");
});
