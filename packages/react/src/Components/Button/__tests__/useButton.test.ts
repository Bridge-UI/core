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

const libDefaults = {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
  density: "default",
} as const satisfies Partial<ButtonOwnProps>;

function renderUseButton(props: ButtonProps = {}) {
  return renderHook(() =>
    useButton(props, libDefaults as Parameters<typeof useButton>[1]),
  );
}

test("it should default to button element", () => {
  const { result } = renderUseButton();

  expect(result.current.tag).toBe("button");
});

test("it should render as anchor when as is a", () => {
  const { result } = renderUseButton({ as: "a", href: "#" });

  expect(result.current.tag).toBe("a");
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

  expect(result.current.rootDisabled).toBe(true);
});

test("it should be disabled when loading is true", () => {
  const { result } = renderUseButton({ loading: true });

  expect(result.current.rootDisabled).toBe(true);
  expect(result.current.rootAriaBusy).toBe(true);
});

test("it should keep startIcon in merged when set", () => {
  const { result } = renderUseButton({ startIcon: CircleAlert });

  expect(result.current.merged.startIcon).toStrictEqual(CircleAlert);
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseButton();

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should shrink-wrap width when full is false", () => {
  const { result } = renderUseButton();

  expect(result.current.rootBind.className).toContain("w-fit");
  expect(result.current.rootBind.className).not.toContain("w-full");
});

test("it should include full width class when full is true", () => {
  const { result } = renderUseButton({ full: true });

  expect(result.current.rootBind.className).toContain("w-full");
  expect(result.current.rootBind.className).not.toContain("w-fit");
});

test("it should keep text in merged when text prop is set", () => {
  const { result } = renderUseButton({ text: "Label" });

  expect(result.current.merged.text).toBe("Label");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseButton({ className: "custom-button" });

  expect(result.current.rootBind.className).toContain("custom-button");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseButton({
    id: "submit-btn",
    "data-testid": "button",
  });

  expect(result.current.rootBind.id).toBe("submit-btn");
  expect(result.current.rootBind["data-testid"]).toBe("button");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseButton({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});

test("it should include aria-disabled styles for non-button elements", () => {
  const { result } = renderUseButton({ as: "a", href: "#" });

  expect(result.current.rootBind.className).toContain(
    "aria-disabled:opacity-80",
  );
});

test("it should use mini size classes when density is mini", () => {
  const { result } = renderUseButton({ density: "mini", icon: CircleAlert });

  expect(result.current.isMini).toBe(true);
  expect(result.current.rootBind.className).toContain("w-7");
  expect(result.current.rootBind.className).not.toContain("w-full");
});

test("it should keep icon in merged when density is mini and icon is set", () => {
  const { result } = renderUseButton({ density: "mini", icon: CircleAlert });

  expect(result.current.merged.icon).toStrictEqual(CircleAlert);
});

test("it should default to flat variant when density is mini and variant is omitted", () => {
  const { result } = renderUseButton({ density: "mini", icon: CircleAlert });

  expect(result.current.rootBind.className).toContain("text-primary-600");
  expect(result.current.rootBind.className).not.toContain("bg-primary-500");
});

test("it should honor explicit variant when density is mini", () => {
  const { result } = renderUseButton({
    density: "mini",
    variant: "solid",
    icon: CircleAlert,
  });

  expect(result.current.rootBind.className).toContain("bg-primary-500");
});

test("it should not include full width class when density is mini", () => {
  const { result } = renderUseButton({
    full: true,
    density: "mini",
    icon: CircleAlert,
  });

  expect(result.current.rootBind.className).not.toContain("w-full");
});
