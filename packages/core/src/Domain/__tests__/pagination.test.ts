// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { getPaginationItems } from "@/Domain/pagination";

describe("getPaginationItems", () => {
  test("it should return every page when the range fits", () => {
    expect(
      getPaginationItems({
        page: 1,
        count: 5,
        siblingCount: 1,
        boundaryCount: 1,
      }),
    ).toEqual([
      { page: 1, type: "page" },
      { page: 2, type: "page" },
      { page: 3, type: "page" },
      { page: 4, type: "page" },
      { page: 5, type: "page" },
    ]);
  });

  test("it should insert ellipsis when collapsing a long range", () => {
    expect(
      getPaginationItems({
        page: 5,
        count: 12,
        siblingCount: 1,
        boundaryCount: 1,
      }),
    ).toEqual([
      { page: 1, type: "page" },
      { type: "ellipsis" },
      { page: 4, type: "page" },
      { page: 5, type: "page" },
      { page: 6, type: "page" },
      { type: "ellipsis" },
      { page: 12, type: "page" },
    ]);
  });

  test("it should keep start and end boundaries", () => {
    expect(
      getPaginationItems({
        page: 10,
        count: 20,
        siblingCount: 1,
        boundaryCount: 2,
      }),
    ).toEqual([
      { page: 1, type: "page" },
      { page: 2, type: "page" },
      { type: "ellipsis" },
      { page: 9, type: "page" },
      { page: 10, type: "page" },
      { page: 11, type: "page" },
      { type: "ellipsis" },
      { page: 19, type: "page" },
      { page: 20, type: "page" },
    ]);
  });

  test("it should clamp page into the valid range", () => {
    expect(
      getPaginationItems({
        page: 0,
        count: 3,
        siblingCount: 1,
        boundaryCount: 1,
      }),
    ).toEqual([
      { page: 1, type: "page" },
      { page: 2, type: "page" },
      { page: 3, type: "page" },
    ]);

    expect(
      getPaginationItems({
        page: 99,
        count: 3,
        siblingCount: 1,
        boundaryCount: 1,
      }),
    ).toEqual([
      { page: 1, type: "page" },
      { page: 2, type: "page" },
      { page: 3, type: "page" },
    ]);
  });

  test("it should return an empty list when count is zero", () => {
    expect(
      getPaginationItems({
        page: 1,
        count: 0,
        siblingCount: 1,
        boundaryCount: 1,
      }),
    ).toEqual([]);
  });
});
