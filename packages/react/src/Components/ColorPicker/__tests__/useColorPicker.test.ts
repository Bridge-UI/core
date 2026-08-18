// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useColorPicker,
  type ColorPickerOwnProps,
  type ColorPickerProps,
} from "@/Components/ColorPicker";

const libDefaults = {
  rounded: "md",
  format: "hex",
} as const satisfies Partial<ColorPickerOwnProps>;

function renderUseColorPicker(props: ColorPickerProps = {}) {
  return renderHook(() =>
    useColorPicker(props, libDefaults as Parameters<typeof useColorPicker>[1]),
  );
}

test("it should default showFooter to false", () => {
  const { result } = renderUseColorPicker();

  expect(result.current.showFooter).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { result } = renderUseColorPicker({ showFooter: true });

  expect(result.current.showFooter).toBe(true);
});

test("it should size the root to a fixed panel width", () => {
  const { result } = renderUseColorPicker();

  expect(result.current.rootBind.className).toContain("w-72");
});

test("it should fill the container when fill is set", () => {
  const { result } = renderUseColorPicker({ fill: true });

  expect(result.current.rootBind.className).toContain("w-full");
});

test("it should hide alpha for hex by default", () => {
  const { result } = renderUseColorPicker();

  expect(result.current.showAlpha).toBe(false);
});

test("it should show alpha for rgba", () => {
  const { result } = renderUseColorPicker({ format: "rgba" });

  expect(result.current.showAlpha).toBe(true);
});

test("it should use panel-full rounding when rounded is full", () => {
  const { result } = renderUseColorPicker({ rounded: "full" });

  expect(result.current.areaBind.className).toContain("rounded-panel-full");
});

test("it should apply tokens.rounded overrides", () => {
  const { result } = renderUseColorPicker({
    rounded: "md",
    tokens: { rounded: { md: "rounded-none" } },
  });

  expect(result.current.areaBind.className).toContain("rounded-none");
});

test("it should treat a null value as controlled empty", () => {
  const { result } = renderUseColorPicker({
    value: null,
    swatches: ["#ea1212"],
  });

  act(() => {
    result.current.handleSwatchClick("#ea1212");
  });

  expect(result.current.formattedValue).toBe("#ff0000");
});
