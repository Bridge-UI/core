// ** External Imports
import { renderHook } from "@testing-library/react";
import { Info } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import { useLink, type LinkOwnProps, type LinkProps } from "@/Components/Link";

const libDefaults: Partial<LinkOwnProps> = {
  size: "md",
  color: "primary",
  underline: "hover",
};

function renderUseLink(props: LinkProps = {}) {
  return renderHook(() => useLink(props, libDefaults));
}

test("it should merge default color and underline", () => {
  const { result } = renderUseLink();

  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.underline).toBe("hover");
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderUseLink({ disabled: true });

  expect(result.current.isDisabled).toBe(true);
});

test("it should show left icon when leftIcon is set", () => {
  const { result } = renderUseLink({ leftIcon: Info });

  expect(result.current.showLeftIcon).toBe(true);
});

test("it should show right icon when rightIcon is set", () => {
  const { result } = renderUseLink({ rightIcon: Info });

  expect(result.current.showRightIcon).toBe(true);
});

test("it should apply hover underline classes by default", () => {
  const { result } = renderUseLink();

  expect(result.current.rootClass).toContain("hover:underline");
});

test("it should apply always underline when underline is always", () => {
  const { result } = renderUseLink({ underline: "always" });

  expect(result.current.rootClass).toContain("underline");
});

test("it should merge className into rootClass", () => {
  const { result } = renderUseLink({ className: "custom-link" });

  expect(result.current.rootClass).toContain("custom-link");
});

test("it should expose rootHtmlProps for additional attributes", () => {
  const { result } = renderUseLink({
    href: "/docs",
    id: "docs-link",
    "data-testid": "link",
  });

  expect(result.current.merged.href).toBe("/docs");
  expect(result.current.rootHtmlProps.id).toBe("docs-link");
});

test("it should apply className after classes.root in rootClass", () => {
  const { result } = renderUseLink({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootClass).toContain("p-4");
  expect(result.current.rootClass).not.toContain("p-2");
});
