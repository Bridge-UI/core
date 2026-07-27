// @vitest-environment happy-dom

// ** External Imports
import { describe, expect, test, vi } from "vitest";

// ** Local Imports
import type { SelectOption } from "@/Utils/select";
import {
  DEFAULT_SELECT_ASYNC_DEBOUNCE,
  DEFAULT_SELECT_ASYNC_LIMIT,
  createSelectAsyncSearch,
  filterListboxEntries,
  flattenListboxOptions,
  isListboxOptionGroup,
  mapListboxEntriesToRows,
  mergeSelectAsyncOptions,
  normalizeListboxEntries,
  normalizeSelectOption,
  normalizeSelectOptions,
  resolveSelectAsyncDebounce,
  resolveSelectAsyncLimit,
  resolveSelectAsyncOptions,
  selectValuesEqual,
} from "@/Utils/select";

const keys = {
  optionValue: "id",
  optionLabel: "name",
  optionDescription: "email",
} as const;

const option = (value: number, label = `User ${value}`): SelectOption => ({
  value,
  label,
});

describe("normalizeSelectOption", () => {
  test("it should normalize primitive values", () => {
    expect(normalizeSelectOption("apple", keys)).toEqual({
      label: "apple",
      value: "apple",
    });
  });

  test("it should normalize label/value objects", () => {
    expect(
      normalizeSelectOption(
        { value: 1, label: "Jane", description: "jane@example.com" },
        keys,
      ),
    ).toEqual({
      value: 1,
      label: "Jane",
      disabled: false,
      description: "jane@example.com",
      raw: { value: 1, label: "Jane", description: "jane@example.com" },
    });
  });

  test("it should normalize arbitrary objects using option keys", () => {
    expect(
      normalizeSelectOption(
        { id: 2, name: "John", email: "john@example.com" },
        keys,
      ),
    ).toEqual({
      value: 2,
      label: "John",
      disabled: false,
      description: "john@example.com",
      raw: { id: 2, name: "John", email: "john@example.com" },
    });
  });
});

describe("normalizeSelectOptions", () => {
  test("it should return an empty array for empty input", () => {
    expect(normalizeSelectOptions(undefined, keys)).toEqual([]);
  });

  test("it should flatten section groups into options", () => {
    expect(
      normalizeSelectOptions(
        [
          {
            sticky: true,
            title: "Fruits",
            options: [
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
            ],
          },
          { label: "Other", value: "other" },
        ],
        keys,
      ),
    ).toEqual([
      {
        label: "Apple",
        value: "apple",
        disabled: false,
        description: undefined,
        raw: { label: "Apple", value: "apple" },
      },
      {
        label: "Banana",
        value: "banana",
        disabled: false,
        description: undefined,
        raw: { label: "Banana", value: "banana" },
      },
      {
        label: "Other",
        value: "other",
        disabled: false,
        description: undefined,
        raw: { label: "Other", value: "other" },
      },
    ]);
  });
});

describe("isListboxOptionGroup", () => {
  test("it should detect section groups", () => {
    expect(
      isListboxOptionGroup({
        title: "Fruits",
        options: [{ label: "A", value: "a" }],
      }),
    ).toBe(true);
    expect(isListboxOptionGroup({ label: "Apple", value: "apple" })).toBe(
      false,
    );
  });
});

describe("normalizeListboxEntries", () => {
  test("it should preserve sections and standalone options", () => {
    expect(
      normalizeListboxEntries(
        [
          {
            sticky: true,
            title: "Fruits",
            options: [{ label: "Apple", value: "apple" }],
          },
          { label: "Other", value: "other" },
        ],
        keys,
      ),
    ).toEqual([
      {
        sticky: true,
        type: "section",
        title: "Fruits",
        options: [
          {
            label: "Apple",
            value: "apple",
            disabled: false,
            description: undefined,
            raw: { label: "Apple", value: "apple" },
          },
        ],
      },
      {
        type: "option",
        option: {
          label: "Other",
          value: "other",
          disabled: false,
          description: undefined,
          raw: { label: "Other", value: "other" },
        },
      },
    ]);
  });
});

describe("filterListboxEntries", () => {
  test("it should drop empty sections after filtering", () => {
    const entries = normalizeListboxEntries(
      [
        {
          title: "Fruits",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Carrot", value: "carrot" },
          ],
        },
        { label: "Other", value: "other" },
      ],
      keys,
    );

    expect(
      filterListboxEntries(entries, (option) =>
        option.label.toLowerCase().includes("app"),
      ),
    ).toEqual([
      {
        sticky: false,
        type: "section",
        title: "Fruits",
        options: [
          {
            label: "Apple",
            value: "apple",
            disabled: false,
            description: undefined,
            raw: { label: "Apple", value: "apple" },
          },
        ],
      },
    ]);
  });
});

describe("flattenListboxOptions", () => {
  test("it should flatten section options in order", () => {
    const entries = normalizeListboxEntries(
      [
        {
          title: "Fruits",
          options: [{ label: "Apple", value: "apple" }],
        },
        { label: "Other", value: "other" },
      ],
      keys,
    );

    expect(
      flattenListboxOptions(entries).map((option) => option.value),
    ).toEqual(["apple", "other"]);
  });
});

describe("mapListboxEntriesToRows", () => {
  test("it should map sections and options with flat indices", () => {
    const entries = normalizeListboxEntries(
      [
        {
          title: "Fruits",
          sticky: true,
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ],
        },
        { label: "Other", value: "other" },
      ],
      keys,
    );

    expect(
      mapListboxEntriesToRows(entries, (value) => value === "banana"),
    ).toEqual([
      {
        kind: "section",
        title: "Fruits",
        sticky: true,
        key: "section-0-Fruits",
      },
      {
        kind: "option",
        index: 0,
        key: "apple",
        selected: false,
        option: expect.objectContaining({ value: "apple" }),
      },
      {
        kind: "option",
        index: 1,
        key: "banana",
        selected: true,
        option: expect.objectContaining({ value: "banana" }),
      },
      {
        kind: "option",
        index: 2,
        key: "other",
        selected: false,
        option: expect.objectContaining({ value: "other" }),
      },
    ]);
  });
});

describe("selectValuesEqual", () => {
  test("it should compare values as strings", () => {
    expect(selectValuesEqual(1, "1")).toBe(true);
    expect(selectValuesEqual(1, 2)).toBe(false);
  });
});

describe("resolveSelectAsyncLimit", () => {
  test("it should default to the shared async results limit", () => {
    expect(
      resolveSelectAsyncLimit({
        search: async () => [],
      }),
    ).toBe(DEFAULT_SELECT_ASYNC_LIMIT);
  });

  test("it should use asyncData.limit when provided", () => {
    expect(
      resolveSelectAsyncLimit({
        limit: 5,
        search: async () => [],
      }),
    ).toBe(5);
  });
});

describe("resolveSelectAsyncDebounce", () => {
  test("it should default to the shared async debounce delay", () => {
    expect(
      resolveSelectAsyncDebounce({
        search: async () => [],
      }),
    ).toBe(DEFAULT_SELECT_ASYNC_DEBOUNCE);
  });

  test("it should use asyncData.debounce when provided", () => {
    expect(
      resolveSelectAsyncDebounce({
        debounce: 300,
        search: async () => [],
      }),
    ).toBe(300);
  });
});

describe("createSelectAsyncSearch", () => {
  test("it should debounce search calls while typing", () => {
    vi.useFakeTimers();

    const fetch = vi.fn();
    const search = createSelectAsyncSearch(fetch, 500);

    search.searchDebounced("a");
    search.searchDebounced("ab");
    search.searchDebounced("abc");

    expect(fetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("abc");

    vi.useRealTimers();
  });

  test("it should fetch immediately with searchImmediate", () => {
    const fetch = vi.fn();
    const search = createSelectAsyncSearch(fetch, 500);

    search.searchImmediate("");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("");
  });

  test("it should cancel a pending debounced search", () => {
    vi.useFakeTimers();

    const fetch = vi.fn();
    const search = createSelectAsyncSearch(fetch, 500);

    search.searchDebounced("abc");
    search.cancel();

    vi.advanceTimersByTime(500);

    expect(fetch).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});

describe("resolveSelectAsyncOptions", () => {
  test("it should respect asyncData.limit", async () => {
    const search = Array.from({ length: 10 }, (_, index) => option(index + 10));

    const result = await resolveSelectAsyncOptions(
      {
        limit: 3,
        search: async () => search,
      },
      "",
      [],
      (items) => normalizeSelectOptions(items, keys),
    );

    expect(result.options).toHaveLength(3);
    expect(result.options.map((item) => item.value)).toEqual([10, 11, 12]);
  });
});

describe("mergeSelectAsyncOptions", () => {
  test("it should place selected options before search results", () => {
    const merged = mergeSelectAsyncOptions(
      [option(1), option(2)],
      [option(3), option(4)],
    );

    expect(merged.map((item) => item.value)).toEqual([1, 2, 3, 4]);
  });

  test("it should dedupe options by value", () => {
    const merged = mergeSelectAsyncOptions(
      [option(1, "Selected A")],
      [option(1, "Search A"), option(2)],
    );

    expect(merged).toHaveLength(2);
    expect(merged[0]?.label).toBe("Selected A");
    expect(merged[1]?.value).toBe(2);
  });

  test("it should respect the results limit", () => {
    const search = Array.from({ length: 25 }, (_, index) => option(index + 10));

    const merged = mergeSelectAsyncOptions([option(1), option(2)], search, 5);

    expect(merged).toHaveLength(5);
    expect(merged.map((item) => item.value)).toEqual([1, 2, 10, 11, 12]);
  });

  test("it should default to the shared async results limit", () => {
    const search = Array.from(
      { length: DEFAULT_SELECT_ASYNC_LIMIT + 5 },
      (_, index) => option(index + 10),
    );

    const merged = mergeSelectAsyncOptions([], search);

    expect(merged).toHaveLength(DEFAULT_SELECT_ASYNC_LIMIT);
  });
});
