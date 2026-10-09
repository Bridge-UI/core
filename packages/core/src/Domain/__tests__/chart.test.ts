// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  applyChartTone,
  DEFAULT_CHART_PALETTE,
  findChartColorRange,
  formatChartAnnouncement,
  formatChartPercent,
  formatChartValue,
  getAdjacentChartIndex,
  getChartRangeColorItems,
  isChartEmpty,
  isChartValue,
  isSameChartAxisOptions,
  mixChartColors,
  resolveChartColor,
  resolveChartRangeColors,
  resolveChartTooltipPosition,
  roundChartPercents,
  toChartCssSize,
} from "@/Domain/chart";

describe("resolveChartColor", () => {
  test("it should prefer the explicit color", () => {
    expect(
      resolveChartColor({ index: 0, color: "#f00", palette: ["info"] }),
    ).toBe("#f00");
  });

  test("it should cycle through the palette", () => {
    const palette = ["info", "success"];

    expect(resolveChartColor({ palette, index: 0 })).toBe("info");
    expect(resolveChartColor({ palette, index: 2 })).toBe("info");
    expect(resolveChartColor({ palette, index: 1 })).toBe("success");
  });

  test("it should fall back to the default palette when empty", () => {
    expect(resolveChartColor({ index: 1, palette: [] })).toBe(
      DEFAULT_CHART_PALETTE[1],
    );
  });
});

describe("isSameChartAxisOptions", () => {
  test("it should compare options shallowly", () => {
    const formatTick = String;

    expect(
      isSameChartAxisOptions(
        { grid: true, formatTick },
        { grid: true, formatTick },
      ),
    ).toBe(true);
    expect(isSameChartAxisOptions({ grid: true }, {})).toBe(false);
    expect(isSameChartAxisOptions({ grid: true }, { grid: false })).toBe(false);
  });
});

describe("isChartValue", () => {
  test("it should accept finite numbers only", () => {
    expect(isChartValue(0)).toBe(true);
    expect(isChartValue(-2.5)).toBe(true);
    expect(isChartValue(null)).toBe(false);
    expect(isChartValue(Number.NaN)).toBe(false);
    expect(isChartValue(Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe("isChartEmpty", () => {
  test("it should be empty without finite values", () => {
    expect(isChartEmpty([])).toBe(true);
    expect(isChartEmpty([null, null])).toBe(true);
    expect(isChartEmpty([Number.NaN])).toBe(true);
  });

  test("it should not be empty with at least one value", () => {
    expect(isChartEmpty([null, 0])).toBe(false);
  });
});

describe("getAdjacentChartIndex", () => {
  test("it should move and clamp with arrow keys", () => {
    expect(
      getAdjacentChartIndex({ count: 3, current: 1, key: "ArrowRight" }),
    ).toBe(2);
    expect(
      getAdjacentChartIndex({ count: 3, current: 2, key: "ArrowRight" }),
    ).toBe(2);
    expect(
      getAdjacentChartIndex({ count: 3, current: 0, key: "ArrowLeft" }),
    ).toBe(0);
  });

  test("it should start at the edges when nothing is active", () => {
    expect(
      getAdjacentChartIndex({ count: 3, current: null, key: "ArrowRight" }),
    ).toBe(0);
    expect(
      getAdjacentChartIndex({ count: 3, current: null, key: "ArrowLeft" }),
    ).toBe(2);
  });

  test("it should support Home, End, and Escape", () => {
    expect(getAdjacentChartIndex({ count: 4, current: 2, key: "Home" })).toBe(
      0,
    );
    expect(getAdjacentChartIndex({ count: 4, current: 0, key: "End" })).toBe(3);
    expect(
      getAdjacentChartIndex({ count: 4, current: 1, key: "Escape" }),
    ).toBeNull();
  });

  test("it should ignore other keys and empty charts", () => {
    expect(
      getAdjacentChartIndex({ count: 3, key: "a", current: 0 }),
    ).toBeUndefined();
    expect(
      getAdjacentChartIndex({ count: 0, key: "Home", current: null }),
    ).toBeUndefined();
  });
});

describe("formatChartValue", () => {
  test("it should format with the locale", () => {
    expect(formatChartValue(1234.5, "en-US")).toBe("1,234.5");
  });

  test("it should fall back to String for invalid locales", () => {
    expect(formatChartValue(3, "not a locale")).toBe("3");
  });
});

describe("formatChartPercent", () => {
  test("it should format a 0–100 share as a percent", () => {
    expect(formatChartPercent(50, "en-US")).toBe("50%");
    expect(formatChartPercent(12.5, "en-US")).toBe("12.5%");
  });
});

describe("roundChartPercents", () => {
  test("it should round shares so they sum to 100", () => {
    const percents = roundChartPercents([1, 1, 1]);

    expect(percents).toEqual([34, 33, 33]);
    expect(percents.reduce((sum, value) => sum + value, 0)).toBe(100);
  });

  test("it should give the remainder to the largest fractions", () => {
    expect(
      roundChartPercents([3450, 1310, 1240, 270, 260, 200, 90, 80]),
    ).toEqual([50, 19, 18, 4, 4, 3, 1, 1]);
  });

  test("it should give 0 to non-positive values and empty totals", () => {
    expect(roundChartPercents([0, 0])).toEqual([0, 0]);
    expect(roundChartPercents([0, -2, 4])).toEqual([0, 0, 100]);
  });
});

describe("formatChartAnnouncement", () => {
  test("it should join the title and the values", () => {
    expect(
      formatChartAnnouncement({
        title: "Q2",
        locale: "en-US",
        items: [
          { id: "a", value: 1800, color: "red", name: "Revenue" },
          { id: "b", value: 10, name: "Cost", color: "blue" },
        ],
      }),
    ).toBe("Q2: Revenue 1,800, Cost 10");
  });

  test("it should add the percent when present", () => {
    expect(
      formatChartAnnouncement({
        title: "",
        locale: "en-US",
        items: [{ id: "a", value: 3450, percent: 50, name: "Housing" }],
      }),
    ).toBe("Housing 3,450 (50%)");
  });

  test("it should return the title alone without values", () => {
    expect(formatChartAnnouncement({ items: [], title: "Q1" })).toBe("Q1");
  });

  test("it should append the range label", () => {
    expect(
      formatChartAnnouncement({
        title: "Mon",
        locale: "en-US",
        items: [{ id: "a", value: 120, name: "AQI", note: "Unhealthy" }],
      }),
    ).toBe("Mon: AQI 120 (Unhealthy)");
  });
});

describe("resolveChartTooltipPosition", () => {
  const bounds = { width: 300, height: 200 };
  const size = { width: 100, height: 40 };

  test("it should center the tooltip above the anchor", () => {
    expect(
      resolveChartTooltipPosition({ size, bounds, anchor: { x: 150, y: 100 } }),
    ).toEqual({ top: 52, left: 100 });
  });

  test("it should clamp horizontally inside the bounds", () => {
    expect(
      resolveChartTooltipPosition({ size, bounds, anchor: { x: 10, y: 100 } })
        .left,
    ).toBe(0);
    expect(
      resolveChartTooltipPosition({ size, bounds, anchor: { x: 290, y: 100 } })
        .left,
    ).toBe(200);
  });

  test("it should flip below the anchor when there is no room above", () => {
    expect(
      resolveChartTooltipPosition({ size, bounds, anchor: { y: 20, x: 150 } })
        .top,
    ).toBe(28);
  });

  test("it should stay above and leave the bounds when neither side fits", () => {
    const sparkline = { width: 300, height: 48 };
    const tooltip = { width: 100, height: 50 };

    expect(
      resolveChartTooltipPosition({
        size: tooltip,
        bounds: sparkline,
        anchor: { y: 24, x: 150 },
      }),
    ).toEqual({ top: -34, left: 100 });
  });

  test("it should stay above when the tooltip is taller than the room below", () => {
    expect(
      resolveChartTooltipPosition({
        anchor: { y: 60, x: 150 },
        size: { width: 100, height: 60 },
        bounds: { width: 300, height: 120 },
      }).top,
    ).toBe(-8);
  });
});

describe("toChartCssSize", () => {
  test("it should convert numbers to px", () => {
    expect(toChartCssSize(280, "100%")).toBe("280px");
  });

  test("it should keep strings and fall back when empty", () => {
    expect(toChartCssSize("", "100%")).toBe("100%");
    expect(toChartCssSize("50vh", "100%")).toBe("50vh");
    expect(toChartCssSize(undefined, "100%")).toBe("100%");
  });
});

describe("findChartColorRange", () => {
  const ranges = [
    { max: 50, color: "green" },
    { min: 50, max: 100, color: "yellow" },
    { min: 100, color: "red" },
  ];

  test("it should include the lower bound and exclude the upper one", () => {
    expect(findChartColorRange(ranges, 49.9)?.color).toBe("green");
    expect(findChartColorRange(ranges, 50)?.color).toBe("yellow");
    expect(findChartColorRange(ranges, 100)?.color).toBe("red");
  });

  test("it should include both ends of a category range", () => {
    const category = [{ min: 1, max: 2, color: "red" }];

    expect(findChartColorRange(category, 0, "category")).toBeUndefined();
    expect(findChartColorRange(category, 1, "category")?.color).toBe("red");
    expect(findChartColorRange(category, 2, "category")?.color).toBe("red");
    expect(findChartColorRange(category, 3, "category")).toBeUndefined();
  });

  test("it should return the first match and nothing outside every range", () => {
    const overlapping = [
      { min: 0, color: "a" },
      { min: 0, color: "b" },
    ];

    expect(findChartColorRange(overlapping, 5)?.color).toBe("a");
    expect(findChartColorRange(overlapping, -1)).toBeUndefined();
  });
});

describe("mixChartColors", () => {
  test("it should mix toward the base by weight", () => {
    expect(mixChartColors("rgb(0, 0, 0)", "rgb(255, 255, 255)", 0.4)).toBe(
      "rgb(153, 153, 153)",
    );
  });

  test("it should parse hex, space syntax, and alpha", () => {
    expect(mixChartColors("#f00", "#ffffff", 1)).toBe("rgb(255, 0, 0)");
    expect(mixChartColors("rgb(0 0 0 / 50%)", "rgb(200, 200, 200)", 1)).toBe(
      "rgb(100, 100, 100)",
    );
  });

  test("it should keep colors it cannot parse", () => {
    expect(mixChartColors("var(--brand)", "#fff", 0.5)).toBe("var(--brand)");
  });
});

describe("applyChartTone", () => {
  test("it should keep solid colors and mix muted ones", () => {
    expect(applyChartTone("rgb(0, 0, 0)", "solid", "#fff")).toBe(
      "rgb(0, 0, 0)",
    );

    expect(applyChartTone("rgb(0, 0, 0)", "muted", "#fff")).toBe(
      "rgb(153, 153, 153)",
    );
  });
});

describe("getChartRangeColorItems", () => {
  test("it should list one item per range with a series-scoped id", () => {
    expect(
      getChartRangeColorItems([
        { id: "a", colorRanges: [{ color: "red" }, { color: "green" }] },
        { id: "b" },
      ]),
    ).toEqual([
      { color: "red", id: "a-range-0" },
      { color: "green", id: "a-range-1" },
    ]);
  });
});

describe("resolveChartRangeColors", () => {
  test("it should replace range colors with resolved ones and tint them", () => {
    expect(
      resolveChartRangeColors({
        seriesId: "a",
        tint: (color) => `${color}!`,
        colors: { "a-range-0": "rgb(0, 0, 0)" },
        ranges: [{ min: 1, label: "High", color: "error" }, { color: "x" }],
      }),
    ).toEqual([
      { min: 1, label: "High", color: "rgb(0, 0, 0)!" },
      { color: "!" },
    ]);
  });
});
