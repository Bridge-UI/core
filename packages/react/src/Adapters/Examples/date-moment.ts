/**
 * Moment adapter (`TDate = Date`). Wire via `BridgeUIProvider` `global.dates`.
 * Requires the optional `moment` peer.
 *
 * Import `moment-timezone` in the app for IANA zones. Without `moment.tz`,
 * `timeZone` arguments are ignored.
 */

// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";
import moment, { type Moment } from "moment";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

type MomentTz = Moment & {
  tz?: (timezone: string) => Moment;
};

const momentTz = moment as typeof moment & {
  tz?: (input: Date | string, timezone: string) => Moment;
};

/** Converts `value` when the app imported `moment-timezone`. */
function withMomentZone(value: Moment, zone?: string): Moment {
  if (isNil(zone)) {
    return value;
  }

  return (value as MomentTz).tz?.(zone) ?? value;
}

/** Parses `value` in `zone` when `moment.tz` is available. */
function parseMomentInZone(value: string, zone?: string): Moment {
  if (isNil(zone) || typeof momentTz.tz !== "function") {
    return moment(value);
  }

  return momentTz.tz(value, zone);
}

/**
 * Maps Bridge locales (`en-US`, `pt-BR`) to Moment locale ids (`en`, `pt-br`).
 * Import matching `moment/locale/*` files in the app.
 */
export type MomentDateAdapterLocales = Record<string, string>;

/**
 * Builds a Moment-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 * Locale and default IANA zone start unset until {@link DateAdapter.setLocale} /
 * {@link DateAdapter.setTimeZone}.
 *
 * `setLocale` still receives Bridge tags. Unmapped `en-US` becomes `en`; other
 * tags are lowercased (`pt-BR` → `pt-br`) unless {@link MomentDateAdapterLocales}
 * has an entry.
 *
 * Import `moment-timezone` in the app for IANA zones. Without `moment.tz`,
 * `timeZone` arguments are ignored.
 */
export function createMomentDateAdapter(
  locales: MomentDateAdapterLocales = {},
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

  const toMoment = (date: Date, zone?: string): Moment => {
    const libraryLocale = resolveLibraryLocale();
    const resolvedZone = resolveZone(zone);
    let value = withMomentZone(moment(date), resolvedZone);

    if (!isNil(libraryLocale)) {
      value = value.locale(libraryLocale);
    }

    return value;
  };

  const fromMoment = (value: Moment): Date => {
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
      return toMoment(date, timeZone).day();
    },

    getDate(date, timeZone) {
      return toMoment(date, timeZone).date();
    },

    getYear(date, timeZone) {
      return toMoment(date, timeZone).year();
    },

    getHours(date, timeZone) {
      return toMoment(date, timeZone).hour();
    },

    isAfter(a, b, timeZone) {
      return adapter.isBefore(b, a, timeZone);
    },

    getMonth(date, timeZone) {
      return toMoment(date, timeZone).month();
    },

    getMinutes(date, timeZone) {
      return toMoment(date, timeZone).minute();
    },

    getSeconds(date, timeZone) {
      return toMoment(date, timeZone).second();
    },

    setDate(date, day, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().date(day));
    },

    isSameDay(a, b, timeZone) {
      return toMoment(a, timeZone).isSame(toMoment(b, timeZone), "day");
    },

    setYear(date, year, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().year(year));
    },

    isSameYear(a, b, timeZone) {
      return toMoment(a, timeZone).isSame(toMoment(b, timeZone), "year");
    },

    startOfDay(date, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().startOf("day"));
    },

    endOfMonth(date, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().endOf("month"));
    },

    isSameMonth(a, b, timeZone) {
      return toMoment(a, timeZone).isSame(toMoment(b, timeZone), "month");
    },

    setMonth(date, month, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().month(month));
    },

    startOfMonth(date, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().startOf("month"));
    },

    addDays(date, amount, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().add(amount, "days"));
    },

    addYears(date, amount, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().add(amount, "years"));
    },

    addMonths(date, amount, timeZone) {
      return fromMoment(toMoment(date, timeZone).clone().add(amount, "months"));
    },

    setHours(date, hours, timeZone) {
      return fromMoment(
        toMoment(date, timeZone)
          .clone()
          .hour(clamp(hours, 0, 23)),
      );
    },

    setMinutes(date, minutes, timeZone) {
      return fromMoment(
        toMoment(date, timeZone)
          .clone()
          .minute(clamp(minutes, 0, 59)),
      );
    },

    setSeconds(date, seconds, timeZone) {
      return fromMoment(
        toMoment(date, timeZone)
          .clone()
          .second(clamp(seconds, 0, 59)),
      );
    },

    isBefore(a, b, timeZone) {
      return toMoment(a, timeZone)
        .clone()
        .startOf("day")
        .isBefore(toMoment(b, timeZone).clone().startOf("day"));
    },

    parseTime(value, timeZone, timeOptions) {
      return parseTimeWithMoment({
        value,
        adapter,
        toMoment,
        timeZone,
        fromMoment,
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
      const left = toMoment(a, timeZone);
      const right = toMoment(b, timeZone);

      return (
        left.hour() === right.hour() &&
        left.minute() === right.minute() &&
        left.second() === right.second()
      );
    },

    now(timeZone) {
      const zone = resolveZone(timeZone);
      const libraryLocale = resolveLibraryLocale();
      let value = withMomentZone(moment(), zone);

      if (!isNil(libraryLocale)) {
        value = value.locale(libraryLocale);
      }

      return fromMoment(value);
    },

    parse(value, timeZone) {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const zone = resolveZone(timeZone);
      const parsed = parseMomentInZone(trimmed, zone);

      if (!parsed.isValid()) {
        return null;
      }

      return fromMoment(parsed.startOf("day"));
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

function parseTimeWithMoment(input: {
  adapter: DateAdapter<Date>;
  fromMoment: (value: Moment) => Date;
  timeOptions?: DateAdapterTimeOptions;
  timeZone?: string;
  toMoment: (date: Date, timeZone?: string) => Moment;
  value: string;
}): Date | null {
  const { value, adapter, toMoment, timeZone, fromMoment, timeOptions } = input;

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
  const parsed = moment(trimmed, format, true);

  if (!parsed.isValid()) {
    return null;
  }

  const base = toMoment(adapter.now(timeZone), timeZone);

  return fromMoment(
    base
      .clone()
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(showSeconds ? parsed.second() : 0)
      .millisecond(0),
  );
}
