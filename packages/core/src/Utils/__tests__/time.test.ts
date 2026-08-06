// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createNativeDateAdapter } from "@/Adapters/date";
import {
  buildHourOptions,
  buildMinuteOptions,
  combineDateAndTime,
  isTimeDisabled,
  snapMinutes,
  to12Hour,
  to24Hour,
  toMeridiem,
} from "@/Utils/time";

describe("buildHourOptions", () => {
  test("it should return 24 hours by default", () => {
    expect(buildHourOptions()).toHaveLength(24);
    expect(buildHourOptions()[0]).toBe(0);
  });

  test("it should return 1-12 when ampm", () => {
    expect(buildHourOptions({ ampm: true })).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });
});

describe("buildMinuteOptions", () => {
  test("it should step by interval", () => {
    expect(buildMinuteOptions({ interval: 15 })).toEqual([0, 15, 30, 45]);
  });
});

describe("hour helpers", () => {
  test("it should convert 12h and meridiem", () => {
    expect(to24Hour(12, "AM")).toBe(0);
    expect(to24Hour(12, "PM")).toBe(12);
    expect(to24Hour(2, "PM")).toBe(14);
    expect(to12Hour(0)).toBe(12);
    expect(to12Hour(14)).toBe(2);
    expect(toMeridiem(11)).toBe("AM");
    expect(toMeridiem(12)).toBe("PM");
  });
});

describe("isTimeDisabled", () => {
  const adapter = createNativeDateAdapter();

  test("it should respect min and max time", () => {
    const min = adapter.setMinutes(adapter.setHours(adapter.now(), 9), 0);
    const max = adapter.setMinutes(adapter.setHours(adapter.now(), 17), 0);
    const early = adapter.setMinutes(adapter.setHours(adapter.now(), 8), 0);
    const ok = adapter.setMinutes(adapter.setHours(adapter.now(), 12), 0);

    expect(isTimeDisabled(early, { adapter, minTime: min, maxTime: max })).toBe(
      true,
    );
    expect(isTimeDisabled(ok, { adapter, minTime: min, maxTime: max })).toBe(
      false,
    );
  });
});

describe("snapMinutes", () => {
  test("it should snap down to interval", () => {
    expect(snapMinutes(17, 15)).toBe(15);
    expect(snapMinutes(0, 5)).toBe(0);
  });
});

describe("combineDateAndTime", () => {
  const adapter = createNativeDateAdapter();

  test("it should merge day and time parts", () => {
    const day = adapter.parse("2021-05-21")!;
    const time = adapter.setMinutes(adapter.setHours(adapter.now(), 14), 30);
    const merged = combineDateAndTime(day, time, adapter);

    expect(adapter.getDate(merged)).toBe(21);
    expect(adapter.getMonth(merged)).toBe(4);
    expect(adapter.getHours(merged)).toBe(14);
    expect(adapter.getMinutes(merged)).toBe(30);
  });
});
