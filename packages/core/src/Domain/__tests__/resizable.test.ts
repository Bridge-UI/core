// @vitest-environment happy-dom

// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  clampResizablePanelSize,
  fitResizableLayout,
  getResizableCursor,
  getResizableHandleAria,
  getResizableItemIndexes,
  getResizableLayoutFromKey,
  getResizablePanelStyle,
  getResizablePointerDelta,
  isResizablePanelCollapsed,
  resizeResizableLayout,
  resizeResizablePanel,
  resolveResizableLayout,
  resolveResizablePanelConstraints,
  sortResizableItemsByDocumentOrder,
} from "@/Domain/resizable";

function rounded(layout: number[]) {
  return layout.map((size) => Math.round(size * 1000) / 1000);
}

describe("resolveResizablePanelConstraints", () => {
  test("it should fill in the default bounds", () => {
    expect(resolveResizablePanelConstraints()).toEqual({
      minSize: 0,
      maxSize: 100,
      collapsedSize: 0,
      collapsible: false,
    });
  });

  test("it should keep the bounds in order", () => {
    expect(
      resolveResizablePanelConstraints({
        minSize: 40,
        maxSize: 20,
        collapsedSize: 60,
        collapsible: true,
      }),
    ).toEqual({
      minSize: 40,
      maxSize: 40,
      collapsedSize: 40,
      collapsible: true,
    });
  });
});

describe("clampResizablePanelSize", () => {
  test("it should clamp into minSize and maxSize", () => {
    expect(clampResizablePanelSize({ minSize: 10, maxSize: 60 }, 5)).toBe(10);
    expect(clampResizablePanelSize({ minSize: 10, maxSize: 60 }, 80)).toBe(60);
    expect(clampResizablePanelSize({ minSize: 10, maxSize: 60 }, 30)).toBe(30);
  });

  test("it should collapse past the halfway point", () => {
    const panel = { minSize: 20, collapsedSize: 4, collapsible: true };

    expect(clampResizablePanelSize(panel, 13)).toBe(20);
    expect(clampResizablePanelSize(panel, 11)).toBe(4);
    expect(clampResizablePanelSize(panel, 0)).toBe(4);
  });
});

describe("isResizablePanelCollapsed", () => {
  test("it should match collapsedSize on a collapsible panel", () => {
    expect(isResizablePanelCollapsed({ collapsible: true }, 0)).toBe(true);
    expect(isResizablePanelCollapsed({ collapsible: true }, 10)).toBe(false);
    expect(isResizablePanelCollapsed({}, 0)).toBe(false);
    expect(isResizablePanelCollapsed({ collapsible: true }, undefined)).toBe(
      false,
    );
  });
});

describe("resolveResizableLayout", () => {
  test("it should share the space evenly", () => {
    expect(rounded(resolveResizableLayout([{}, {}, {}]))).toEqual([
      33.333, 33.333, 33.333,
    ]);
  });

  test("it should honor defaultSize and share the rest", () => {
    expect(
      resolveResizableLayout([{ defaultSize: 25 }, {}, { defaultSize: 25 }]),
    ).toEqual([25, 50, 25]);
  });

  test("it should scale sizes that do not add up to 100", () => {
    expect(
      resolveResizableLayout([{ defaultSize: 30 }, { defaultSize: 30 }]),
    ).toEqual([50, 50]);
  });

  test("it should prefer known sizes over defaultSize", () => {
    expect(
      resolveResizableLayout(
        [{ defaultSize: 50 }, { defaultSize: 50 }],
        [70, 30],
      ),
    ).toEqual([70, 30]);
  });

  test("it should give a new panel an even share", () => {
    expect(rounded(resolveResizableLayout([{}, {}, {}], [50, 50]))).toEqual([
      37.5, 37.5, 25,
    ]);
  });

  test("it should fit each panel's constraints", () => {
    expect(resolveResizableLayout([{ maxSize: 20 }, {}], [50, 50])).toEqual([
      20, 80,
    ]);
  });

  test("it should return an empty layout without panels", () => {
    expect(resolveResizableLayout([])).toEqual([]);
  });
});

describe("fitResizableLayout", () => {
  test("it should keep collapsed panels collapsed", () => {
    expect(
      fitResizableLayout(
        [{ minSize: 10, collapsible: true }, { maxSize: 50 }, {}],
        [0, 50, 40],
      ),
    ).toEqual([0, 50, 50]);
  });
});

describe("resizeResizableLayout", () => {
  test("it should grow the panel before the handle", () => {
    expect(
      resizeResizableLayout({
        delta: 10,
        handleIndex: 0,
        panels: [{}, {}],
        layout: [50, 50],
      }),
    ).toEqual([60, 40]);
  });

  test("it should grow the panel after the handle", () => {
    expect(
      resizeResizableLayout({
        delta: -10,
        handleIndex: 0,
        panels: [{}, {}],
        layout: [50, 50],
      }),
    ).toEqual([40, 60]);
  });

  test("it should stop at minSize and maxSize", () => {
    expect(
      resizeResizableLayout({
        delta: 40,
        handleIndex: 0,
        layout: [50, 50],
        panels: [{}, { minSize: 30 }],
      }),
    ).toEqual([70, 30]);
    expect(
      resizeResizableLayout({
        delta: 40,
        handleIndex: 0,
        layout: [50, 50],
        panels: [{ maxSize: 60 }, {}],
      }),
    ).toEqual([60, 40]);
  });

  test("it should take space from farther panels once a neighbor is at minSize", () => {
    expect(
      resizeResizableLayout({
        delta: 30,
        handleIndex: 0,
        layout: [40, 30, 30],
        panels: [{}, { minSize: 20 }, {}],
      }),
    ).toEqual([70, 20, 10]);
  });

  test("it should collapse a panel past its halfway point", () => {
    const panels = [{}, { minSize: 20, collapsible: true }];

    expect(
      resizeResizableLayout({
        panels,
        delta: 15,
        handleIndex: 0,
        layout: [70, 30],
      }),
    ).toEqual([80, 20]);
    expect(
      resizeResizableLayout({
        panels,
        delta: 21,
        handleIndex: 0,
        layout: [70, 30],
      }),
    ).toEqual([100, 0]);
  });

  test("it should expand a collapsed panel past its halfway point", () => {
    const panels = [{ minSize: 20, collapsible: true }, {}];

    expect(
      resizeResizableLayout({
        panels,
        delta: 5,
        handleIndex: 0,
        layout: [0, 100],
      }),
    ).toEqual([0, 100]);
    expect(
      resizeResizableLayout({
        panels,
        delta: 12,
        handleIndex: 0,
        layout: [0, 100],
      }),
    ).toEqual([20, 80]);
  });

  test("it should leave the layout alone for an invalid handle", () => {
    const layout = [50, 50];

    expect(
      resizeResizableLayout({
        layout,
        delta: 10,
        handleIndex: 1,
        panels: [{}, {}],
      }),
    ).toBe(layout);
    expect(
      resizeResizableLayout({
        layout,
        handleIndex: 0,
        panels: [{}, {}],
        delta: Number.NaN,
      }),
    ).toBe(layout);
  });
});

describe("resizeResizablePanel", () => {
  test("it should set a panel through the handle after it", () => {
    expect(
      resizeResizablePanel({
        size: 20,
        index: 0,
        panels: [{}, {}, {}],
        layout: [40, 30, 30],
      }),
    ).toEqual([20, 50, 30]);
  });

  test("it should set the last panel through the handle before it", () => {
    expect(
      resizeResizablePanel({
        index: 2,
        size: 10,
        panels: [{}, {}, {}],
        layout: [40, 30, 30],
      }),
    ).toEqual([40, 50, 10]);
  });

  test("it should collapse a collapsible panel", () => {
    expect(
      resizeResizablePanel({
        size: 0,
        index: 1,
        layout: [50, 50],
        panels: [{}, { minSize: 20, collapsible: true }],
      }),
    ).toEqual([100, 0]);
  });
});

describe("getResizableLayoutFromKey", () => {
  const panels = [{ minSize: 10, maxSize: 80 }, {}];

  test("it should move by step with the arrow keys", () => {
    expect(
      getResizableLayoutFromKey({
        panels,
        step: 5,
        handleIndex: 0,
        layout: [50, 50],
        key: "ArrowRight",
        orientation: "horizontal",
      }),
    ).toEqual([55, 45]);
    expect(
      getResizableLayoutFromKey({
        panels,
        handleIndex: 0,
        key: "ArrowUp",
        layout: [50, 50],
        orientation: "vertical",
      }),
    ).toEqual([40, 60]);
  });

  test("it should flip the horizontal arrows in rtl", () => {
    expect(
      getResizableLayoutFromKey({
        panels,
        rtl: true,
        handleIndex: 0,
        layout: [50, 50],
        key: "ArrowRight",
        orientation: "horizontal",
      }),
    ).toEqual([40, 60]);
  });

  test("it should jump to the bounds with Home and End", () => {
    expect(
      getResizableLayoutFromKey({
        panels,
        key: "Home",
        handleIndex: 0,
        layout: [50, 50],
        orientation: "horizontal",
      }),
    ).toEqual([10, 90]);
    expect(
      getResizableLayoutFromKey({
        panels,
        key: "End",
        handleIndex: 0,
        layout: [50, 50],
        orientation: "horizontal",
      }),
    ).toEqual([80, 20]);
  });

  test("it should toggle a collapsible panel with Enter", () => {
    const collapsible = [{ minSize: 20, collapsible: true }, {}];

    expect(
      getResizableLayoutFromKey({
        key: "Enter",
        handleIndex: 0,
        layout: [40, 60],
        panels: collapsible,
        orientation: "horizontal",
      }),
    ).toEqual([0, 100]);
    expect(
      getResizableLayoutFromKey({
        key: "Enter",
        handleIndex: 0,
        expandedSize: 40,
        layout: [0, 100],
        panels: collapsible,
        orientation: "horizontal",
      }),
    ).toEqual([40, 60]);
  });

  test("it should ignore other keys", () => {
    expect(
      getResizableLayoutFromKey({
        panels,
        key: "Enter",
        handleIndex: 0,
        layout: [50, 50],
        orientation: "horizontal",
      }),
    ).toBeNull();
    expect(
      getResizableLayoutFromKey({
        panels,
        key: "a",
        handleIndex: 0,
        layout: [50, 50],
        orientation: "horizontal",
      }),
    ).toBeNull();
  });
});

describe("getResizablePointerDelta", () => {
  test("it should turn pointer travel into a percent", () => {
    expect(
      getResizablePointerDelta({
        size: 400,
        start: 100,
        current: 140,
        orientation: "horizontal",
      }),
    ).toBe(10);
  });

  test("it should flip the horizontal axis in rtl", () => {
    expect(
      getResizablePointerDelta({
        rtl: true,
        size: 400,
        start: 100,
        current: 140,
        orientation: "horizontal",
      }),
    ).toBe(-10);
    expect(
      getResizablePointerDelta({
        rtl: true,
        size: 400,
        start: 100,
        current: 140,
        orientation: "vertical",
      }),
    ).toBe(10);
  });

  test("it should return 0 without a group size", () => {
    expect(
      getResizablePointerDelta({
        size: 0,
        start: 0,
        current: 40,
        orientation: "horizontal",
      }),
    ).toBe(0);
  });
});

describe("getResizablePanelStyle", () => {
  test("it should use the size as the flex grow", () => {
    expect(getResizablePanelStyle(undefined)).toEqual({ flex: "1 1 0px" });
    expect(getResizablePanelStyle(33.33333)).toEqual({ flex: "33.333 1 0px" });
  });
});

describe("getResizableCursor", () => {
  test("it should match the group axis", () => {
    expect(getResizableCursor("vertical")).toBe("row-resize");
    expect(getResizableCursor("horizontal")).toBe("col-resize");
  });
});

describe("getResizableHandleAria", () => {
  test("it should describe the panel before the handle", () => {
    expect(
      getResizableHandleAria(
        [33.4, 66.6],
        [{ minSize: 10, maxSize: 90 }, {}],
        0,
      ),
    ).toEqual({
      "aria-valuemin": 10,
      "aria-valuemax": 90,
      "aria-valuenow": 33,
    });
  });
});

describe("sortResizableItemsByDocumentOrder", () => {
  test("it should follow the document order", () => {
    const root = document.createElement("div");
    const first = document.createElement("div");
    const second = document.createElement("div");

    root.append(first, second);

    const items = [
      { id: "b", element: second },
      { id: "x", element: null },
      { id: "a", element: first },
    ];

    expect(
      sortResizableItemsByDocumentOrder(items, (item) => item.element).map(
        (item) => item.id,
      ),
    ).toEqual(["a", "b", "x"]);
  });
});

describe("getResizableItemIndexes", () => {
  test("it should index handles by the panel before them", () => {
    expect(
      getResizableItemIndexes([
        { id: "p1", kind: "panel" },
        { id: "h1", kind: "handle" },
        { id: "p2", kind: "panel" },
        { id: "h2", kind: "handle" },
        { id: "p3", kind: "panel" },
      ]),
    ).toEqual({
      panelIds: ["p1", "p2", "p3"],
      handleIndexes: { h1: 0, h2: 1 },
    });
  });
});
