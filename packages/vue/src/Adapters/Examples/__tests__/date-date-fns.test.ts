// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import { createDateFnsDateAdapter } from "@/Adapters/Examples/date-date-fns";

const adapter = createDateFnsDateAdapter();

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
