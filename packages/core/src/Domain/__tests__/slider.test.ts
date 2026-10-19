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
  normalizeSliderValue,
  percentFromSliderPointer,
  percentToValue,
  pickClosestSliderThumb,
  readSliderThumbValue,
  resolveSliderBounds,
  resolveSliderDefaultValue,
  resolveSliderKeyValue,
  resolveSliderTrackPress,
  snapSliderValue,
  sortSliderRangeValue,
  stepSliderValue,
  valueToPercent,
  writeSliderRangeThumb,
  writeSliderThumbValue,
} from "@/Domain/slider";

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

describe("normalizeSliderValue", () => {
  const bounds = { min: 0, max: 100, step: 10 };

  test("it should snap a single value", () => {
    expect(normalizeSliderValue({ ...bounds, value: 33, range: false })).toBe(
      30,
    );
  });

  test("it should read the first item when a pair is given in single mode", () => {
    expect(
      normalizeSliderValue({ ...bounds, range: false, value: [42, 80] }),
    ).toBe(40);
  });

  test("it should sort and snap a range pair", () => {
    expect(
      normalizeSliderValue({ ...bounds, range: true, value: [78, 12] }),
    ).toEqual([10, 80]);
  });

  test("it should collapse a single number into a range pair", () => {
    expect(normalizeSliderValue({ ...bounds, value: 50, range: true })).toEqual(
      [50, 50],
    );
  });

  test("it should fall back to min when the value is missing", () => {
    expect(normalizeSliderValue({ ...bounds, value: null, range: false })).toBe(
      0,
    );
  });
});

describe("readSliderThumbValue / writeSliderThumbValue", () => {
  test("it should read the thumb in range mode", () => {
    expect(readSliderThumbValue([20, 80], 1, true)).toBe(80);
  });

  test("it should read the single value outside range mode", () => {
    expect(readSliderThumbValue(30, 1, false)).toBe(30);
    expect(readSliderThumbValue([20, 80], 1, false)).toBe(20);
  });

  test("it should write a single value", () => {
    expect(writeSliderThumbValue(30, 0, 50, false)).toEqual({
      value: 50,
      thumbIndex: 0,
    });
  });

  test("it should follow the thumb when it crosses the other one", () => {
    expect(writeSliderThumbValue([20, 50], 0, 70, true)).toEqual({
      thumbIndex: 1,
      value: [50, 70],
    });
  });
});

describe("resolveSliderKeyValue", () => {
  const bounds = { min: 0, step: 5, max: 100 };

  test("it should step with arrow keys", () => {
    expect(
      resolveSliderKeyValue({ bounds, current: 50, key: "ArrowRight" }),
    ).toBe(55);
    expect(
      resolveSliderKeyValue({ bounds, current: 50, key: "ArrowLeft" }),
    ).toBe(45);
    expect(resolveSliderKeyValue({ bounds, current: 50, key: "ArrowUp" })).toBe(
      55,
    );
    expect(
      resolveSliderKeyValue({ bounds, current: 50, key: "ArrowDown" }),
    ).toBe(45);
  });

  test("it should flip horizontal arrows in RTL", () => {
    expect(
      resolveSliderKeyValue({
        bounds,
        current: 50,
        isRtl: true,
        key: "ArrowRight",
      }),
    ).toBe(45);
    expect(
      resolveSliderKeyValue({
        bounds,
        current: 50,
        isRtl: true,
        key: "ArrowLeft",
      }),
    ).toBe(55);
    expect(
      resolveSliderKeyValue({
        bounds,
        current: 50,
        isRtl: true,
        key: "ArrowUp",
      }),
    ).toBe(55);
  });

  test("it should jump to bounds with Home / End", () => {
    expect(resolveSliderKeyValue({ bounds, key: "Home", current: 50 })).toBe(0);
    expect(resolveSliderKeyValue({ bounds, key: "End", current: 50 })).toBe(
      100,
    );
  });

  test("it should move ten steps with PageUp / PageDown", () => {
    expect(resolveSliderKeyValue({ bounds, current: 50, key: "PageUp" })).toBe(
      100,
    );
    expect(
      resolveSliderKeyValue({ bounds, current: 30, key: "PageDown" }),
    ).toBe(0);
  });

  test("it should return null for unhandled keys", () => {
    expect(
      resolveSliderKeyValue({ bounds, key: "Tab", current: 50 }),
    ).toBeNull();
  });
});

describe("resolveSliderTrackPress", () => {
  const bounds = { min: 0, max: 100, step: 10 };

  test("it should snap the pressed position in single mode", () => {
    expect(
      resolveSliderTrackPress({ bounds, value: 0, percent: 47, range: false }),
    ).toEqual({ value: 50, thumbIndex: 0 });
  });

  test("it should move the closest thumb in range mode", () => {
    expect(
      resolveSliderTrackPress({
        bounds,
        percent: 72,
        range: true,
        value: [20, 90],
      }),
    ).toEqual({ thumbIndex: 1, value: [20, 70] });
    expect(
      resolveSliderTrackPress({
        bounds,
        percent: 31,
        range: true,
        value: [20, 90],
      }),
    ).toEqual({ thumbIndex: 0, value: [30, 90] });
  });
});
