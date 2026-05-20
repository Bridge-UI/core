// ** External Imports
import { renderHook } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useButton,
  type ButtonOwnProps,
  type ButtonProps,
} from "@/Components/Button";

const libDefaults: Partial<ButtonOwnProps> = {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
};

function renderUseButton(props: ButtonProps = {}) {
  return renderHook(() => useButton(props, libDefaults));
}

test("it should default to button element", () => {
  const { result } = renderUseButton();

  expect(result.current.tag).toBe("button");
  expect(result.current.isButton).toBe(true);
});

test("it should render as anchor when as is a", () => {
  const { result } = renderUseButton({ as: "a", href: "#" });

  expect(result.current.tag).toBe("a");
  expect(result.current.isAnchor).toBe(true);
  expect(result.current.isButton).toBe(false);
});

test("it should merge default color and variant", () => {
  const { result } = renderUseButton();

  expect(result.current.merged.color).toBe("primary");
  expect(result.current.merged.variant).toBe("solid");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseButton({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderUseButton({ disabled: true });

  expect(result.current.isDisabled).toBe(true);
});

test("it should be disabled when loading is true", () => {
  const { result } = renderUseButton({ loading: true });

  expect(result.current.isDisabled).toBe(true);
  expect(result.current.showSpinner).toBe(true);
});

test("it should show start icon when startIcon is set and not loading", () => {
  const { result } = renderUseButton({ startIcon: CircleAlert });

  expect(result.current.showStartIcon).toBe(true);
});

test("it should hide start icon when loading", () => {
  const { result } = renderUseButton({
    loading: true,
    startIcon: CircleAlert,
  });

  expect(result.current.showStartIcon).toBe(false);
});

test("it should compute rootClass as a non-empty string", () => {
  const { result } = renderUseButton();

  expect(typeof result.current.rootClass).toBe("string");
  expect(result.current.rootClass.length).toBeGreaterThan(0);
});

test("it should include full width class when full is true", () => {
  const { result } = renderUseButton({ full: true });

  expect(result.current.rootClass).toContain("w-full");
});

test("it should expose children from props", () => {
  const { result } = renderUseButton({ children: "Click" });

  expect(result.current.children).toBe("Click");
});

test("it should show text when text prop is set", () => {
  const { result } = renderUseButton({ text: "Label" });

  expect(result.current.showText).toBe(true);
});

test("it should hide children when text prop is set", () => {
  const { result } = renderUseButton({ text: "Label", children: "Label" });

  expect(result.current.showChildren).toBe(false);
});

test("it should hide text when loading", () => {
  const { result } = renderUseButton({ loading: true, text: "Label" });

  expect(result.current.showText).toBe(false);
});

test("it should merge className into rootClass", () => {
  const { result } = renderUseButton({ className: "custom-button" });

  expect(result.current.rootClass).toContain("custom-button");
});

test("it should expose rootHtmlProps for additional attributes", () => {
  const { result } = renderUseButton({
    id: "submit-btn",
    "data-testid": "button",
  });

  expect(result.current.rootHtmlProps.id).toBe("submit-btn");
  expect(result.current.rootHtmlProps["data-testid"]).toBe("button");
});

test("it should apply className after classes.root in rootClass", () => {
  const { result } = renderUseButton({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootClass).toContain("p-4");
  expect(result.current.rootClass).not.toContain("p-2");
});

test("it should include aria-disabled styles for non-button elements", () => {
  const { result } = renderUseButton({ as: "a", href: "#" });

  expect(result.current.rootClass).toContain("aria-disabled:opacity-80");
});

test("it should use mini size classes when density is mini", () => {
  const { result } = renderUseButton({ density: "mini", icon: CircleAlert });

  expect(result.current.isMini).toBe(true);
  expect(result.current.rootClass).toContain("min-w-7");
});

test("it should show icon when density is mini and icon is set", () => {
  const { result } = renderUseButton({ density: "mini", icon: CircleAlert });

  expect(result.current.showIcon).toBe(true);
  expect(result.current.showText).toBe(false);
});

test("it should show default content instead of icon when mini and children are provided", () => {
  const { result } = renderUseButton({
    density: "mini",
    children: "AB",
  });

  expect(result.current.showIcon).toBe(false);
  expect(result.current.showDefault).toBe(true);
});

test("it should prefer icon over children when both are provided in mini density", () => {
  const { result } = renderUseButton({
    density: "mini",
    icon: CircleAlert,
    children: "AB",
  });

  expect(result.current.showIcon).toBe(true);
  expect(result.current.showDefault).toBe(false);
});

test("it should not include full width class when density is mini", () => {
  const { result } = renderUseButton({
    density: "mini",
    full: true,
    icon: CircleAlert,
  });

  expect(result.current.rootClass).not.toContain("w-full");
});
