// ** External Imports
import { describe, expect, test } from "vitest";

// ** Core Imports
import type { DateAdapter } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { createDateFnsDateAdapter } from "@/Adapters/Examples/date-date-fns";
import { createDayjsDateAdapter } from "@/Adapters/Examples/date-dayjs";
import { createLuxonDateAdapter } from "@/Adapters/Examples/date-luxon";
import { createMomentDateAdapter } from "@/Adapters/Examples/date-moment";

const adapters: [string, DateAdapter][] = [
  ["date-fns", createDateFnsDateAdapter()],
  ["dayjs", createDayjsDateAdapter()],
  ["luxon", createLuxonDateAdapter()],
  ["moment", createMomentDateAdapter()],
];

describe.each(adapters)("%s date adapter", (_name, adapter) => {
  test("it should parse ISO dates and format by granularity", () => {
    const date = adapter.parse("2021-05-21");

    expect(date).not.toBeNull();
    expect(adapter.getYear(date!)).toBe(2021);
    expect(adapter.getMonth(date!)).toBe(4);
    expect(adapter.getDate(date!)).toBe(21);
    expect(
      adapter.format(date!, { locale: "en-US" }, { granularity: "month" }),
    ).toBe("May 2021");
    expect(
      adapter.format(date!, { locale: "en-US" }, { granularity: "year" }),
    ).toBe("2021");
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
});
