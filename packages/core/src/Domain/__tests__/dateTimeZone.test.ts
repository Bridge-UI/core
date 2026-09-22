// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import { copyDateWallClock } from "@/Domain/dateTimeZone";

const SAO_PAULO = "America/Sao_Paulo";
const WALL_HOUR = 15;

function wallClockInZone(timeZone: string, hour = WALL_HOUR) {
  const adapter = createNativeDateAdapter();
  let date = adapter.parse("2024-01-15", timeZone)!;

  date = adapter.setHours(date, hour, timeZone);
  date = adapter.setMinutes(date, 0, timeZone);
  date = adapter.setSeconds(date, 0, timeZone);

  return { date, adapter };
}

describe("date time zones", () => {
  test("it should keep a Sao Paulo wall clock as a UTC instant", () => {
    const { date, adapter } = wallClockInZone(SAO_PAULO);

    expect(adapter.getHours(date, SAO_PAULO)).toBe(WALL_HOUR);
    expect(date.toISOString()).toBe("2024-01-15T18:00:00.000Z");
    expect(adapter.formatTime(date, SAO_PAULO)).toMatch(/15:00/);
  });

  test("it should copy Sao Paulo wall clock into UTC for a local v-model", () => {
    const { date, adapter } = wallClockInZone(SAO_PAULO);
    const value = copyDateWallClock({
      date,
      adapter,
      toTimeZone: "UTC",
      fromTimeZone: SAO_PAULO,
    });

    expect(value.toISOString()).toBe("2024-01-15T15:00:00.000Z");
    expect(adapter.getHours(value, "UTC")).toBe(WALL_HOUR);

    const display = copyDateWallClock({
      adapter,
      date: value,
      fromTimeZone: "UTC",
      toTimeZone: SAO_PAULO,
    });

    expect(adapter.getHours(display, SAO_PAULO)).toBe(WALL_HOUR);
    expect(adapter.formatTime(display, SAO_PAULO)).toMatch(/15:00/);
  });

  test("it should keep UTC wall clock without converting from Sao Paulo", () => {
    const { date, adapter } = wallClockInZone("UTC");

    expect(adapter.getHours(date, "UTC")).toBe(WALL_HOUR);
    expect(adapter.formatTime(date, "UTC")).toMatch(/15:00/);
    expect(date.toISOString()).toBe("2024-01-15T15:00:00.000Z");
    expect(adapter.getHours(date, SAO_PAULO)).not.toBe(WALL_HOUR);
  });
});
