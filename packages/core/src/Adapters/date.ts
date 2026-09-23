// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";

/**
 * Options for {@link DateAdapter.formatTime} / {@link DateAdapter.parseTime}.
 */
export type DateAdapterTimeOptions = {
  /**
   * When `true`, use 12-hour clock with AM/PM.
   *
   * @default false
   */
  ampm?: boolean;

  /**
   * When `true`, include seconds in formatted / parsed times.
   *
   * @default false
   */
  showSeconds?: boolean;
};

/**
 * Options for {@link DateAdapter.format}.
 */
export type DateAdapterFormatOptions = {
  /**
   * Calendar unit to format. `"month"` omits the day; `"year"` is the year only.
   *
   * @default "day"
   */
  granularity?: "day" | "year" | "month";
};

/**
 * Pluggable date library for Bridge UI calendars and pickers.
 * Apps may replace the native default via `BridgeUIProvider` `global.dates`.
 *
 * Locale and the default IANA zone live on the adapter (`setLocale` /
 * `setTimeZone`), synced from Bridge global. Per-component `timeZone` is an
 * optional override on methods that need a calendar day.
 *
 * @typeParam TDate - Temporal value type (`Date` for the native adapter).
 */
export interface DateAdapter<TDate = Date> {
  /**
   * Adds calendar days to `date`.
   */
  addDays: (date: TDate, amount: number, timeZone?: string) => TDate;

  /**
   * Adds calendar months to `date`.
   */
  addMonths: (date: TDate, amount: number, timeZone?: string) => TDate;

  /**
   * Adds calendar years to `date`.
   */
  addYears: (date: TDate, amount: number, timeZone?: string) => TDate;

  /**
   * Last instant of the month containing `date` (local / zoned day).
   */
  endOfMonth: (date: TDate, timeZone?: string) => TDate;

  /**
   * Formats `date` for display (e.g. DateField text).
   */
  format: (
    date: TDate,
    timeZone?: string,
    options?: DateAdapterFormatOptions,
  ) => string;

  /**
   * Formats the time-of-day portion of `date` (e.g. TimeField text).
   */
  formatTime: (
    date: TDate,
    timeZone?: string,
    options?: DateAdapterTimeOptions,
  ) => string;

  /**
   * Builds the month grid (leading / trailing outside days included).
   * Length is always a multiple of 7.
   */
  getCalendarDays: (
    view: TDate,
    startOfWeek: number,
    timeZone?: string,
  ) => TDate[];

  /**
   * Day of month `1`–`31`.
   */
  getDate: (date: TDate, timeZone?: string) => number;

  /**
   * Weekday `0` (Sunday) – `6` (Saturday).
   */
  getDay: (date: TDate, timeZone?: string) => number;

  /**
   * Hours `0`–`23` (wall clock in `timeZone` when set).
   */
  getHours: (date: TDate, timeZone?: string) => number;

  /**
   * Minutes `0`–`59`.
   */
  getMinutes: (date: TDate, timeZone?: string) => number;

  /**
   * Month `0` (January) – `11` (December).
   */
  getMonth: (date: TDate, timeZone?: string) => number;

  /**
   * Localized full month names (index `0` = January).
   */
  getMonthNames: () => string[];

  /**
   * Seconds `0`–`59`.
   */
  getSeconds: (date: TDate, timeZone?: string) => number;

  /**
   * Localized short weekday names, ordered Sunday → Saturday.
   */
  getWeekdayNames: () => string[];

  /**
   * Full year (e.g. `2021`).
   */
  getYear: (date: TDate, timeZone?: string) => number;

  /**
   * Whether `a` is after `b` (day precision when used with calendar dates).
   */
  isAfter: (a: TDate, b: TDate, timeZone?: string) => boolean;

  /**
   * Whether `a` is before `b` (day precision when used with calendar dates).
   */
  isBefore: (a: TDate, b: TDate, timeZone?: string) => boolean;

  /**
   * Whether `a` and `b` fall on the same calendar day.
   */
  isSameDay: (a: TDate, b: TDate, timeZone?: string) => boolean;

  /**
   * Whether `a` and `b` fall in the same calendar month.
   */
  isSameMonth: (a: TDate, b: TDate, timeZone?: string) => boolean;

  /**
   * Whether `a` and `b` share the same hour, minute, and second.
   */
  isSameTime: (a: TDate, b: TDate, timeZone?: string) => boolean;

  /**
   * Whether `a` and `b` fall in the same calendar year.
   */
  isSameYear: (a: TDate, b: TDate, timeZone?: string) => boolean;

  /**
   * Current instant (respects `timeZone` when the adapter supports it).
   */
  now: (timeZone?: string) => TDate;

  /**
   * Parses typed / serialized text into a date, or `null` when invalid.
   */
  parse: (value: string, timeZone?: string) => null | TDate;

  /**
   * Parses a time string (`HH:mm`, `HH:mm:ss`, `h:mm a`, or `h:mm:ss a`) into a
   * date anchored on today, or `null` when invalid. Seconds require
   * `options.showSeconds`.
   */
  parseTime: (
    value: string,
    timeZone?: string,
    options?: DateAdapterTimeOptions,
  ) => null | TDate;

  /**
   * Sets the day of month.
   */
  setDate: (date: TDate, day: number, timeZone?: string) => TDate;

  /**
   * Sets the hour (`0`–`23`), preserving calendar day, minutes, and seconds.
   */
  setHours: (date: TDate, hours: number, timeZone?: string) => TDate;

  /**
   * Called by Bridge `setLocale` to sync the adapter’s active locale.
   * Optional for single-locale adapters.
   */
  setLocale?: (locale: string) => void;

  /**
   * Sets the minute (`0`–`59`), preserving calendar day, hours, and seconds.
   */
  setMinutes: (date: TDate, minutes: number, timeZone?: string) => TDate;

  /**
   * Sets the month (`0`–`11`).
   */
  setMonth: (date: TDate, month: number, timeZone?: string) => TDate;

  /**
   * Sets the second (`0`–`59`), preserving calendar day, hours, and minutes.
   */
  setSeconds: (date: TDate, seconds: number, timeZone?: string) => TDate;

  /**
   * Called by Bridge `setTimeZone` to sync the adapter’s default IANA zone.
   * Per-component `timeZone` still overrides via the method argument.
   */
  setTimeZone?: (timeZone: string) => void;

  /**
   * Sets the full year.
   */
  setYear: (date: TDate, year: number, timeZone?: string) => TDate;

  /**
   * Start of the calendar day containing `date`.
   */
  startOfDay: (date: TDate, timeZone?: string) => TDate;

  /**
   * First day of the month containing `date`.
   */
  startOfMonth: (date: TDate, timeZone?: string) => TDate;
}

type DateParts = {
  day: number;
  hours: number;
  minutes: number;
  month: number;
  seconds: number;
  weekday: number;
  year: number;
};

/**
 * Resolves the runtime default IANA time zone.
 */
export function resolveDefaultTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Returns whether `value` is a valid `Date`.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Builds a native {@link DateAdapter} (`TDate = Date`) with no date-library dependency.
 * Calendar math uses local fields when `timeZone` is unset; with `timeZone`, day
 * parts go through `Intl` (`formatToParts`). Full zone conversion for exotic
 * offsets is best handled by a dayjs / luxon adapter.
 * Locale and default IANA zone start unset until {@link DateAdapter.setLocale} /
 * {@link DateAdapter.setTimeZone}.
 */
export function createNativeDateAdapter(): DateAdapter<Date> {
  let locale: string | undefined;
  let timeZone: string | undefined;

  const resolveLocale = () => locale;

  const resolveTimeZone = (override?: string) => override ?? timeZone;

  const getParts = (date: Date, zone?: string): DateParts => {
    const resolvedZone = resolveTimeZone(zone);

    if (isNil(resolvedZone)) {
      return {
        day: date.getDate(),
        hours: date.getHours(),
        month: date.getMonth(),
        weekday: date.getDay(),
        year: date.getFullYear(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      };
    }

    const parts = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      month: "numeric",
      weekday: "short",
      hourCycle: "h23",
      minute: "numeric",
      second: "numeric",
      timeZone: resolvedZone,
    }).formatToParts(date);

    const year = Number(parts.find((part) => part.type === "year")?.value);
    const month =
      Number(parts.find((part) => part.type === "month")?.value) - 1;
    const day = Number(parts.find((part) => part.type === "day")?.value);
    const hours = Number(parts.find((part) => part.type === "hour")?.value);
    const minutes = Number(parts.find((part) => part.type === "minute")?.value);
    const seconds = Number(parts.find((part) => part.type === "second")?.value);
    const weekdayLabel = parts.find((part) => part.type === "weekday")?.value;
    const weekday = weekdayLabelToIndex(weekdayLabel);

    return { day, year, hours, month, minutes, seconds, weekday };
  };

  const fromParts = (
    year: number,
    month: number,
    day: number,
    zone?: string,
    hours = 0,
    minutes = 0,
    seconds = 0,
  ): Date => {
    const resolvedZone = resolveTimeZone(zone);

    if (isNil(resolvedZone)) {
      return new Date(year, month, day, hours, minutes, seconds, 0);
    }

    return zonedDateTime(
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      resolvedZone,
    );
  };

  const adapter: DateAdapter<Date> = {
    now(_zone) {
      return new Date();
    },

    setLocale(next) {
      locale = next;
    },

    setTimeZone(next) {
      timeZone = next;
    },

    getDate(date, timeZone) {
      return getParts(date, timeZone).day;
    },

    getYear(date, timeZone) {
      return getParts(date, timeZone).year;
    },

    getMonth(date, timeZone) {
      return getParts(date, timeZone).month;
    },
    getDay(date, timeZone) {
      return getParts(date, timeZone).weekday;
    },
    getHours(date, timeZone) {
      return getParts(date, timeZone).hours;
    },
    isAfter(a, b, timeZone) {
      return adapter.isBefore(b, a, timeZone);
    },

    getMinutes(date, timeZone) {
      return getParts(date, timeZone).minutes;
    },

    getSeconds(date, timeZone) {
      return getParts(date, timeZone).seconds;
    },

    addYears(date, amount, timeZone) {
      return adapter.addMonths(date, amount * 12, timeZone);
    },

    isSameYear(a, b, timeZone) {
      return getParts(a, timeZone).year === getParts(b, timeZone).year;
    },

    startOfMonth(date, timeZone) {
      const parts = getParts(date, timeZone);

      return fromParts(parts.year, parts.month, 1, timeZone);
    },

    startOfDay(date, timeZone) {
      const parts = getParts(date, timeZone);

      return fromParts(parts.year, parts.month, parts.day, timeZone, 0, 0, 0);
    },

    isSameMonth(a, b, timeZone) {
      const left = getParts(a, timeZone);
      const right = getParts(b, timeZone);

      return left.year === right.year && left.month === right.month;
    },

    getMonthNames() {
      const locale = resolveLocale();
      const formatter = new Intl.DateTimeFormat(locale, { month: "long" });

      return range(12).map((month) => {
        return formatter.format(new Date(2021, month, 1));
      });
    },

    isSameDay(a, b, timeZone) {
      const left = getParts(a, timeZone);
      const right = getParts(b, timeZone);

      return (
        left.year === right.year &&
        left.month === right.month &&
        left.day === right.day
      );
    },

    setDate(date, day, timeZone) {
      const parts = getParts(date, timeZone);

      return fromParts(
        parts.year,
        parts.month,
        day,
        timeZone,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    setYear(date, year, timeZone) {
      const parts = getParts(date, timeZone);

      return fromParts(
        year,
        parts.month,
        parts.day,
        timeZone,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    setMonth(date, month, timeZone) {
      const parts = getParts(date, timeZone);

      return fromParts(
        parts.year,
        month,
        parts.day,
        timeZone,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    isSameTime(a, b, timeZone) {
      const left = getParts(a, timeZone);
      const right = getParts(b, timeZone);

      return (
        left.hours === right.hours &&
        left.minutes === right.minutes &&
        left.seconds === right.seconds
      );
    },

    isBefore(a, b, timeZone) {
      const left = getParts(a, timeZone);
      const right = getParts(b, timeZone);
      const leftKey = left.year * 10_000 + left.month * 100 + left.day;
      const rightKey = right.year * 10_000 + right.month * 100 + right.day;

      return leftKey < rightKey;
    },

    setHours(date, hours, timeZone) {
      const parts = getParts(date, timeZone);
      const nextHours = clamp(hours, 0, 23);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        timeZone,
        nextHours,
        parts.minutes,
        parts.seconds,
      );
    },

    setMinutes(date, minutes, timeZone) {
      const parts = getParts(date, timeZone);
      const nextMinutes = clamp(minutes, 0, 59);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        timeZone,
        parts.hours,
        nextMinutes,
        parts.seconds,
      );
    },

    setSeconds(date, seconds, timeZone) {
      const parts = getParts(date, timeZone);
      const nextSeconds = clamp(seconds, 0, 59);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        timeZone,
        parts.hours,
        parts.minutes,
        nextSeconds,
      );
    },

    endOfMonth(date, timeZone) {
      const parts = getParts(date, timeZone);
      const daysInMonth = new Date(
        Date.UTC(parts.year, parts.month + 1, 0),
      ).getUTCDate();

      return fromParts(
        parts.year,
        parts.month,
        daysInMonth,
        timeZone,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    addDays(date, amount, timeZone) {
      const parts = getParts(date, timeZone);
      const cursor = new Date(
        Date.UTC(parts.year, parts.month, parts.day + amount, 12, 0, 0),
      );

      return fromParts(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth(),
        cursor.getUTCDate(),
        timeZone,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    getWeekdayNames() {
      const locale = resolveLocale();
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      // 2021-01-03 is a known Sunday in local construction.
      const sunday = new Date(2021, 0, 3);

      return range(7).map((index) => {
        const day = new Date(sunday);

        day.setDate(sunday.getDate() + index);

        return formatter.format(day);
      });
    },

    getCalendarDays(view, startOfWeek, timeZone) {
      const monthStart = adapter.startOfMonth(view, timeZone);
      const weekday = adapter.getDay(monthStart, timeZone);
      const normalizedStart = ((startOfWeek % 7) + 7) % 7;
      const leading = (weekday - normalizedStart + 7) % 7;
      const gridStart = adapter.addDays(monthStart, -leading, timeZone);

      return range(42).map((index) => {
        return adapter.addDays(gridStart, index, timeZone);
      });
    },

    formatTime(date, timeZone, timeOptions) {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale();
      const zone = resolveTimeZone(timeZone);
      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;

      return new Intl.DateTimeFormat(locale, {
        hour12: ampm,
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
      }).format(date);
    },

    addMonths(date, amount, timeZone) {
      const parts = getParts(date, timeZone);
      const cursor = new Date(
        Date.UTC(parts.year, parts.month + amount, 1, 12, 0, 0),
      );
      const year = cursor.getUTCFullYear();
      const month = cursor.getUTCMonth();
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const day = clamp(parts.day, 1, daysInMonth);

      return fromParts(
        year,
        month,
        day,
        timeZone,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    parse(value, timeZone) {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

      if (!isNil(isoMatch)) {
        const year = Number(isoMatch[1]);
        const month = Number(isoMatch[2]) - 1;
        const day = Number(isoMatch[3]);
        const date = fromParts(year, month, day, timeZone);

        return isValidDate(date) ? date : null;
      }

      const parsed = new Date(trimmed);

      if (!isValidDate(parsed)) {
        return null;
      }

      const parts = getParts(parsed, timeZone);

      return fromParts(parts.year, parts.month, parts.day, timeZone);
    },

    format(date, timeZone, options) {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale();
      const zone = resolveTimeZone(timeZone);
      const granularity = options?.granularity ?? "day";

      if (granularity === "year") {
        return new Intl.DateTimeFormat(locale, {
          timeZone: zone,
          year: "numeric",
        }).format(date);
      }

      if (granularity === "month") {
        return new Intl.DateTimeFormat(locale, {
          month: "long",
          timeZone: zone,
          year: "numeric",
        }).format(date);
      }

      return new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        day: "2-digit",
        year: "numeric",
        month: "2-digit",
      }).format(date);
    },

    parseTime(value, timeZone, timeOptions) {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;
      const twentyFour = showSeconds
        ? /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(trimmed)
        : /^(\d{1,2}):(\d{2})$/.exec(trimmed);
      const twelve = showSeconds
        ? /^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM|am|pm)$/.exec(trimmed)
        : /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/.exec(trimmed);

      let hours: number;
      let minutes: number;
      let seconds: number;

      if (!isNil(twentyFour) && !ampm) {
        hours = Number(twentyFour[1]);
        minutes = Number(twentyFour[2]);
        seconds = showSeconds ? Number(twentyFour[3]) : 0;
      } else if (!isNil(twelve)) {
        hours = Number(twelve[1]);
        minutes = Number(twelve[2]);
        seconds = showSeconds ? Number(twelve[3]) : 0;
        const meridiem = (showSeconds ? twelve[4] : twelve[3])!.toUpperCase();

        if (hours < 1 || hours > 12) {
          return null;
        }

        if (meridiem === "AM") {
          hours = hours === 12 ? 0 : hours;
        } else {
          hours = hours === 12 ? 12 : hours + 12;
        }
      } else {
        return null;
      }

      if (
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59 ||
        seconds < 0 ||
        seconds > 59
      ) {
        return null;
      }

      const base = adapter.now(timeZone);
      const parts = getParts(base, timeZone);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        timeZone,
        hours,
        minutes,
        seconds,
      );
    },
  };

  return adapter;
}

/**
 * Shared native adapter instance used when `global.dates` is omitted.
 */
export const defaultNativeDateAdapter: DateAdapter<Date> =
  createNativeDateAdapter();

/**
 * Maps an `en-US` short weekday label from `formatToParts` to `0`–`6`.
 */
function weekdayLabelToIndex(label: string | undefined): number {
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  if (isNil(label)) {
    return 0;
  }

  return map[label] ?? 0;
}

/**
 * Builds a `Date` whose wall clock in `timeZone` is `year`/`month`/`day`
 * `hours`:`minutes`:`seconds`. Uses iterative UTC anchoring (good enough for
 * picker UI; prefer luxon/dayjs adapters for exact offsets).
 */
function zonedDateTime(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number,
  timeZone: string,
): Date {
  let utc = Date.UTC(year, month, day, hours, minutes, seconds);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      month: "numeric",
      hourCycle: "h23",
      minute: "numeric",
      second: "numeric",
    }).formatToParts(new Date(utc));

    const seenYear = Number(parts.find((part) => part.type === "year")?.value);
    const seenMonth =
      Number(parts.find((part) => part.type === "month")?.value) - 1;
    const seenDay = Number(parts.find((part) => part.type === "day")?.value);
    const seenHour = Number(parts.find((part) => part.type === "hour")?.value);
    const seenMinute = Number(
      parts.find((part) => part.type === "minute")?.value,
    );
    const seenSecond = Number(
      parts.find((part) => part.type === "second")?.value,
    );
    const target = Date.UTC(year, month, day, hours, minutes, seconds);
    const seen = Date.UTC(
      seenYear,
      seenMonth,
      seenDay,
      seenHour,
      seenMinute,
      seenSecond,
    );
    const delta = target - seen;

    if (delta === 0) {
      break;
    }

    utc += delta;
  }

  return new Date(utc);
}
