// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import {
  applyDateSelection,
  calendarPanelViewFromGranularity,
  clampCalendarPanelView,
  dateFromYear,
  dateFromYearMonth,
  formatDatePickerModel,
  isCalendarMonthPanelHidden,
  isCalendarYearPanelHidden,
  isDateDisabled,
  isDateInRangePreview,
  isDateSelected,
  normalizeDateToGranularity,
  resolveCalendarDayInteractionState,
  resolveCalendarPanelView,
  resolveDatePickerMode,
  resolveStartOfWeek,
  sortDateRangeValue,
} from "@/Domain/date";

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

  test("it should commit month-start dates at month granularity", () => {
    const midMonth = adapter.parse("2021-05-21")!;

    expect(
      applyDateSelection({
        adapter,
        value: null,
        next: midMonth,
        mode: "single",
        granularity: "month",
      }),
    ).toEqual(adapter.parse("2021-05-01"));
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

  test("it should compare min and max at month granularity", () => {
    const march = adapter.parse("2021-03-20")!;

    expect(
      isDateDisabled(march, {
        adapter,
        granularity: "month",
        maxDate: adapter.parse("2021-03-15")!,
      }),
    ).toBe(false);

    expect(
      isDateDisabled(adapter.parse("2021-04-01")!, {
        adapter,
        granularity: "month",
        maxDate: adapter.parse("2021-03-15")!,
      }),
    ).toBe(true);
  });

  test("it should select a whole month from a mid-month value", () => {
    expect(
      isDateSelected({
        adapter,
        mode: "single",
        granularity: "month",
        date: adapter.parse("2021-05-01")!,
        value: adapter.parse("2021-05-21")!,
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
        selected: true,
      }),
    ).toBe("selected");

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

describe("calendar granularity", () => {
  test("it should map granularity to the commit panel", () => {
    expect(calendarPanelViewFromGranularity("day")).toBe("date");
    expect(calendarPanelViewFromGranularity("month")).toBe("month");
    expect(calendarPanelViewFromGranularity("year")).toBe("year");
  });

  test("it should clamp views deeper than granularity", () => {
    expect(clampCalendarPanelView("date", "month")).toBe("month");
    expect(clampCalendarPanelView("month", "year")).toBe("year");
    expect(clampCalendarPanelView("year", "month")).toBe("year");
  });

  test("it should keep the commit panel visible when hide flags match granularity", () => {
    expect(
      resolveCalendarPanelView({
        view: "month",
        hideMonths: true,
        granularity: "month",
      }),
    ).toBe("month");

    expect(
      resolveCalendarPanelView({
        view: "year",
        hideYears: true,
        granularity: "year",
      }),
    ).toBe("year");

    expect(isCalendarMonthPanelHidden({ hideMonths: true })).toBe(true);
    expect(
      isCalendarMonthPanelHidden({
        hideMonths: true,
        granularity: "month",
      }),
    ).toBe(false);
    expect(
      isCalendarYearPanelHidden({
        hideYears: true,
        granularity: "year",
      }),
    ).toBe(false);
  });

  test("it should normalize dates on commit", () => {
    const mid = adapter.parse("2021-05-21")!;

    expect(normalizeDateToGranularity(mid, "month", adapter)).toEqual(
      adapter.parse("2021-05-01"),
    );
    expect(normalizeDateToGranularity(mid, "year", adapter)).toEqual(
      adapter.parse("2021-01-01"),
    );
    expect(dateFromYearMonth({ adapter, month: 4, year: 2021 })).toEqual(
      adapter.parse("2021-05-01"),
    );
    expect(dateFromYear({ adapter, year: 2021 })).toEqual(
      adapter.parse("2021-01-01"),
    );
  });

  test("it should format picker models at month and year granularity", () => {
    const may = adapter.parse("2021-05-21")!;

    adapter.setLocale?.("en-US");
    expect(formatDatePickerModel(may, adapter, undefined, "month")).toBe(
      "May 2021",
    );
    expect(formatDatePickerModel(may, adapter, undefined, "year")).toBe("2021");
    expect(
      formatDatePickerModel(
        [adapter.parse("2021-05-01")!, adapter.parse("2021-09-01")!],
        adapter,
        undefined,
        "month",
      ),
    ).toMatch(/May 2021.+Sep(tember)? 2021/);
  });
});
