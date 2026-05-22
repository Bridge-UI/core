// ** External Imports
import { renderHook } from "@testing-library/react";
import { Info } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import { useLink, type LinkOwnProps, type LinkProps } from "@/Components/Link";

const libDefaults = {
  size: "md",
  color: "primary",
  underline: "hover",
} as const satisfies Partial<LinkOwnProps>;

function renderUseLink(props: LinkProps = {}) {
  return renderHook(() =>
    useLink(props, libDefaults as Parameters<typeof useLink>[1]),
  );
}

test("it should merge default color and underline", () => {
  const { result } = renderUseLink();

  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.underline).toBe("hover");
});

test("it should set rootAriaDisabled when disabled prop is true", () => {
  const { result } = renderUseLink({ disabled: true });

  expect(result.current.rootAriaDisabled).toBe(true);
  expect(result.current.rootHref).toBeUndefined();
});

test("it should keep leftIcon in merged when leftIcon is set", () => {
  const { result } = renderUseLink({ leftIcon: Info });

  expect(result.current.merged.leftIcon).toStrictEqual(Info);
});

test("it should keep rightIcon in merged when rightIcon is set", () => {
  const { result } = renderUseLink({ rightIcon: Info });

  expect(result.current.merged.rightIcon).toStrictEqual(Info);
});

test("it should apply hover underline classes by default", () => {
  const { result } = renderUseLink();

  expect(result.current.rootBind.className).toContain("no-underline");
  expect(result.current.rootBind.className).toContain("hover:underline");
});

test("it should apply none underline when underline is none", () => {
  const { result } = renderUseLink({ underline: "none" });

  expect(result.current.rootBind.className).toContain("no-underline");
  expect(result.current.rootBind.className).not.toContain("hover:underline");
});

test("it should apply always underline when underline is always", () => {
  const { result } = renderUseLink({ underline: "always" });

  expect(result.current.rootBind.className).toContain("underline");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseLink({ className: "custom-link" });

  expect(result.current.rootBind.className).toContain("custom-link");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseLink({
    href: "/docs",
    id: "docs-link",
    "data-testid": "link",
  });

  expect(result.current.merged.href).toBe("/docs");
  expect(result.current.rootBind.id).toBe("docs-link");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseLink({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});
