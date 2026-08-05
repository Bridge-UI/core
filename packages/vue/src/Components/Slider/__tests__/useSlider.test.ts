// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import {
  resolveSliderBounds,
  resolveSliderDefaultValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useSlider, type SliderOwnProps } from "@/Components/Slider";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

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

function mountUseSlider(
  props: Partial<SliderOwnProps> = {},
  valueOverride?: number | [number, number],
) {
  let result!: ReturnType<typeof useSlider>;

  const bounds = resolveSliderBounds({
    min: props.min ?? libDefaults.min,
    max: props.max ?? libDefaults.max,
    step: props.step ?? libDefaults.step,
  });

  const value = ref<number | [number, number]>(
    valueOverride ??
      resolveSliderDefaultValue({
        min: bounds.min,
        max: bounds.max,
        step: bounds.step,
        range: Boolean(props.range),
        defaultValue: props.defaultValue,
      }),
  );

  const Consumer = defineComponent({
    setup() {
      result = useSlider(() => props as SliderOwnProps, libDefaults, value);

      return () => h("div");
    },
  });

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Consumer),
    },
  });

  return { ...result, value };
}

test("it should merge default bounds", () => {
  const { bounds, merged } = mountUseSlider();

  expect(merged.value.showTooltip).toBe(true);
  expect(bounds.value).toEqual({ min: 0, step: 1, max: 100 });
});

test("it should start at min when uncontrolled", () => {
  const { resolvedValue } = mountUseSlider();

  expect(resolvedValue.value).toBe(0);
});

test("it should use defaultValue when provided", () => {
  const { resolvedValue } = mountUseSlider({ defaultValue: 35 });

  expect(resolvedValue.value).toBe(35);
});

test("it should sort range values", () => {
  const { thumbIndexes, resolvedValue } = mountUseSlider(
    { range: true, defaultValue: [80, 20] },
    [80, 20],
  );

  expect(thumbIndexes.value).toEqual([0, 1]);
  expect(resolvedValue.value).toEqual([20, 80]);
});

test("it should build thumb bind with role slider", () => {
  const { getThumbBind } = mountUseSlider({ defaultValue: 40 }, 40);

  const thumbBind = getThumbBind(0);

  expect(thumbBind.role).toBe("slider");
  expect(thumbBind["aria-valuenow"]).toBe(40);
});

test("it should update uncontrolled value through keyboard handler", () => {
  const { value, getThumbBind } = mountUseSlider({ defaultValue: 10 }, 10);

  getThumbBind(0).onKeydown?.({
    key: "ArrowRight",
    preventDefault: () => undefined,
  } as KeyboardEvent);

  expect(value.value).toBe(11);
});

test("it should expose header chrome binds via baseField", () => {
  const { baseField } = mountUseSlider({
    corner: "%",
    label: "Volume",
  });

  expect(baseField.headerBind.value).toBeTruthy();
  expect(baseField.fieldLabelProps.value.for).toContain("thumb-0");
});
