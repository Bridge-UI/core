// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";

/**
 * Locale / time zone context forwarded to adapter methods.
 * Components pass `BridgeUIGlobal.locale` / `timeZone` (or prop overrides).
 */
export type DateAdapterContext = {
  /**
   * BCP 47 locale (e.g. `"en-US"`, `"pt-BR"`).
   */
  locale?: string;

  /**
   * IANA time zone (e.g. `"UTC"`, `"America/Sao_Paulo"`).
   */
  timeZone?: string;
};

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
 * Pluggable date library for Bridge UI calendars and pickers.
 * Apps may replace the native default via `BridgeUIProvider` `global.dates`.
 *
 * @typeParam TDate - Temporal value type (`Date` for the native adapter).
 */
export interface DateAdapter<TDate = Date> {
  /**
   * Adds calendar days to `date`.
   */
  addDays: (date: TDate, amount: number, context?: DateAdapterContext) => TDate;

  /**
   * Adds calendar months to `date`.
   */
  addMonths: (
    date: TDate,
    amount: number,
    context?: DateAdapterContext,
  ) => TDate;

  /**
   * Adds calendar years to `date`.
   */
  addYears: (
    date: TDate,
    amount: number,
    context?: DateAdapterContext,
  ) => TDate;

  /**
   * Last instant of the month containing `date` (local / zoned day).
   */
  endOfMonth: (date: TDate, context?: DateAdapterContext) => TDate;

  /**
   * Formats `date` for display (e.g. DateField text).
   */
  format: (date: TDate, context?: DateAdapterContext) => string;

  /**
   * Formats the time-of-day portion of `date` (e.g. TimeField text).
   */
  formatTime: (
    date: TDate,
    context?: DateAdapterContext,
    options?: DateAdapterTimeOptions,
  ) => string;

  /**
   * Builds the month grid (leading / trailing outside days included).
   * Length is always a multiple of 7.
   */
  getCalendarDays: (
    view: TDate,
    startOfWeek: number,
    context?: DateAdapterContext,
  ) => TDate[];

  /**
   * Day of month `1`–`31`.
   */
  getDate: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Weekday `0` (Sunday) – `6` (Saturday).
   */
  getDay: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Hours `0`–`23` (wall clock in `timeZone` when set).
   */
  getHours: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Minutes `0`–`59`.
   */
  getMinutes: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Month `0` (January) – `11` (December).
   */
  getMonth: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Localized full month names (index `0` = January).
   */
  getMonthNames: (context?: DateAdapterContext) => string[];

  /**
   * Seconds `0`–`59`.
   */
  getSeconds: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Localized short weekday names, ordered Sunday → Saturday.
   */
  getWeekdayNames: (context?: DateAdapterContext) => string[];

  /**
   * Full year (e.g. `2021`).
   */
  getYear: (date: TDate, context?: DateAdapterContext) => number;

  /**
   * Whether `a` is after `b` (day precision when used with calendar dates).
   */
  isAfter: (a: TDate, b: TDate, context?: DateAdapterContext) => boolean;

  /**
   * Whether `a` is before `b` (day precision when used with calendar dates).
   */
  isBefore: (a: TDate, b: TDate, context?: DateAdapterContext) => boolean;

  /**
   * Whether `a` and `b` fall on the same calendar day.
   */
  isSameDay: (a: TDate, b: TDate, context?: DateAdapterContext) => boolean;

  /**
   * Whether `a` and `b` fall in the same calendar month.
   */
  isSameMonth: (a: TDate, b: TDate, context?: DateAdapterContext) => boolean;

  /**
   * Whether `a` and `b` share the same hour, minute, and second.
   */
  isSameTime: (a: TDate, b: TDate, context?: DateAdapterContext) => boolean;

  /**
   * Whether `a` and `b` fall in the same calendar year.
   */
  isSameYear: (a: TDate, b: TDate, context?: DateAdapterContext) => boolean;

  /**
   * Current instant (respects `timeZone` when the adapter supports it).
   */
  now: (context?: DateAdapterContext) => TDate;

  /**
   * Parses typed / serialized text into a date, or `null` when invalid.
   */
  parse: (value: string, context?: DateAdapterContext) => null | TDate;

  /**
   * Parses a time string (`HH:mm`, `HH:mm:ss`, `h:mm a`, or `h:mm:ss a`) into a
   * date anchored on today, or `null` when invalid. Seconds require
   * `options.showSeconds`.
   */
  parseTime: (
    value: string,
    context?: DateAdapterContext,
    options?: DateAdapterTimeOptions,
  ) => null | TDate;

  /**
   * Sets the day of month.
   */
  setDate: (date: TDate, day: number, context?: DateAdapterContext) => TDate;

  /**
   * Sets the hour (`0`–`23`), preserving calendar day, minutes, and seconds.
   */
  setHours: (date: TDate, hours: number, context?: DateAdapterContext) => TDate;

  /**
   * Sets the minute (`0`–`59`), preserving calendar day, hours, and seconds.
   */
  setMinutes: (
    date: TDate,
    minutes: number,
    context?: DateAdapterContext,
  ) => TDate;

  /**
   * Sets the month (`0`–`11`).
   */
  setMonth: (date: TDate, month: number, context?: DateAdapterContext) => TDate;

  /**
   * Sets the second (`0`–`59`), preserving calendar day, hours, and minutes.
   */
  setSeconds: (
    date: TDate,
    seconds: number,
    context?: DateAdapterContext,
  ) => TDate;

  /**
   * Sets the full year.
   */
  setYear: (date: TDate, year: number, context?: DateAdapterContext) => TDate;

  /**
   * Start of the calendar day containing `date`.
   */
  startOfDay: (date: TDate, context?: DateAdapterContext) => TDate;

  /**
   * First day of the month containing `date`.
   */
  startOfMonth: (date: TDate, context?: DateAdapterContext) => TDate;
}

/**
 * Options for {@link createNativeDateAdapter}.
 */
export type NativeDateAdapterOptions = {
  /**
   * Default locale when context omits `locale`.
   *
   * @default undefined (runtime default locale)
   */
  locale?: string;

  /**
   * Default IANA time zone when context omits `timeZone`.
   *
   * @default undefined (environment local zone for getters that need it)
   */
  timeZone?: string;
};

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
 */
export function createNativeDateAdapter(
  options: NativeDateAdapterOptions = {},
): DateAdapter<Date> {
  const resolveLocale = (context?: DateAdapterContext) => {
    return context?.locale ?? options.locale;
  };

  const resolveTimeZone = (context?: DateAdapterContext) => {
    return context?.timeZone ?? options.timeZone;
  };

  const getParts = (date: Date, context?: DateAdapterContext): DateParts => {
    const timeZone = resolveTimeZone(context);

    if (isNil(timeZone)) {
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
      timeZone,
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      month: "numeric",
      weekday: "short",
      hourCycle: "h23",
      minute: "numeric",
      second: "numeric",
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
    context?: DateAdapterContext,
    hours = 0,
    minutes = 0,
    seconds = 0,
  ): Date => {
    const timeZone = resolveTimeZone(context);

    if (isNil(timeZone)) {
      return new Date(year, month, day, hours, minutes, seconds, 0);
    }

    return zonedDateTime(year, month, day, hours, minutes, seconds, timeZone);
  };

  const adapter: DateAdapter<Date> = {
    now: (_context) => {
      return new Date();
    },

    getDate: (date, context) => getParts(date, context).day,

    getYear: (date, context) => getParts(date, context).year,

    getMonth: (date, context) => getParts(date, context).month,
    getDay: (date, context) => getParts(date, context).weekday,
    getHours: (date, context) => {
      return getParts(date, context).hours;
    },
    isAfter: (a, b, context) => {
      return adapter.isBefore(b, a, context);
    },

    getMinutes: (date, context) => {
      return getParts(date, context).minutes;
    },

    getSeconds: (date, context) => {
      return getParts(date, context).seconds;
    },

    addYears: (date, amount, context) => {
      return adapter.addMonths(date, amount * 12, context);
    },

    isSameYear: (a, b, context) => {
      return getParts(a, context).year === getParts(b, context).year;
    },

    startOfMonth: (date, context) => {
      const parts = getParts(date, context);

      return fromParts(parts.year, parts.month, 1, context);
    },

    startOfDay: (date, context) => {
      const parts = getParts(date, context);

      return fromParts(parts.year, parts.month, parts.day, context, 0, 0, 0);
    },

    isSameMonth: (a, b, context) => {
      const left = getParts(a, context);
      const right = getParts(b, context);

      return left.year === right.year && left.month === right.month;
    },

    isSameDay: (a, b, context) => {
      const left = getParts(a, context);
      const right = getParts(b, context);

      return (
        left.year === right.year &&
        left.month === right.month &&
        left.day === right.day
      );
    },

    setDate: (date, day, context) => {
      const parts = getParts(date, context);

      return fromParts(
        parts.year,
        parts.month,
        day,
        context,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    setYear: (date, year, context) => {
      const parts = getParts(date, context);

      return fromParts(
        year,
        parts.month,
        parts.day,
        context,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    setMonth: (date, month, context) => {
      const parts = getParts(date, context);

      return fromParts(
        parts.year,
        month,
        parts.day,
        context,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    isSameTime: (a, b, context) => {
      const left = getParts(a, context);
      const right = getParts(b, context);

      return (
        left.hours === right.hours &&
        left.minutes === right.minutes &&
        left.seconds === right.seconds
      );
    },

    getMonthNames: (context) => {
      const locale = resolveLocale(context);
      const formatter = new Intl.DateTimeFormat(locale, { month: "long" });

      return range(12).map((month) => {
        return formatter.format(new Date(2021, month, 1));
      });
    },

    isBefore: (a, b, context) => {
      const left = getParts(a, context);
      const right = getParts(b, context);
      const leftKey = left.year * 10_000 + left.month * 100 + left.day;
      const rightKey = right.year * 10_000 + right.month * 100 + right.day;

      return leftKey < rightKey;
    },

    setHours: (date, hours, context) => {
      const parts = getParts(date, context);
      const nextHours = clamp(hours, 0, 23);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        context,
        nextHours,
        parts.minutes,
        parts.seconds,
      );
    },

    setMinutes: (date, minutes, context) => {
      const parts = getParts(date, context);
      const nextMinutes = clamp(minutes, 0, 59);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        context,
        parts.hours,
        nextMinutes,
        parts.seconds,
      );
    },

    setSeconds: (date, seconds, context) => {
      const parts = getParts(date, context);
      const nextSeconds = clamp(seconds, 0, 59);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        context,
        parts.hours,
        parts.minutes,
        nextSeconds,
      );
    },

    format: (date, context) => {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale(context);
      const timeZone = resolveTimeZone(context);

      return new Intl.DateTimeFormat(locale, {
        timeZone,
        day: "2-digit",
        year: "numeric",
        month: "2-digit",
      }).format(date);
    },

    endOfMonth: (date, context) => {
      const parts = getParts(date, context);
      const daysInMonth = new Date(
        Date.UTC(parts.year, parts.month + 1, 0),
      ).getUTCDate();

      return fromParts(
        parts.year,
        parts.month,
        daysInMonth,
        context,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    addDays: (date, amount, context) => {
      const parts = getParts(date, context);
      const cursor = new Date(
        Date.UTC(parts.year, parts.month, parts.day + amount, 12, 0, 0),
      );

      return fromParts(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth(),
        cursor.getUTCDate(),
        context,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    getWeekdayNames: (context) => {
      const locale = resolveLocale(context);
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      // 2021-01-03 is a known Sunday in local construction.
      const sunday = new Date(2021, 0, 3);

      return range(7).map((index) => {
        const day = new Date(sunday);

        day.setDate(sunday.getDate() + index);

        return formatter.format(day);
      });
    },

    getCalendarDays: (view, startOfWeek, context) => {
      const monthStart = adapter.startOfMonth(view, context);
      const weekday = adapter.getDay(monthStart, context);
      const normalizedStart = ((startOfWeek % 7) + 7) % 7;
      const leading = (weekday - normalizedStart + 7) % 7;
      const gridStart = adapter.addDays(monthStart, -leading, context);

      return range(42).map((index) => {
        return adapter.addDays(gridStart, index, context);
      });
    },

    formatTime: (date, context, timeOptions) => {
      if (!isValidDate(date)) {
        return "";
      }

      const locale = resolveLocale(context);
      const timeZone = resolveTimeZone(context);
      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;

      return new Intl.DateTimeFormat(locale, {
        timeZone,
        hour12: ampm,
        hour: "2-digit",
        minute: "2-digit",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
      }).format(date);
    },

    addMonths: (date, amount, context) => {
      const parts = getParts(date, context);
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
        context,
        parts.hours,
        parts.minutes,
        parts.seconds,
      );
    },

    parse: (value, context) => {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

      if (!isNil(isoMatch)) {
        const year = Number(isoMatch[1]);
        const month = Number(isoMatch[2]) - 1;
        const day = Number(isoMatch[3]);
        const date = fromParts(year, month, day, context);

        return isValidDate(date) ? date : null;
      }

      const parsed = new Date(trimmed);

      if (!isValidDate(parsed)) {
        return null;
      }

      const parts = getParts(parsed, context);

      return fromParts(parts.year, parts.month, parts.day, context);
    },

    parseTime: (value, context, timeOptions) => {
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

      const base = adapter.now(context);
      const parts = getParts(base, context);

      return fromParts(
        parts.year,
        parts.month,
        parts.day,
        context,
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
