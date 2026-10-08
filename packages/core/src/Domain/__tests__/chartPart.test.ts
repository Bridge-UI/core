// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  CHART_OTHER_SLICE_ID,
  getChartFunnelPercents,
  getChartFunnelSummaryParams,
  getChartPartTable,
  getChartPartTooltip,
  getChartPiePercents,
  getChartPieSummaryParams,
  isChartPartEmpty,
  resolveChartSliceLabel,
  sortChartStages,
  toChartSliceEntries,
} from "@/Domain/chartPart";

describe("toChartSliceEntries", () => {
  const data = [
    { value: 50, label: "Housing" },
    { value: 20, label: "Kids" },
    { value: 0, label: "Fun" },
    { value: 25, label: "Food" },
    { value: 5, label: "Taxi" },
  ];

  test("it should give each slice a stable id", () => {
    expect(
      toChartSliceEntries({ data, otherLabel: "Other" }).map((entry) => {
        return entry.id;
      }),
    ).toEqual(["slice-0", "slice-1", "slice-2", "slice-3", "slice-4"]);
  });

  test("it should drop non-positive values for pies", () => {
    expect(
      toChartSliceEntries({ data, positiveOnly: true, otherLabel: "Other" })
        .length,
    ).toBe(4);
  });

  test("it should group the smallest slices into Other", () => {
    const entries = toChartSliceEntries({
      data,
      maxSlices: 3,
      positiveOnly: true,
      otherLabel: "Other",
    });

    expect(entries).toEqual([
      { value: 50, id: "slice-0", label: "Housing" },
      { value: 25, id: "slice-3", label: "Food" },
      { value: 25, label: "Other", id: CHART_OTHER_SLICE_ID },
    ]);
  });

  test("it should not group when the slices already fit", () => {
    expect(
      toChartSliceEntries({ data, maxSlices: 10, otherLabel: "Other" }).length,
    ).toBe(5);
  });
});

describe("sortChartStages", () => {
  const stages = [{ value: 2 }, { value: 5 }, { value: 1 }];

  test("it should sort stages", () => {
    expect(sortChartStages(stages, "descending")).toEqual([
      { value: 5 },
      { value: 2 },
      { value: 1 },
    ]);
    expect(sortChartStages(stages, "ascending")).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 5 },
    ]);
    expect(sortChartStages(stages, "none")).toEqual(stages);
  });
});

describe("getChartPiePercents", () => {
  test("it should sum to 100", () => {
    expect(getChartPiePercents([2, 1])).toEqual([67, 33]);
  });
});

describe("getChartFunnelPercents", () => {
  test("it should compare each stage to the largest", () => {
    expect(getChartFunnelPercents([0, 0])).toEqual([0, 0]);
    expect(getChartFunnelPercents([1200, 420, 96])).toEqual([100, 35, 8]);
  });
});

describe("resolveChartSliceLabel", () => {
  const slice = { value: 3450, percent: 50, label: "Housing" };

  test("it should show the label, value, or percent", () => {
    expect(resolveChartSliceLabel({ slice, content: "label" })).toBe("Housing");
    expect(
      resolveChartSliceLabel({ slice, locale: "en-US", content: "value" }),
    ).toBe("3,450");
    expect(
      resolveChartSliceLabel({ slice, locale: "en-US", content: "percent" }),
    ).toBe("50%");
  });

  test("it should call a custom formatter", () => {
    expect(
      resolveChartSliceLabel({
        slice,
        content: (item) => `${item.label} · ${item.percent}`,
      }),
    ).toBe("Housing · 50");
  });
});

describe("isChartPartEmpty", () => {
  test("it should be empty without finite values", () => {
    expect(isChartPartEmpty([])).toBe(true);
    expect(isChartPartEmpty([{ value: 0 }])).toBe(false);
    expect(isChartPartEmpty([{ value: Number.NaN }])).toBe(true);
  });
});

describe("getChartPartTooltip", () => {
  test("it should return one row with the percent", () => {
    expect(
      getChartPartTooltip({
        id: "a",
        value: 3,
        percent: 75,
        color: "red",
        label: "Kids",
      }),
    ).toEqual({
      title: "",
      items: [{ id: "a", value: 3, percent: 75, color: "red", name: "Kids" }],
    });
  });
});

describe("getChartPartTable", () => {
  test("it should build one row per slice", () => {
    expect(
      getChartPartTable({
        locale: "en-US",
        headers: { label: "Label", value: "Value", percent: "Share" },
        slices: [{ id: "a", value: 1310, percent: 19, label: "Kids" }],
      }),
    ).toEqual({
      headers: ["Label", "Value", "Share"],
      rows: [{ key: "a", cells: ["Kids", "1,310", "19%"] }],
    });
  });
});

describe("getChartPieSummaryParams", () => {
  test("it should list slices with percents", () => {
    expect(
      getChartPieSummaryParams({
        locale: "en-US",
        slices: [
          { percent: 50, label: "Housing" },
          { percent: 50, label: "Kids" },
        ],
      }),
    ).toEqual({ count: 2, items: "Housing 50%, Kids 50%" });
  });
});

describe("getChartFunnelSummaryParams", () => {
  test("it should describe the first and last stages", () => {
    expect(
      getChartFunnelSummaryParams({
        locale: "en-US",
        slices: [
          { value: 1200, label: "Visited" },
          { value: 96, label: "Paid" },
        ],
      }),
    ).toEqual({
      count: 2,
      last: "Paid",
      lastValue: "96",
      first: "Visited",
      firstValue: "1,200",
    });
  });

  test("it should handle no stages", () => {
    expect(getChartFunnelSummaryParams({ slices: [] }).first).toBe("");
  });
});
