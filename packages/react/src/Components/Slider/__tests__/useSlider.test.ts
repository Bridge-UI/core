// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useSlider,
  type SliderOwnProps,
  type SliderProps,
} from "@/Components/Slider";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = {
  min: 0,
  step: 1,
  max: 100,
  size: "md",
  rounded: "full",
  color: "primary",
  showStops: false,
  showTooltip: true,
} as const satisfies Partial<SliderOwnProps>;

function renderUseSlider(props: SliderProps = {}) {
  return renderHook(() => useSlider(props, libDefaults), {
    wrapper: ({ children }) => createElement(BridgeUIProvider, { children }),
  });
}

test("it should merge default bounds", () => {
  const { result } = renderUseSlider();

  expect(result.current.merged.showTooltip).toBe(true);
  expect(result.current.bounds).toEqual({ min: 0, step: 1, max: 100 });
});

test("it should start at min when uncontrolled", () => {
  const { result } = renderUseSlider();

  expect(result.current.value).toBe(0);
});

test("it should use defaultValue when provided", () => {
  const { result } = renderUseSlider({ defaultValue: 35 });

  expect(result.current.value).toBe(35);
});

test("it should sort default range value on init", () => {
  const { result } = renderUseSlider({
    range: true,
    defaultValue: [80, 20],
  });

  expect(result.current.value).toEqual([20, 80]);
  expect(result.current.thumbIndexes).toEqual([0, 1]);
});

test("it should sort controlled range values", () => {
  const { result } = renderUseSlider({
    range: true,
    value: [80, 20],
  });

  expect(result.current.value).toEqual([20, 80]);
  expect(result.current.readThumbValue(0)).toBe(20);
  expect(result.current.readThumbValue(1)).toBe(80);
});

test("it should build thumb bind with role slider", () => {
  const { result } = renderUseSlider({ defaultValue: 40 });

  const thumbBind = result.current.getThumbBind(0);

  expect(thumbBind.role).toBe("slider");
  expect(thumbBind["aria-valuenow"]).toBe(40);
});

test("it should update uncontrolled value through keyboard handler", () => {
  const { result } = renderUseSlider({ defaultValue: 10 });

  act(() => {
    result.current.getThumbBind(0).onKeyDown?.({
      key: "ArrowRight",
      preventDefault: () => undefined,
    } as never);
  });

  expect(result.current.value).toBe(11);
});

test("it should expose header chrome binds via baseField", () => {
  const { result } = renderUseSlider({ corner: "%", label: "Volume" });

  expect(result.current.baseField.headerBind).toBeTruthy();
  expect(result.current.baseField.fieldLabelProps.htmlFor).toContain("thumb-0");
});
