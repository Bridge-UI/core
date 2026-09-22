/**
 * Moment adapter (`TDate = Date`). Wire via `BridgeUIProvider` `global.dates`.
 * Requires the optional `moment` and `moment-timezone` peers.
 */

// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";
import moment, { type Moment } from "moment-timezone";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

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
    let value = isNil(resolvedZone)
      ? moment(date)
      : moment.tz(date, resolvedZone);

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
    setLocale: (next) => {
      locale = next;
    },

    setTimeZone: (next) => {
      timeZone = next;
    },

    getDay: (date, context) => toMoment(date, context).day(),

    getDate: (date, context) => toMoment(date, context).date(),

    getYear: (date, context) => toMoment(date, context).year(),

    getHours: (date, context) => toMoment(date, context).hour(),

    isAfter: (a, b, context) => adapter.isBefore(b, a, context),

    getMonth: (date, context) => toMoment(date, context).month(),

    getMinutes: (date, context) => toMoment(date, context).minute(),

    getSeconds: (date, context) => toMoment(date, context).second(),

    isSameDay: (a, b, context) => {
      return toMoment(a, context).isSame(toMoment(b, context), "day");
    },

    setDate: (date, day, context) => {
      return fromMoment(toMoment(date, context).clone().date(day));
    },

    isSameYear: (a, b, context) => {
      return toMoment(a, context).isSame(toMoment(b, context), "year");
    },

    setYear: (date, year, context) => {
      return fromMoment(toMoment(date, context).clone().year(year));
    },

    startOfDay: (date, context) => {
      return fromMoment(toMoment(date, context).clone().startOf("day"));
    },

    endOfMonth: (date, context) => {
      return fromMoment(toMoment(date, context).clone().endOf("month"));
    },

    isSameMonth: (a, b, context) => {
      return toMoment(a, context).isSame(toMoment(b, context), "month");
    },

    setMonth: (date, month, context) => {
      return fromMoment(toMoment(date, context).clone().month(month));
    },

    startOfMonth: (date, context) => {
      return fromMoment(toMoment(date, context).clone().startOf("month"));
    },

    addDays: (date, amount, context) => {
      return fromMoment(toMoment(date, context).clone().add(amount, "days"));
    },

    addYears: (date, amount, context) => {
      return fromMoment(toMoment(date, context).clone().add(amount, "years"));
    },

    addMonths: (date, amount, context) => {
      return fromMoment(toMoment(date, context).clone().add(amount, "months"));
    },

    setHours: (date, hours, context) => {
      return fromMoment(
        toMoment(date, context)
          .clone()
          .hour(clamp(hours, 0, 23)),
      );
    },

    setMinutes: (date, minutes, context) => {
      return fromMoment(
        toMoment(date, context)
          .clone()
          .minute(clamp(minutes, 0, 59)),
      );
    },

    setSeconds: (date, seconds, context) => {
      return fromMoment(
        toMoment(date, context)
          .clone()
          .second(clamp(seconds, 0, 59)),
      );
    },

    isBefore: (a, b, context) => {
      return toMoment(a, context)
        .clone()
        .startOf("day")
        .isBefore(toMoment(b, context).clone().startOf("day"));
    },

    parseTime: (value, context, timeOptions) => {
      return parseTimeWithMoment({
        value,
        adapter,
        toMoment,
        fromMoment,
        timeOptions,
        timeZone: context,
      });
    },

    getMonthNames: () => {
      const locale = resolveLocale();

      return range(12).map((month) => {
        return new Intl.DateTimeFormat(locale, { month: "long" }).format(
          new Date(2021, month, 1),
        );
      });
    },

    isSameTime: (a, b, context) => {
      const left = toMoment(a, context);
      const right = toMoment(b, context);

      return (
        left.hour() === right.hour() &&
        left.minute() === right.minute() &&
        left.second() === right.second()
      );
    },

    now: (context) => {
      const zone = resolveZone(context);
      const libraryLocale = resolveLibraryLocale();
      let value = isNil(zone) ? moment() : moment.tz(zone);

      if (!isNil(libraryLocale)) {
        value = value.locale(libraryLocale);
      }

      return fromMoment(value);
    },

    getWeekdayNames: () => {
      const locale = resolveLocale();
      const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      const sunday = new Date(2021, 0, 3);

      return range(7).map((index) => {
        const day = new Date(sunday);

        day.setDate(sunday.getDate() + index);

        return formatter.format(day);
      });
    },

    parse: (value, context) => {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const zone = resolveZone(context);
      const parsed = isNil(zone) ? moment(trimmed) : moment.tz(trimmed, zone);

      if (!parsed.isValid()) {
        return null;
      }

      return fromMoment(parsed.startOf("day"));
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
      if (!isValid(date)) {
        return "";
      }

      const locale = resolveLocale();
      const timeZone = resolveZone(context);
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

    format: (date, context, options) => {
      if (!isValid(date)) {
        return "";
      }

      const locale = resolveLocale();
      const timeZone = resolveZone(context);
      const granularity = options?.granularity ?? "day";

      if (granularity === "year") {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          year: "numeric",
        }).format(date);
      }

      if (granularity === "month") {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          month: "long",
          year: "numeric",
        }).format(date);
      }

      return new Intl.DateTimeFormat(locale, {
        timeZone,
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
  const {
    value,
    adapter,
    toMoment,
    fromMoment,
    timeOptions,
    timeZone: context,
  } = input;

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

  const base = toMoment(adapter.now(context), context);

  return fromMoment(
    base
      .clone()
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(showSeconds ? parsed.second() : 0)
      .millisecond(0),
  );
}
