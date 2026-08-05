// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import {
  applyDateSelection,
  isDateDisabled,
  isDateInRangePreview,
  isDateSelected,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
  resolveStartOfWeek,
  sortDateRangeValue,
} from "@/Utils/date";

const adapter = createNativeDateAdapter();

describe("resolveDatePickerMode", () => {
  test("it should default to single", () => {
    expect(resolveDatePickerMode()).toBe("single");
  });

  test("it should prefer range over multiple", () => {
    expect(resolveDatePickerMode({ range: true, multiple: true })).toBe(
      "range",
    );
  });
});

describe("applyDateSelection", () => {
  test("it should replace single values", () => {
    const next = adapter.parse("2021-05-21")!;

    expect(
      applyDateSelection({
        next,
        adapter,
        mode: "single",
        value: adapter.parse("2021-01-01"),
      }),
    ).toBe(next);
  });

  test("it should toggle multiple values", () => {
    const first = adapter.parse("2021-05-21")!;
    const second = adapter.parse("2021-05-22")!;

    const withFirst = applyDateSelection({
      adapter,
      next: first,
      value: null,
      mode: "multiple",
    });

    expect(withFirst).toEqual([first]);

    const withBoth = applyDateSelection({
      adapter,
      next: second,
      mode: "multiple",
      value: withFirst,
    });

    expect(withBoth).toEqual([first, second]);

    const withoutFirst = applyDateSelection({
      adapter,
      next: first,
      value: withBoth,
      mode: "multiple",
    });

    expect(withoutFirst).toEqual([second]);
  });

  test("it should build and restart ranges", () => {
    const start = adapter.parse("2021-05-10")!;
    const end = adapter.parse("2021-05-20")!;
    const restart = adapter.parse("2021-06-01")!;

    const incomplete = applyDateSelection({
      adapter,
      next: start,
      value: null,
      mode: "range",
    });

    expect(incomplete).toEqual([start, start]);

    const complete = applyDateSelection({
      adapter,
      next: end,
      mode: "range",
      value: incomplete,
    });

    expect(complete).toEqual([start, end]);

    const nextRange = applyDateSelection({
      adapter,
      mode: "range",
      next: restart,
      value: complete,
    });

    expect(nextRange).toEqual([restart, restart]);
  });
});

describe("isDateDisabled / isDateSelected", () => {
  const day = adapter.parse("2021-05-21")!;

  test("it should respect min and max dates", () => {
    expect(
      isDateDisabled(day, {
        adapter,
        minDate: adapter.parse("2021-05-22")!,
      }),
    ).toBe(true);

    expect(
      isDateDisabled(day, {
        adapter,
        maxDate: adapter.parse("2021-05-20")!,
      }),
    ).toBe(true);
  });

  test("it should match disableDates lists", () => {
    expect(
      isDateDisabled(day, {
        adapter,
        disableDates: [day],
      }),
    ).toBe(true);
  });

  test("it should detect selected days", () => {
    expect(
      isDateSelected({
        adapter,
        date: day,
        value: day,
        mode: "single",
      }),
    ).toBe(true);

    expect(
      isDateSelected({
        adapter,
        date: day,
        mode: "range",
        value: [adapter.parse("2021-05-10")!, adapter.parse("2021-05-25")!],
      }),
    ).toBe(true);
  });
});

describe("sortDateRangeValue / resolveStartOfWeek", () => {
  test("it should sort inverted ranges", () => {
    const start = adapter.parse("2021-05-20")!;
    const end = adapter.parse("2021-05-10")!;

    expect(sortDateRangeValue([start, end], adapter)).toEqual([end, start]);
  });

  test("it should normalize start of week", () => {
    expect(resolveStartOfWeek(7)).toBe(0);
    expect(resolveStartOfWeek(-1)).toBe(6);
  });
});

describe("resolveCalendarDayInteractionState / isDateInRangePreview", () => {
  test("it should resolve interaction priority", () => {
    expect(
      resolveCalendarDayInteractionState({
        preview: true,
        disabled: true,
        selected: true,
      }),
    ).toBe("disabled");

    expect(
      resolveCalendarDayInteractionState({
        readOnly: true,
        selected: true,
      }),
    ).toBe("disabled");

    expect(
      resolveCalendarDayInteractionState({
        preview: true,
        selected: true,
      }),
    ).toBe("selected");

    expect(resolveCalendarDayInteractionState({ preview: true })).toBe("hover");

    expect(resolveCalendarDayInteractionState()).toBe("base");
  });

  test("it should preview days between anchor and hover in an incomplete range", () => {
    const start = adapter.parse("2021-05-10")!;
    const mid = adapter.parse("2021-05-15")!;
    const previewDate = adapter.parse("2021-05-20")!;
    const outside = adapter.parse("2021-05-25")!;

    expect(
      isDateInRangePreview({
        adapter,
        date: mid,
        previewDate,
        value: [start, start],
      }),
    ).toBe(true);

    expect(
      isDateInRangePreview({
        adapter,
        previewDate,
        date: outside,
        value: [start, start],
      }),
    ).toBe(false);

    expect(
      isDateInRangePreview({
        adapter,
        date: mid,
        previewDate,
        value: [start, previewDate],
      }),
    ).toBe(false);
  });
});
