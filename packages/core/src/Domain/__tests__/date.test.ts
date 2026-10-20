// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import {
  CALENDAR_YEAR_PAGE_SIZE,
  applyDateSelection,
  calendarPanelViewFromGranularity,
  clampCalendarPanelView,
  dateFromYear,
  dateFromYearMonth,
  formatDatePickerModel,
  getCalendarNavigationMessage,
  getCalendarYearPageStart,
  isCalendarMonthPanelHidden,
  isCalendarYearPanelHidden,
  isDateDisabled,
  isDateInRangePreview,
  isDateSelected,
  normalizeDateToGranularity,
  resolveCalendarDayInteractionState,
  resolveCalendarFocusDate,
  resolveCalendarMonthSelection,
  resolveCalendarNavigation,
  resolveCalendarPanelView,
  resolveCalendarYearSelection,
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

describe("getCalendarYearPageStart", () => {
  test("it should center the year in the page", () => {
    expect(getCalendarYearPageStart(2024)).toBe(
      2024 - Math.floor(CALENDAR_YEAR_PAGE_SIZE / 2),
    );
  });

  test("it should never start before year 1", () => {
    expect(getCalendarYearPageStart(3)).toBe(1);
  });
});

describe("resolveCalendarFocusDate", () => {
  test("it should use the first selected date", () => {
    const first = adapter.parse("2021-05-21")!;
    const second = adapter.parse("2021-06-01")!;

    expect(resolveCalendarFocusDate(first, adapter)).toBe(first);
    expect(resolveCalendarFocusDate([first, second], adapter)).toBe(first);
  });

  test("it should fall back to now for empty models", () => {
    expect(resolveCalendarFocusDate(null, adapter)).toBeInstanceOf(Date);
    expect(resolveCalendarFocusDate([], adapter)).toBeInstanceOf(Date);
  });
});

describe("resolveCalendarNavigation", () => {
  const viewDate = adapter.parse("2021-05-01")!;

  test("it should page years in the year view", () => {
    expect(
      resolveCalendarNavigation({
        adapter,
        viewDate,
        view: "year",
        direction: 1,
        yearPageStart: 2010,
      }),
    ).toEqual({ type: "yearPage", yearPageStart: 2025 });
    expect(
      resolveCalendarNavigation({
        adapter,
        viewDate,
        view: "year",
        direction: -1,
        yearPageStart: 10,
      }),
    ).toEqual({ type: "yearPage", yearPageStart: 1 });
  });

  test("it should move one year in the month view", () => {
    const navigation = resolveCalendarNavigation({
      adapter,
      viewDate,
      view: "month",
      direction: -1,
      yearPageStart: 2010,
    });

    expect(navigation.type).toBe("viewDate");
    expect(
      navigation.type === "viewDate" && adapter.getYear(navigation.viewDate),
    ).toBe(2020);
  });

  test("it should move one month in the date view", () => {
    const navigation = resolveCalendarNavigation({
      adapter,
      viewDate,
      view: "date",
      direction: 1,
      yearPageStart: 2010,
    });

    expect(
      navigation.type === "viewDate" && adapter.getMonth(navigation.viewDate),
    ).toBe(5);
  });
});

describe("getCalendarNavigationMessage", () => {
  test("it should name the step of each view", () => {
    expect(getCalendarNavigationMessage("year", -1)).toBe("Previous years");
    expect(getCalendarNavigationMessage("year", 1)).toBe("Next years");
    expect(getCalendarNavigationMessage("month", -1)).toBe("Previous year");
    expect(getCalendarNavigationMessage("month", 1)).toBe("Next year");
    expect(getCalendarNavigationMessage("date", -1)).toBe("Previous month");
    expect(getCalendarNavigationMessage("date", 1)).toBe("Next month");
  });
});

describe("resolveCalendarYearSelection / resolveCalendarMonthSelection", () => {
  const viewDate = adapter.parse("2021-05-01")!;

  test("it should commit the year on year granularity", () => {
    const selection = resolveCalendarYearSelection({
      adapter,
      viewDate,
      year: 2030,
      granularity: "year",
    });

    expect(selection.type).toBe("commit");
    expect(adapter.getYear(selection.viewDate)).toBe(2030);
    expect(
      selection.type === "commit" && adapter.getMonth(selection.date),
    ).toBe(0);
  });

  test("it should open the month panel after a year pick", () => {
    expect(
      resolveCalendarYearSelection({ adapter, viewDate, year: 2030 }),
    ).toMatchObject({ type: "view", view: "month" });
  });

  test("it should skip hidden months after a year pick", () => {
    expect(
      resolveCalendarYearSelection({
        adapter,
        viewDate,
        year: 2030,
        hideMonths: true,
      }),
    ).toMatchObject({ type: "view", view: "date" });
  });

  test("it should commit the month on month granularity", () => {
    const selection = resolveCalendarMonthSelection({
      adapter,
      viewDate,
      month: 8,
      granularity: "month",
    });

    expect(selection.type).toBe("commit");
    expect(
      selection.type === "commit" && adapter.getMonth(selection.date),
    ).toBe(8);
  });

  test("it should open the date panel after a month pick", () => {
    expect(
      resolveCalendarMonthSelection({ adapter, viewDate, month: 8 }),
    ).toMatchObject({ type: "view", view: "date" });
  });
});
