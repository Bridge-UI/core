// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DEFAULT_CHART_PALETTE,
  formatChartAnnouncement,
  formatChartValue,
  getAdjacentChartIndex,
  getChartSummaryParams,
  getChartTableRows,
  getChartTooltipItems,
  isChartEmpty,
  isSameChartAxisOptions,
  isSameChartSeriesEntry,
  resolveChartSeriesColor,
  resolveChartTooltipPosition,
  toChartCssSize,
} from "@/Domain/chart";

describe("resolveChartSeriesColor", () => {
  test("it should prefer the explicit color", () => {
    expect(
      resolveChartSeriesColor({ index: 0, color: "#f00", palette: ["info"] }),
    ).toBe("#f00");
  });

  test("it should cycle through the palette", () => {
    const palette = ["info", "success"];

    expect(resolveChartSeriesColor({ palette, index: 0 })).toBe("info");
    expect(resolveChartSeriesColor({ palette, index: 1 })).toBe("success");
    expect(resolveChartSeriesColor({ palette, index: 2 })).toBe("info");
  });

  test("it should fall back to the default palette when empty", () => {
    expect(resolveChartSeriesColor({ index: 1, palette: [] })).toBe(
      DEFAULT_CHART_PALETTE[1],
    );
  });
});

describe("isSameChartSeriesEntry", () => {
  const base = {
    id: "a",
    name: "A",
    data: [1, null],
    type: "line" as const,
    curve: "linear" as const,
  };

  test("it should compare data by value", () => {
    expect(isSameChartSeriesEntry(base, { ...base, data: [1, null] })).toBe(
      true,
    );
  });

  test("it should detect changed fields and data", () => {
    expect(isSameChartSeriesEntry(base, { ...base, data: [1, 2] })).toBe(false);
    expect(isSameChartSeriesEntry(base, { ...base, type: "bar" })).toBe(false);
    expect(isSameChartSeriesEntry(base, { ...base, color: "info" })).toBe(
      false,
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
    expect(isSameChartAxisOptions({ grid: true }, { grid: false })).toBe(false);
    expect(isSameChartAxisOptions({ grid: true }, {})).toBe(false);
  });
});

describe("isChartEmpty", () => {
  test("it should be empty without series or finite values", () => {
    expect(isChartEmpty([])).toBe(true);
    expect(isChartEmpty([{ data: [null, null] }])).toBe(true);
    expect(isChartEmpty([{ data: [Number.NaN] }])).toBe(true);
  });

  test("it should not be empty with at least one value", () => {
    expect(isChartEmpty([{ data: [null, 0] }])).toBe(false);
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

describe("getChartTooltipItems", () => {
  test("it should return values at the index and skip nulls", () => {
    const items = getChartTooltipItems({
      index: 1,
      series: [
        { id: "a", name: "A", data: [1, 2], color: "red" },
        { id: "b", name: "B", color: "blue", data: [3, null] },
      ],
    });

    expect(items).toEqual([{ id: "a", value: 2, name: "A", color: "red" }]);
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

describe("getChartTableRows", () => {
  test("it should build one row per category", () => {
    const rows = getChartTableRows({
      categories: ["Q1", "Q2"],
      series: [{ data: [1, 2] }, { data: [3] }],
    });

    expect(rows).toEqual([
      { category: "Q1", values: [1, 3] },
      { category: "Q2", values: [2, null] },
    ]);
  });
});

describe("getChartSummaryParams", () => {
  test("it should describe series and category range", () => {
    expect(
      getChartSummaryParams({
        categories: ["Q1", "Q2", "Q3"],
        series: [{ name: "Revenue" }, { name: "Cost" }],
      }),
    ).toEqual({
      count: 2,
      last: "Q3",
      first: "Q1",
      categories: 3,
      names: "Revenue, Cost",
    });
  });
});

describe("formatChartAnnouncement", () => {
  test("it should join category and series values", () => {
    expect(
      formatChartAnnouncement({
        category: "Q2",
        locale: "en-US",
        items: [
          { id: "a", value: 1800, color: "red", name: "Revenue" },
          { id: "b", value: 10, name: "Cost", color: "blue" },
        ],
      }),
    ).toBe("Q2: Revenue 1,800, Cost 10");
  });

  test("it should return the category alone without values", () => {
    expect(formatChartAnnouncement({ items: [], category: "Q1" })).toBe("Q1");
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
});

describe("toChartCssSize", () => {
  test("it should convert numbers to px", () => {
    expect(toChartCssSize(280, "100%")).toBe("280px");
  });

  test("it should keep strings and fall back when empty", () => {
    expect(toChartCssSize("50vh", "100%")).toBe("50vh");
    expect(toChartCssSize(undefined, "100%")).toBe("100%");
    expect(toChartCssSize("", "100%")).toBe("100%");
  });
});
