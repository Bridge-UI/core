// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { collapseBreadcrumbItems } from "@/Domain/breadcrumb";

describe("collapseBreadcrumbItems", () => {
  test("it should return all items when under the max", () => {
    expect(collapseBreadcrumbItems(["a", "b", "c"], 5)).toEqual([
      { index: 0, item: "a", type: "item" },
      { index: 1, item: "b", type: "item" },
      { index: 2, item: "c", type: "item" },
    ]);
  });

  test("it should return all items when maxItems is omitted", () => {
    expect(collapseBreadcrumbItems(["a", "b"])).toEqual([
      { index: 0, item: "a", type: "item" },
      { index: 1, item: "b", type: "item" },
    ]);
  });

  test("it should keep first and last with an ellipsis when maxItems is 3", () => {
    expect(collapseBreadcrumbItems(["home", "a", "b", "c", "page"], 3)).toEqual(
      [
        { index: 0, type: "item", item: "home" },
        { type: "ellipsis" },
        { index: 4, type: "item", item: "page" },
      ],
    );
  });

  test("it should keep a longer tail when maxItems is 4", () => {
    expect(collapseBreadcrumbItems(["home", "a", "b", "c", "page"], 4)).toEqual(
      [
        { index: 0, type: "item", item: "home" },
        { type: "ellipsis" },
        { index: 3, item: "c", type: "item" },
        { index: 4, type: "item", item: "page" },
      ],
    );
  });

  test("it should return only the last item when maxItems is 1", () => {
    expect(collapseBreadcrumbItems(["a", "b", "c"], 1)).toEqual([
      { index: 2, item: "c", type: "item" },
    ]);
  });
});
