// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP,
  clampSliderValue,
  getSliderBarGeometry,
  getSliderPrecision,
  isSliderStopCovered,
  normalizeSliderStops,
  percentFromSliderPointer,
  percentToValue,
  pickClosestSliderThumb,
  resolveSliderBounds,
  resolveSliderDefaultValue,
  snapSliderValue,
  sortSliderRangeValue,
  stepSliderValue,
  valueToPercent,
  writeSliderRangeThumb,
} from "@/Utils/slider";

describe("resolveSliderBounds", () => {
  test("it should apply defaults", () => {
    expect(resolveSliderBounds()).toEqual({
      min: DEFAULT_SLIDER_MIN,
      max: DEFAULT_SLIDER_MAX,
      step: DEFAULT_SLIDER_STEP,
    });
  });

  test("it should swap inverted min/max", () => {
    expect(resolveSliderBounds({ min: 80, max: 20 })).toEqual({
      min: 20,
      max: 80,
      step: 1,
    });
  });
});

describe("getSliderPrecision", () => {
  test("it should return the max decimal places", () => {
    expect(getSliderPrecision(0, 1, 0.25)).toBe(2);
  });
});

describe("clampSliderValue", () => {
  test("it should clamp into bounds", () => {
    expect(clampSliderValue(-5, 0, 100)).toBe(0);
    expect(clampSliderValue(150, 0, 100)).toBe(100);
    expect(clampSliderValue(40, 0, 100)).toBe(40);
  });
});

describe("valueToPercent / percentToValue", () => {
  test("it should convert value to percent", () => {
    expect(valueToPercent(25, 0, 100)).toBe(25);
    expect(valueToPercent(50, 0, 200)).toBe(25);
  });

  test("it should convert percent to snapped value", () => {
    expect(percentToValue(50, 0, 100, 1)).toBe(50);
    expect(percentToValue(33, 0, 100, 10)).toBe(30);
  });
});

describe("snapSliderValue / stepSliderValue", () => {
  test("it should snap to the nearest step", () => {
    expect(snapSliderValue(23, 0, 100, 10)).toBe(20);
  });

  test("it should step within bounds", () => {
    expect(stepSliderValue(20, 1, 0, 100, 10)).toBe(30);
    expect(stepSliderValue(0, -1, 0, 100, 10)).toBe(0);
  });
});

describe("sortSliderRangeValue / pickClosestSliderThumb", () => {
  test("it should sort range values", () => {
    expect(sortSliderRangeValue(80, 20)).toEqual([20, 80]);
  });

  test("it should pick the closest thumb", () => {
    expect(pickClosestSliderThumb(10, 0, 100)).toBe(0);
    expect(pickClosestSliderThumb(90, 0, 100)).toBe(1);
  });
});

describe("writeSliderRangeThumb", () => {
  test("it should keep order when the active thumb stays on its side", () => {
    expect(writeSliderRangeThumb([20, 80], 1, 70)).toEqual({
      thumbIndex: 1,
      value: [20, 70],
    });
  });

  test("it should sort and follow the thumb when values cross", () => {
    expect(writeSliderRangeThumb([20, 80], 1, 10)).toEqual({
      thumbIndex: 0,
      value: [10, 20],
    });
    expect(writeSliderRangeThumb([20, 80], 0, 90)).toEqual({
      thumbIndex: 1,
      value: [80, 90],
    });
  });
});

describe("getSliderBarGeometry", () => {
  test("it should fill from the start for a single value", () => {
    expect(
      getSliderBarGeometry({
        min: 0,
        max: 100,
        value: 40,
        range: false,
      }),
    ).toEqual({ start: "0%", width: "40%" });
  });

  test("it should span the range for range mode", () => {
    expect(
      getSliderBarGeometry({
        min: 0,
        max: 100,
        range: true,
        value: [20, 70],
      }),
    ).toEqual({ start: "20%", width: "50%" });
  });
});

describe("normalizeSliderStops", () => {
  test("it should normalize number and object stops", () => {
    expect(
      normalizeSliderStops({
        min: 0,
        step: 1,
        max: 100,
        stops: [25, { value: 50, label: "Half" }],
      }),
    ).toEqual([{ value: 25 }, { value: 50, label: "Half" }]);
  });

  test("it should generate stops when showStops is true", () => {
    expect(
      normalizeSliderStops({
        min: 0,
        max: 10,
        step: 5,
        showStops: true,
      }),
    ).toEqual([{ value: 5 }]);
  });
});

describe("isSliderStopCovered", () => {
  test("it should detect covered stops for single and range", () => {
    expect(
      isSliderStopCovered({
        min: 0,
        max: 100,
        value: 40,
        range: false,
        stopValue: 20,
      }),
    ).toBe(true);

    expect(
      isSliderStopCovered({
        min: 0,
        max: 100,
        range: true,
        stopValue: 50,
        value: [20, 80],
      }),
    ).toBe(true);
  });
});

describe("percentFromSliderPointer", () => {
  test("it should map pointer position to percent", () => {
    expect(
      percentFromSliderPointer({
        clientX: 50,
        rect: { left: 0, width: 100 },
      }),
    ).toBe(50);
  });

  test("it should invert percent for RTL", () => {
    expect(
      percentFromSliderPointer({
        isRtl: true,
        clientX: 25,
        rect: { left: 0, width: 100 },
      }),
    ).toBe(75);
  });
});

describe("resolveSliderDefaultValue", () => {
  test("it should default to min for single mode", () => {
    expect(
      resolveSliderDefaultValue({
        min: 0,
        step: 1,
        max: 100,
        range: false,
      }),
    ).toBe(0);
  });

  test("it should default to a sorted pair for range mode", () => {
    expect(
      resolveSliderDefaultValue({
        min: 0,
        step: 1,
        max: 100,
        range: true,
        defaultValue: [80, 20],
      }),
    ).toEqual([20, 80]);
  });
});
