// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  createNativeDateAdapter,
  defaultNativeDateAdapter,
  isValidDate,
  resolveDefaultTimeZone,
} from "@/Adapters/date";

describe("createNativeDateAdapter", () => {
  const adapter = createNativeDateAdapter();

  test("it should format and parse ISO dates", () => {
    const date = adapter.parse("2021-05-21");

    expect(date).not.toBeNull();
    expect(adapter.getYear(date!)).toBe(2021);
    expect(adapter.getMonth(date!)).toBe(4);
    expect(adapter.getDate(date!)).toBe(21);
  });

  test("it should detect same day / month / year", () => {
    const a = adapter.parse("2021-05-21")!;
    const b = adapter.parse("2021-05-22")!;
    const c = adapter.parse("2021-06-21")!;

    expect(adapter.isSameDay(a, a)).toBe(true);
    expect(adapter.isSameDay(a, b)).toBe(false);
    expect(adapter.isSameMonth(a, b)).toBe(true);
    expect(adapter.isSameMonth(a, c)).toBe(false);
    expect(adapter.isSameYear(a, c)).toBe(true);
  });

  test("it should add days months and years", () => {
    const date = adapter.parse("2021-05-21")!;

    expect(adapter.getDate(adapter.addDays(date, 10))).toBe(31);
    expect(adapter.getMonth(adapter.addMonths(date, 1))).toBe(5);
    expect(adapter.getYear(adapter.addYears(date, 1))).toBe(2022);
  });

  test("it should build a 42-day calendar grid", () => {
    const view = adapter.parse("2021-05-01")!;
    const days = adapter.getCalendarDays(view, 0);

    expect(days).toHaveLength(42);
    expect(adapter.getMonth(days[0]!)).toBe(3);
    expect(adapter.getDate(days[0]!)).toBe(25);
  });

  test("it should expose weekday and month names", () => {
    expect(adapter.getWeekdayNames({ locale: "en-US" })).toHaveLength(7);
    expect(adapter.getMonthNames({ locale: "en-US" })[4]).toMatch(/may/i);
  });
});

describe("defaultNativeDateAdapter", () => {
  test("it should be a shared valid adapter", () => {
    expect(isValidDate(defaultNativeDateAdapter.now())).toBe(true);
  });
});

describe("resolveDefaultTimeZone", () => {
  test("it should return a non-empty IANA zone", () => {
    expect(resolveDefaultTimeZone().length).toBeGreaterThan(0);
  });
});
