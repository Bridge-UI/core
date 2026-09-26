// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  clampRatingValue,
  getRatingCurrentItem,
  getRatingItemFill,
  getRatingItems,
  getRatingTabIndex,
  getRatingValueFromKey,
  isRatingItemFilled,
  normalizeRatingMax,
  resolveRatingSelection,
} from "@/Domain/rating";

describe("normalizeRatingMax", () => {
  test("it should default when max is omitted", () => {
    expect(normalizeRatingMax()).toBe(5);
    expect(normalizeRatingMax(Number.NaN)).toBe(5);
  });

  test("it should floor fractional max and keep at least one item", () => {
    expect(normalizeRatingMax(3.9)).toBe(3);
    expect(normalizeRatingMax(0)).toBe(1);
  });
});

describe("clampRatingValue", () => {
  test("it should treat empty and non-positive values as no selection", () => {
    expect(clampRatingValue(0, 5)).toBeNull();
    expect(clampRatingValue(null, 5)).toBeNull();
    expect(clampRatingValue(undefined, 5)).toBeNull();
  });

  test("it should keep a fractional value inside the scale", () => {
    expect(clampRatingValue(9, 5)).toBe(5);
    expect(clampRatingValue(0.5, 5)).toBe(0.5);
    expect(clampRatingValue(1.5, 5)).toBe(1.5);
  });
});

describe("getRatingItems", () => {
  test("it should return 1 through max", () => {
    expect(getRatingItems(3)).toEqual([1, 2, 3]);
  });
});

describe("getRatingItemFill", () => {
  test("it should fill a fractional item partway", () => {
    expect(getRatingItemFill(1, 1.5)).toBe(1);
    expect(getRatingItemFill(3, 1.5)).toBe(0);
    expect(getRatingItemFill(1, null)).toBe(0);
    expect(getRatingItemFill(2, 1.5)).toBe(0.5);
  });
});

describe("isRatingItemFilled", () => {
  test("it should fill items up to the displayed value", () => {
    expect(isRatingItemFilled(2, 3)).toBe(true);
    expect(isRatingItemFilled(4, 3)).toBe(false);
    expect(isRatingItemFilled(1, null)).toBe(false);
  });
});

describe("resolveRatingSelection", () => {
  test("it should select an item and clear it when chosen again", () => {
    expect(resolveRatingSelection(null, 2)).toBe(2);
    expect(resolveRatingSelection(2, 4)).toBe(4);
    expect(resolveRatingSelection(4, 4)).toBeNull();
  });
});

describe("getRatingCurrentItem", () => {
  test("it should point at the partial item for a fraction", () => {
    expect(getRatingCurrentItem(2)).toBe(2);
    expect(getRatingCurrentItem(1.5)).toBe(2);
    expect(getRatingCurrentItem(null)).toBeNull();
  });
});

describe("getRatingTabIndex", () => {
  test("it should keep the committed value in the tab order", () => {
    expect(getRatingTabIndex(3, 3)).toBe(0);
    expect(getRatingTabIndex(1, 3)).toBe(-1);
  });

  test("it should tab the partial item when the value is fractional", () => {
    expect(getRatingTabIndex(2, 1.5)).toBe(0);
    expect(getRatingTabIndex(1, 1.5)).toBe(-1);
  });

  test("it should tab the first item when the rating is empty", () => {
    expect(getRatingTabIndex(1, null)).toBe(0);
    expect(getRatingTabIndex(2, null)).toBe(-1);
  });
});

describe("getRatingValueFromKey", () => {
  test("it should step and clear with arrows in ltr", () => {
    expect(
      getRatingValueFromKey({ max: 5, value: null, key: "ArrowRight" }),
    ).toBe(1);

    expect(getRatingValueFromKey({ max: 5, value: 2, key: "ArrowUp" })).toBe(3);

    expect(
      getRatingValueFromKey({ max: 5, value: 1, key: "ArrowLeft" }),
    ).toBeNull();

    expect(getRatingValueFromKey({ max: 5, value: 5, key: "ArrowRight" })).toBe(
      5,
    );
  });

  test("it should step a fractional value by one", () => {
    expect(
      getRatingValueFromKey({ max: 5, value: 1.5, key: "ArrowRight" }),
    ).toBe(2.5);

    expect(
      getRatingValueFromKey({ max: 5, value: 1.5, key: "ArrowLeft" }),
    ).toBe(0.5);

    expect(
      getRatingValueFromKey({ max: 5, value: 0.5, key: "ArrowLeft" }),
    ).toBeNull();
  });

  test("it should swap horizontal arrows in rtl", () => {
    expect(
      getRatingValueFromKey({
        max: 5,
        value: 2,
        key: "ArrowLeft",
        direction: "rtl",
      }),
    ).toBe(3);

    expect(
      getRatingValueFromKey({
        max: 5,
        value: 2,
        direction: "rtl",
        key: "ArrowRight",
      }),
    ).toBe(1);
  });

  test("it should jump to the ends with Home and End", () => {
    expect(getRatingValueFromKey({ max: 5, value: 4, key: "Home" })).toBe(1);
    expect(getRatingValueFromKey({ max: 5, key: "End", value: null })).toBe(5);
  });

  test("it should ignore unrelated keys", () => {
    expect(
      getRatingValueFromKey({ max: 5, value: 2, key: "Enter" }),
    ).toBeUndefined();
  });
});
