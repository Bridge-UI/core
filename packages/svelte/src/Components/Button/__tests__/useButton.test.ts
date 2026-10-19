// ** External Imports
import { CircleAlert } from "@lucide/svelte";
import { get, isString } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Local Imports
import { useButton, type ButtonProps } from "@/Components/Button";
import {
  setButtonGroupContext,
  type ButtonGroupContextValue,
} from "@/Components/ButtonGroup/buttonGroupContext";
import { renderHook } from "@/Utils/__tests__/renderHook";

const libDefaults = {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
} as const;

function renderUseButton(
  props: ButtonProps = {},
  group?: ButtonGroupContextValue,
) {
  return renderHook(
    (hookProps: () => ButtonProps) => useButton(hookProps, libDefaults),
    {
      props,
      setup: group ? () => setButtonGroupContext(() => group) : undefined,
    },
  );
}

test("it should merge default color and variant", () => {
  const { result } = renderUseButton();

  expect(result.merged.color).toBe("primary");
  expect(result.merged.variant).toBe("solid");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseButton({ color: "error" });

  expect(result.merged.color).toBe("error");
});

test("it should hide content and overlay the spinner when loading", () => {
  const { result } = renderUseButton({ loading: true });

  expect(result.merged.loading).toBe(true);
  expect(result.contentBind.class).toContain("invisible");
  expect(result.loadingWrapBind.class).toContain("absolute");
});

test("it should compute root class as a non-empty string", () => {
  const { result } = renderUseButton();

  expect(isString(result.rootBind.class)).toBe(true);
  expect(result.rootBind.class.length).toBeGreaterThan(0);
});

test("it should toggle width classes with full", () => {
  expect(renderUseButton().result.rootBind.class).toContain("w-fit");
  expect(renderUseButton({ full: true }).result.rootBind.class).toContain(
    "w-full",
  );
});

test("it should expose rootBind for additional attributes", () => {
  const { result } = renderUseButton({
    id: "submit-btn",
    "data-testid": "button",
  } as ButtonProps);

  expect(result.rootBind.id).toBe("submit-btn");
  expect(get(result.rootBind, "data-testid")).toBe("button");
});

test("it should use mini size and flat variant when density is mini", () => {
  const { result } = renderUseButton({ density: "mini", icon: CircleAlert });

  expect(result.isMini).toBe(true);
  expect(result.rootBind.class).toContain("w-7");
  expect(result.rootBind.class).toContain("text-primary-600");
  expect(result.rootBind.class).not.toContain("bg-primary-500");
});

test("it should apply black high-contrast solid classes", () => {
  const { result } = renderUseButton({ color: "black" });

  expect(result.rootBind.class).toContain("bg-black");
  expect(result.rootBind.class).toContain("dark:bg-white");
});

test("it should set aria-pressed and selected classes when selected", () => {
  const { result } = renderUseButton({ selected: true, variant: "outline" });

  expect(result.rootBind["aria-pressed"]).toBe(true);
  expect(result.rootBind.class).toContain("bg-primary-400/25");
});

test("it should react to prop changes", async () => {
  const { result, rerender } = renderUseButton({ color: "primary" });

  await rerender({ color: "error", full: true });

  expect(result.merged.color).toBe("error");
  expect(result.rootBind.class).toContain("w-full");
});

test("it should not force flat variant on mini buttons inside a ButtonGroup", () => {
  const { result } = renderUseButton(
    { density: "mini", icon: CircleAlert },
    {},
  );

  expect(result.rootBind.class).toContain("h-auto");
  expect(result.rootBind.class).toContain("bg-primary-500");
});

test("it should inherit appearance from ButtonGroup context", () => {
  const { result } = renderUseButton({}, { size: "sm", variant: "outline" });

  expect(result.merged.size).toBe("sm");
  expect(result.merged.variant).toBe("outline");
});

test("it should let button props override ButtonGroup context", () => {
  const { result } = renderUseButton(
    { size: "lg", color: "error" },
    { size: "sm", color: "dark", variant: "outline" },
  );

  expect(result.merged.size).toBe("lg");
  expect(result.merged.color).toBe("error");
  expect(result.merged.variant).toBe("outline");
});
