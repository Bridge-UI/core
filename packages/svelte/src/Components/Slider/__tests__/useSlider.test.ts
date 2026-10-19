// ** External Imports
import { expect, test, vi } from "vitest";

// ** Core Imports
import type { SliderRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useSlider, type SliderProps } from "@/Components/Slider";
import { renderHook } from "@/Utils/__tests__/renderHook";

const libDefaults = {
  min: 0,
  step: 1,
  max: 100,
  size: "md",
  rounded: "full",
  color: "primary",
  showStops: false,
  showTooltip: true,
} as const;

function renderUseSlider(
  props: SliderProps = {},
  initial: number | SliderRangeValue = 0,
) {
  const model = { current: initial };
  const onChange = vi.fn();

  const view = renderHook(
    (hookProps: () => SliderProps) =>
      useSlider(hookProps, libDefaults, model, { onChange, autoId: "s" }),
    { props },
  );

  return { ...view, model, onChange };
}

test("it should snap the model to bounds", () => {
  const { result } = renderUseSlider({ step: 10 }, 33);

  expect(result.resolvedValue).toBe(30);
});

test("it should expose two thumbs in range mode", () => {
  const { result } = renderUseSlider({ range: true }, [10, 90]);

  expect(result.thumbIndexes).toEqual([0, 1]);
  expect(result.readThumbValue(1)).toBe(90);
});

test("it should write keyboard steps to the model and onChange", () => {
  const { result, model, onChange } = renderUseSlider({}, 40);
  const thumb = result.getThumbBind(0);

  (thumb.onkeydown as (event: KeyboardEvent) => void)(
    new KeyboardEvent("keydown", { key: "PageUp" }),
  );

  expect(model.current).toBe(50);
  expect(onChange).toHaveBeenCalledWith(50);
});

test("it should ignore keys while disabled", () => {
  const { result, onChange } = renderUseSlider({ disabled: true }, 40);

  (result.getThumbBind(0).onkeydown as (event: KeyboardEvent) => void)(
    new KeyboardEvent("keydown", { key: "ArrowRight" }),
  );

  expect(onChange).not.toHaveBeenCalled();
});

test("it should position the bar and thumb with inline styles", () => {
  const { result } = renderUseSlider({}, 25);

  expect(result.barBind.style).toContain("width: 25%");
  expect(result.getThumbBind(0).style).toContain("inset-inline-start: 25%");
});

test("it should append consumer styles after the computed ones", () => {
  const { result } = renderUseSlider(
    { customProps: { bar: { style: "opacity: 0.5" } } },
    25,
  );

  expect(result.barBind.style).toBe(
    "width: 25%; inset-inline-start: 0%; opacity: 0.5",
  );
});
