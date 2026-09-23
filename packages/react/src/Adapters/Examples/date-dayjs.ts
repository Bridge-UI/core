/**
 * Day.js adapter (`TDate = Date`). Wire via `BridgeUIProvider` `global.dates`.
 * Requires the optional `dayjs` peer and loads `customParseFormat`.
 *
 * Extend `utc` and `timezone` in the app for IANA zones. Without `dayjs.tz`,
 * `timeZone` arguments are ignored.
 */

// ** External Imports
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { clamp, isNil, isString, range } from "es-toolkit/compat";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

dayjs.extend(customParseFormat);

type ZonedDayjs = Dayjs & {
  tz?: (timezone: string) => Dayjs;
};

const dayjsTz = dayjs as typeof dayjs & {
  tz?: (date: string, timezone: string) => Dayjs;
};

/** Applies `zone` when the app extended Day.js with `utc` and `timezone`. */
function withDayjsZone(value: Dayjs, zone?: string): Dayjs {
  if (isNil(zone)) {
    return value;
  }

  return (value as ZonedDayjs).tz?.(zone) ?? value;
}

/** Parses `value` in `zone` when `dayjs.tz` is available. */
function parseDayjsInZone(value: string, zone?: string): Dayjs {
  if (isNil(zone)) {
    return dayjs(value);
  }

  return dayjsTz.tz?.(value, zone) ?? dayjs(value);
}

/**
 * Maps Bridge locales (`en-US`, `pt-BR`) to Day.js locale ids (`en`, `pt-br`).
 * Import matching `dayjs/locale/*` files in the app.
 */
export type DayjsDateAdapterLocales = Record<string, string>;

/**
 * Builds a Day.js-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 * Locale and default IANA zone start unset until {@link DateAdapter.setLocale} /
 * {@link DateAdapter.setTimeZone}.
 *
 * `setLocale` still receives Bridge tags. Unmapped `en-US` becomes `en`; other
 * tags are lowercased (`pt-BR` → `pt-br`) unless {@link DayjsDateAdapterLocales}
 * has an entry.
 *
 * Extend `utc` and `timezone` in the app for IANA zones. Without `dayjs.tz`,
 * `timeZone` arguments are ignored.
 */
export function createDayjsDateAdapter(
  locales: DayjsDateAdapterLocales = {},
): DateAdapter<Date> {
  let locale: string | undefined;
  let timeZone: string | undefined;

  const resolveLocale = () => locale;

  const resolveLibraryLocale = () => {
    if (isNil(locale)) {
      return undefined;
    }

    return (
      locales[locale] ?? (locale === "en-US" ? "en" : locale.toLowerCase())
    );
  };

  const resolveZone = (override?: string) => override ?? timeZone;

  const toDayjs = (date: Date, zone?: string): Dayjs => {
    const libraryLocale = resolveLibraryLocale();
    const resolvedZone = resolveZone(zone);
    let value = withDayjsZone(dayjs(date), resolvedZone);

    if (!isNil(libraryLocale)) {
      value = value.locale(libraryLocale);
    }

    return value;
  };

  const fromDayjs = (value: Dayjs): Date => {
    return value.toDate();
  };

  const isValid = (date: Date) => {
    return date instanceof Date && !Number.isNaN(date.getTime());
  };

  const adapter: DateAdapter<Date> = {
    setLocale(next) {
      locale = next;
    },

    setTimeZone(next) {
      timeZone = next;
    },

    getDay(date, timeZone) {
      return toDayjs(date, timeZone).day();
    },

    getDate(date, timeZone) {
      return toDayjs(date, timeZone).date();
    },

    getYear(date, timeZone) {
      return toDayjs(date, timeZone).year();
    },

    getHours(date, timeZone) {
      return toDayjs(date, timeZone).hour();
    },

    getMonth(date, timeZone) {
      return toDayjs(date, timeZone).month();
    },

    isAfter(a, b, timeZone) {
      return adapter.isBefore(b, a, timeZone);
    },

    getMinutes(date, timeZone) {
      return toDayjs(date, timeZone).minute();
    },

    getSeconds(date, timeZone) {
      return toDayjs(date, timeZone).second();
    },

    setDate(date, day, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).date(day));
    },

    setYear(date, year, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).year(year));
    },

    startOfDay(date, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).startOf("day"));
    },

    endOfMonth(date, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).endOf("month"));
    },

    setMonth(date, month, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).month(month));
    },

    startOfMonth(date, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).startOf("month"));
    },

    isSameDay(a, b, timeZone) {
      return toDayjs(a, timeZone).isSame(toDayjs(b, timeZone), "day");
    },

    isSameYear(a, b, timeZone) {
      return toDayjs(a, timeZone).isSame(toDayjs(b, timeZone), "year");
    },

    addDays(date, amount, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).add(amount, "day"));
    },

    isSameMonth(a, b, timeZone) {
      return toDayjs(a, timeZone).isSame(toDayjs(b, timeZone), "month");
    },

    addYears(date, amount, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).add(amount, "year"));
    },

    addMonths(date, amount, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).add(amount, "month"));
    },

    setHours(date, hours, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).hour(clamp(hours, 0, 23)));
    },

    setMinutes(date, minutes, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).minute(clamp(minutes, 0, 59)));
    },

    setSeconds(date, seconds, timeZone) {
      return fromDayjs(toDayjs(date, timeZone).second(clamp(seconds, 0, 59)));
    },

    isBefore(a, b, timeZone) {
      return toDayjs(a, timeZone)
        .startOf("day")
        .isBefore(toDayjs(b, timeZone).startOf("day"));
    },

    parseTime(value, timeZone, timeOptions) {
      return parseTimeWithDayjs({
        value,
        adapter,
        toDayjs,
        timeZone,
        fromDayjs,
        timeOptions,
      });
    },

    getMonthNames() {
      const locale = resolveLocale();

      return range(12).map((month) => {
        return new Intl.DateTimeFormat(locale, { month: "long" }).format(
          new Date(2021, month, 1),
        );
      });
    },

    isSameTime(a, b, timeZone) {
      const left = toDayjs(a, timeZone);
      const right = toDayjs(b, timeZone);

      return (
        left.hour() === right.hour() &&
        left.minute() === right.minute() &&
        left.second() === right.second()
      );
    },

    now(timeZone) {
      const zone = resolveZone(timeZone);
      const libraryLocale = resolveLibraryLocale();
      let value = withDayjsZone(dayjs(), zone);

      if (!isNil(libraryLocale)) {
        value = value.locale(libraryLocale);
      }

      return fromDayjs(value);
    },

    parse(value, timeZone) {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const zone = resolveZone(timeZone);
      const parsed = parseDayjsInZone(trimmed, zone);

      if (!parsed.isValid()) {
        return null;
      }

      return fromDayjs(parsed.startOf("day"));
    },

    getWeekdayNames() {
      const locale = resolveLocale();
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
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
      if (!isValid(date)) {
        return "";
      }

      const locale = resolveLocale();
      const zone = resolveZone(timeZone);
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

    format(date, timeZone, options) {
      if (!isValid(date)) {
        return "";
      }

      const locale = resolveLocale();
      const zone = resolveZone(timeZone);
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
  };

  return adapter;
}

function parseTimeWithDayjs(input: {
  adapter: DateAdapter<Date>;
  fromDayjs: (value: Dayjs) => Date;
  timeOptions?: DateAdapterTimeOptions;
  timeZone?: string;
  toDayjs: (date: Date, timeZone?: string) => Dayjs;
  value: string;
}): Date | null {
  const { value, adapter, toDayjs, timeZone, fromDayjs, timeOptions } = input;

  if (!isString(value) || value.trim() === "") {
    return null;
  }

  const trimmed = value.trim();
  const ampm = timeOptions?.ampm === true;
  const showSeconds = timeOptions?.showSeconds === true;
  const format = ampm
    ? showSeconds
      ? "h:mm:ss A"
      : "h:mm A"
    : showSeconds
      ? "H:mm:ss"
      : "H:mm";
  const parsed = dayjs(trimmed, format, true);

  if (!parsed.isValid()) {
    return null;
  }

  const base = toDayjs(adapter.now(timeZone), timeZone);

  return fromDayjs(
    base
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(showSeconds ? parsed.second() : 0)
      .millisecond(0),
  );
}
