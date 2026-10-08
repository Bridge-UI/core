// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getChartBubbleSizeDomain,
  getChartScatterPoints,
  getChartScatterTable,
  getChartScatterTooltip,
  isChartScatterEmpty,
  scaleChartBubbleSize,
} from "@/Domain/chartScatter";

describe("getChartScatterPoints", () => {
  test("it should flatten series and sort by x, then y", () => {
    const points = getChartScatterPoints([
      {
        id: "a",
        data: [
          [3, 1],
          [1, 5],
        ],
      },
      {
        id: "b",
        data: [
          [1, 2, 10],
          [Number.NaN, 1],
        ],
      },
    ]);

    expect(points).toEqual([
      { x: 1, y: 2, size: 10, dataIndex: 0, seriesId: "b", seriesIndex: 1 },
      { x: 1, y: 5, size: null, dataIndex: 1, seriesId: "a", seriesIndex: 0 },
      { x: 3, y: 1, size: null, dataIndex: 0, seriesId: "a", seriesIndex: 0 },
    ]);
  });
});

describe("getChartBubbleSizeDomain", () => {
  test("it should return the min and max third value", () => {
    expect(
      getChartBubbleSizeDomain([
        { data: [[0, 0, 5]] },
        {
          data: [
            [0, 0, 50],
            [1, 1],
          ],
        },
      ]),
    ).toEqual([5, 50]);
  });

  test("it should return null without bubbles", () => {
    expect(getChartBubbleSizeDomain([{ data: [[0, 0]] }])).toBeNull();
  });
});

describe("scaleChartBubbleSize", () => {
  const range: [number, number] = [8, 40];

  test("it should map the domain edges to the range", () => {
    expect(scaleChartBubbleSize({ range, value: 0, domain: [0, 100] })).toBe(8);
    expect(scaleChartBubbleSize({ range, value: 100, domain: [0, 100] })).toBe(
      40,
    );
  });

  test("it should scale by area, not by diameter", () => {
    const half = scaleChartBubbleSize({ range, value: 50, domain: [0, 100] });

    expect(half).toBeGreaterThan(24);
    expect(half).toBeCloseTo(Math.sqrt((8 ** 2 + 40 ** 2) / 2));
  });

  test("it should use the max size for a flat domain", () => {
    expect(scaleChartBubbleSize({ range, value: 3, domain: [3, 3] })).toBe(40);
  });
});

describe("isChartScatterEmpty", () => {
  test("it should be empty without drawable points", () => {
    expect(isChartScatterEmpty([])).toBe(true);
    expect(isChartScatterEmpty([{ data: [[0, 0]] }])).toBe(false);
    expect(isChartScatterEmpty([{ data: [[Number.NaN, 1]] }])).toBe(true);
  });
});

describe("getChartScatterTooltip", () => {
  test("it should list x, y, and the size", () => {
    expect(
      getChartScatterTooltip({
        series: { color: "red", name: "Customers" },
        labels: { x: "Age", y: "Ticket", size: "Orders" },
        point: {
          x: 24,
          y: 340,
          size: 3,
          dataIndex: 0,
          seriesId: "a",
          seriesIndex: 0,
        },
      }),
    ).toEqual({
      color: "red",
      title: "Customers",
      items: [
        { id: "x", value: 24, name: "Age" },
        { id: "y", value: 340, name: "Ticket" },
        { value: 3, id: "size", name: "Orders" },
      ],
    });
  });
});

describe("getChartScatterTable", () => {
  const headers = { x: "x", y: "y", size: "Size", series: "Series" };

  test("it should add a size column only when there are bubbles", () => {
    expect(
      getChartScatterTable({
        headers,
        locale: "en-US",
        series: [{ name: "A", data: [[1, 2]] }],
      }),
    ).toEqual({
      headers: ["Series", "x", "y"],
      rows: [{ key: "0-0", cells: ["A", "1", "2"] }],
    });

    expect(
      getChartScatterTable({
        headers,
        locale: "en-US",
        series: [
          {
            name: "A",
            data: [
              [1, 2, 1000],
              [3, 4],
            ],
          },
        ],
      }),
    ).toEqual({
      headers: ["Series", "x", "y", "Size"],
      rows: [
        { key: "0-0", cells: ["A", "1", "2", "1,000"] },
        { key: "0-1", cells: ["A", "3", "4", "—"] },
      ],
    });
  });
});
