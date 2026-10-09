// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  type ChartBarSeriesEntry,
  getChartBarRadius,
  getChartCartesianItemColors,
  getChartCartesianRenderSeries,
  getChartCartesianSummaryParams,
  getChartCartesianTable,
  getChartCartesianTooltip,
  getChartCategoryColorItems,
  getChartCategoryLabels,
  getChartNearestIndex,
  getChartStackEnds,
  getChartTimeTickFormatter,
  isChartTimeCategories,
  resolveChartBarRadii,
  resolveChartCartesianAxes,
} from "@/Domain/chartCartesian";

describe("isChartTimeCategories", () => {
  test("it should detect valid dates", () => {
    expect(isChartTimeCategories([new Date(2026, 0, 1)])).toBe(true);
  });

  test("it should reject labels, empty lists, and invalid dates", () => {
    expect(isChartTimeCategories([])).toBe(false);
    expect(isChartTimeCategories(["Jan"])).toBe(false);
    expect(isChartTimeCategories([new Date("nope")])).toBe(false);
  });
});

describe("getChartCategoryLabels", () => {
  test("it should keep labels and format dates", () => {
    expect(getChartCategoryLabels({ categories: ["Jan", "Feb"] })).toEqual([
      "Jan",
      "Feb",
    ]);

    expect(
      getChartCategoryLabels({
        locale: "en-US",
        categories: [new Date(2026, 9, 8)],
      }),
    ).toEqual(["Oct 8, 2026"]);
  });

  test("it should use a custom date formatter", () => {
    expect(
      getChartCategoryLabels({
        categories: [new Date(2026, 9, 8)],
        formatDate: (date) => String(date.getDate()),
      }),
    ).toEqual(["8"]);
  });
});

describe("getChartTimeTickFormatter", () => {
  const day = 24 * 60 * 60 * 1000;
  const start = new Date(2026, 0, 1).getTime();

  test("it should show days for short spans", () => {
    const format = getChartTimeTickFormatter({
      locale: "en-US",
      timestamps: [start, start + 10 * day],
    });

    expect(format(start + 4 * day)).toBe("Jan 5");
  });

  test("it should show months, with the year across years", () => {
    expect(
      getChartTimeTickFormatter({
        locale: "en-US",
        timestamps: [start, start + 200 * day],
      })(start + 40 * day),
    ).toBe("Feb");

    expect(
      getChartTimeTickFormatter({
        locale: "en-US",
        timestamps: [start, start + 400 * day],
      })(start),
    ).toBe("Jan 26");
  });

  test("it should show years for long spans", () => {
    expect(
      getChartTimeTickFormatter({
        locale: "en-US",
        timestamps: [start, start + 900 * day],
      })(start),
    ).toBe("2026");
  });
});

describe("getChartNearestIndex", () => {
  test("it should return the closest timestamp index", () => {
    expect(getChartNearestIndex([], 40)).toBeNull();
    expect(getChartNearestIndex([0, 100, 400], 40)).toBe(0);
    expect(getChartNearestIndex([0, 100, 400], 260)).toBe(2);
  });
});

describe("resolveChartCartesianAxes", () => {
  test("it should map vertical charts to category x and value y", () => {
    const axes = resolveChartCartesianAxes({
      yAxis: { min: 0 },
      orientation: "vertical",
      xAxis: { label: "Month" },
    });

    expect(axes.categoryPosition).toBe("x");
    expect(axes.category).toEqual({
      grid: false,
      hidden: false,
      label: "Month",
    });
    expect(axes.value).toEqual({ min: 0, grid: true, hidden: false });
  });

  test("it should swap roles for horizontal charts", () => {
    const axes = resolveChartCartesianAxes({
      xAxis: { min: 0 },
      yAxis: { label: "Tag" },
      orientation: "horizontal",
    });

    expect(axes.categoryPosition).toBe("y");
    expect(axes.category.label).toBe("Tag");
    expect(axes.value).toEqual({ min: 0, grid: true, hidden: false });
  });

  test("it should keep explicit grid settings", () => {
    const axes = resolveChartCartesianAxes({
      xAxis: { grid: true },
      yAxis: { grid: false },
      orientation: "vertical",
    });

    expect(axes.value.grid).toBe(false);
    expect(axes.category.grid).toBe(true);
  });
});

describe("getChartStackEnds", () => {
  test("it should accumulate series that share a stack", () => {
    expect(
      getChartStackEnds([
        { id: "a", stack: "total", data: [1, 2, null] },
        { id: "b", stack: "total", data: [3, -1, 4] },
        { id: "c", data: [5, 5, 5] },
      ]),
    ).toEqual({
      c: [5, 5, 5],
      b: [4, -1, 4],
      a: [1, 2, null],
    });
  });
});

describe("getChartBarRadius", () => {
  test("it should round the value end", () => {
    const radius = 4;

    expect(
      getChartBarRadius({ radius, value: 1, orientation: "vertical" }),
    ).toEqual([4, 4, 0, 0]);
    expect(
      getChartBarRadius({ radius, value: -1, orientation: "vertical" }),
    ).toEqual([0, 0, 4, 4]);
    expect(
      getChartBarRadius({ radius, value: 1, orientation: "horizontal" }),
    ).toEqual([0, 4, 4, 0]);
    expect(
      getChartBarRadius({ radius, value: -1, orientation: "horizontal" }),
    ).toEqual([4, 0, 0, 4]);
  });
});

describe("resolveChartBarRadii", () => {
  test("it should round only the outermost bar of each stack side", () => {
    const radii = resolveChartBarRadii({
      radius: 4,
      orientation: "vertical",
      series: [
        { id: "a", stack: "s", data: [1, 2, -1] },
        { id: "b", stack: "s", data: [1, null, 2] },
      ],
    });

    expect(radii.a).toEqual([null, [4, 4, 0, 0], [0, 0, 4, 4]]);
    expect(radii.b).toEqual([[4, 4, 0, 0], null, [4, 4, 0, 0]]);
  });

  test("it should round every unstacked bar and skip a zero radius", () => {
    const series = [{ id: "a", data: [1, null] }];

    expect(
      resolveChartBarRadii({ series, radius: 2, orientation: "vertical" }).a,
    ).toEqual([[2, 2, 0, 0], null]);
    expect(
      resolveChartBarRadii({ series, radius: 0, orientation: "vertical" }).a,
    ).toEqual([null, null]);
  });
});

/** Series with one color range, shared by the tooltip and table tests. */
const rangedSeries = {
  id: "a",
  name: "AQI",
  color: "gray",
  data: [5, 20],
  colorBy: "value" as const,
  itemColors: ["gray", "red"],
  colorRanges: [{ min: 10, color: "red", label: "High" }],
};

describe("getChartCartesianTooltip", () => {
  test("it should return values at the index and skip nulls", () => {
    expect(
      getChartCartesianTooltip({
        index: 1,
        title: "Feb",
        series: [
          { id: "a", name: "A", data: [1, 2], color: "red" },
          { id: "b", name: "B", color: "blue", data: [3, null] },
        ],
      }),
    ).toEqual({
      title: "Feb",
      items: [{ id: "a", value: 2, name: "A", color: "red" }],
    });
  });

  test("it should use the item color and range label", () => {
    expect(
      getChartCartesianTooltip({
        index: 1,
        title: "B",
        series: [rangedSeries],
      }),
    ).toEqual({
      title: "B",
      items: [{ id: "a", value: 20, name: "AQI", color: "red", note: "High" }],
    });
  });
});

describe("getChartCartesianTable", () => {
  test("it should build one row per category", () => {
    expect(
      getChartCartesianTable({
        locale: "en-US",
        categories: ["Q1", "Q2"],
        categoryHeader: "Category",
        series: [
          { name: "A", data: [1000, 2] },
          { name: "B", data: [3] },
        ],
      }),
    ).toEqual({
      headers: ["Category", "A", "B"],
      rows: [
        { key: "0-Q1", cells: ["Q1", "1,000", "3"] },
        { key: "1-Q2", cells: ["Q2", "2", "—"] },
      ],
    });
  });

  test("it should append the range label", () => {
    const table = getChartCartesianTable({
      locale: "en-US",
      categories: ["A", "B"],
      series: [rangedSeries],
      categoryHeader: "Category",
    });

    expect(table.rows.map((row) => row.cells[1])).toEqual(["5", "20 (High)"]);
  });
});

describe("getChartCartesianSummaryParams", () => {
  test("it should describe series and category range", () => {
    expect(
      getChartCartesianSummaryParams({
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

describe("getChartCartesianItemColors", () => {
  const colorRanges = [{ min: 10, color: "red", label: "High" }];

  test("it should be null for uniform series", () => {
    expect(
      getChartCartesianItemColors({
        data: [1, 2],
        color: "gray",
        colorRanges: [],
        colorBy: "value",
      }),
    ).toBeNull();
  });

  test("it should prefer the matching range, then the category color", () => {
    expect(
      getChartCartesianItemColors({
        colorRanges,
        color: "gray",
        colorBy: "value",
        data: [5, 20, null],
        categoryColors: ["blue", "green", "pink"],
      }),
    ).toEqual(["blue", "red", "pink"]);
  });

  test("it should match category ranges by index", () => {
    expect(
      getChartCartesianItemColors({
        color: "gray",
        data: [1, 1, 1],
        colorBy: "category",
        colorRanges: [{ min: 1, max: 1, color: "red" }],
      }),
    ).toEqual(["gray", "red", "gray"]);
  });
});

describe("getChartCategoryColorItems", () => {
  const labels = ["A", "B"];

  test("it should ignore inherited keys and read labels with dots", () => {
    expect(
      getChartCategoryColorItems({
        labels: ["constructor", "v1.2"],
        categoryColors: { "v1.2": "red" },
      }),
    ).toEqual([
      { color: undefined, id: "category-0" },
      { color: "red", id: "category-1" },
    ]);
  });

  test("it should be empty without category colors", () => {
    expect(getChartCategoryColorItems({ labels })).toEqual([]);

    expect(
      getChartCategoryColorItems({ labels, categoryColors: false }),
    ).toEqual([]);
  });

  test("it should leave colors to the palette, follow arrays, and map records", () => {
    expect(
      getChartCategoryColorItems({ labels, categoryColors: true }),
    ).toEqual([
      { color: undefined, id: "category-0" },
      { color: undefined, id: "category-1" },
    ]);

    expect(
      getChartCategoryColorItems({ labels, categoryColors: ["red"] }),
    ).toEqual([
      { color: "red", id: "category-0" },
      { color: undefined, id: "category-1" },
    ]);

    expect(
      getChartCategoryColorItems({ labels, categoryColors: { B: "blue" } }),
    ).toEqual([
      { color: undefined, id: "category-0" },
      { color: "blue", id: "category-1" },
    ]);
  });
});

describe("getChartCartesianRenderSeries", () => {
  const bar: ChartBarSeriesEntry = {
    id: "a",
    name: "A",
    kind: "bar",
    data: [1, 20],
    tone: "solid",
    labels: false,
    reference: [],
    colorBy: "value",
    colorRanges: [{ min: 10, color: "error" }],
  };

  const theme = {
    textColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)",
  };

  test("it should resolve the series and range colors", () => {
    const [series] = getChartCartesianRenderSeries({
      theme,
      series: [bar],
      categoryColors: null,
      colors: { a: "rgb(0, 0, 255)", "a-range-0": "rgb(255, 0, 0)" },
    });

    expect(series.color).toBe("rgb(0, 0, 255)");
    expect(series.colorRanges[0].color).toBe("rgb(255, 0, 0)");
    expect(series.itemColors).toEqual(["rgb(0, 0, 255)", "rgb(255, 0, 0)"]);
  });

  test("it should mix muted bars toward the background", () => {
    const [series] = getChartCartesianRenderSeries({
      theme,
      categoryColors: null,
      colors: { a: "rgb(0, 0, 0)" },
      series: [{ ...bar, tone: "muted", colorRanges: [] }],
    });

    expect(series.color).toBe("rgb(153, 153, 153)");
  });

  test("it should give bars category colors and a neutral legend color", () => {
    const [series] = getChartCartesianRenderSeries({
      theme,
      colors: { a: "rgb(0, 0, 255)" },
      series: [{ ...bar, colorRanges: [] }],
      categoryColors: ["rgb(1, 1, 1)", "rgb(2, 2, 2)"],
    });

    expect(series.color).toBe("rgb(0, 0, 0)");
    expect(series.itemColors).toEqual(["rgb(1, 1, 1)", "rgb(2, 2, 2)"]);
  });
});
