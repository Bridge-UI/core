// ** External Imports
import { expect, test } from "vitest";

// ** Core Imports
import { copyDateWallClock } from "@bridge-ui/core/Domain";

// ** Local Imports
import { createLuxonDateAdapter } from "@/Adapters/Examples/date-luxon";

const adapter = createLuxonDateAdapter();

test("it should parse ISO dates and format by granularity", () => {
  const date = adapter.parse("2021-05-21");

  expect(date).not.toBeNull();
  expect(adapter.getDate(date!)).toBe(21);
  expect(adapter.getMonth(date!)).toBe(4);
  expect(adapter.getYear(date!)).toBe(2021);
  adapter.setLocale?.("en-US");
  expect(adapter.format(date!, undefined, { granularity: "month" })).toBe(
    "May 2021",
  );
  expect(adapter.format(date!, undefined, { granularity: "year" })).toBe(
    "2021",
  );
});

test("it should add days months and years", () => {
  const date = adapter.parse("2021-05-21")!;

  expect(adapter.getDate(adapter.addDays(date, 10))).toBe(31);
  expect(adapter.getMonth(adapter.addMonths(date, 1))).toBe(5);
  expect(adapter.getYear(adapter.addYears(date, 1))).toBe(2022);
});

test("it should parse 24h times", () => {
  const parsed = adapter.parseTime("14:30");

  expect(parsed).not.toBeNull();
  expect(adapter.getHours(parsed!)).toBe(14);
  expect(adapter.getMinutes(parsed!)).toBe(30);
});

const saoPaulo = "America/Sao_Paulo";

test("it should treat Sao Paulo wall clock as a UTC instant", () => {
  let date = adapter.parse("2024-01-15", saoPaulo)!;

  date = adapter.setHours(date, 15, saoPaulo);
  date = adapter.setMinutes(date, 0, saoPaulo);
  date = adapter.setSeconds(date, 0, saoPaulo);

  expect(date.toISOString()).toBe("2024-01-15T18:00:00.000Z");
  expect(adapter.getHours(date, saoPaulo)).toBe(15);
});

test("it should copy Sao Paulo wall clock into UTC without converting", () => {
  let date = adapter.parse("2024-01-15", saoPaulo)!;

  date = adapter.setHours(date, 15, saoPaulo);
  date = adapter.setMinutes(date, 0, saoPaulo);
  date = adapter.setSeconds(date, 0, saoPaulo);

  const value = copyDateWallClock({
    date,
    adapter,
    toTimeZone: "UTC",
    fromTimeZone: saoPaulo,
  });

  expect(value.toISOString()).toBe("2024-01-15T15:00:00.000Z");
});

test("it should keep UTC wall clock when the field zone is UTC", () => {
  let date = adapter.parse("2024-01-15", "UTC")!;

  date = adapter.setHours(date, 15, "UTC");
  date = adapter.setMinutes(date, 0, "UTC");
  date = adapter.setSeconds(date, 0, "UTC");

  expect(adapter.getHours(date, "UTC")).toBe(15);
  expect(date.toISOString()).toBe("2024-01-15T15:00:00.000Z");
});
