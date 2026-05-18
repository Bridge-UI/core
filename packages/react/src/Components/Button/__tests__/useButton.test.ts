// ** External Imports
import { renderHook } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import { useButton, type ButtonProps } from "@/Components/Button";

const libDefaults: Partial<ButtonProps> = {
  as: "button",
  size: "md",
  color: "primary",
  variant: "solid",
  rounded: "sm",
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
