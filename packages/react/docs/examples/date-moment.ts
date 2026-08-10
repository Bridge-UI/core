/**
 * Example Moment.js date adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.dates`.
 * Not published as an npm package.
 *
 * Requires `moment` and `moment-timezone` (IANA zones via `moment.tz`).
 */

// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";
import moment, { type Moment } from "moment-timezone";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterContext,
  DateAdapterTimeOptions,
} from "@bridge-ui/core";

/**
 * Options for {@link createMomentDateAdapter}.
 */
export type MomentDateAdapterOptions = {
  /**
   * Default locale when context omits `locale`.
   *
   * @default undefined
   */
  locale?: string;

  /**
   * Default IANA time zone when context omits `timeZone`.
   *
   * @default undefined (system local zone)
   */
  timeZone?: string;
};

/**
 * Builds a Moment-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 */
export function createMomentDateAdapter(
  options: MomentDateAdapterOptions = {},
): DateAdapter<Date> {
  const resolveLocale = (context?: DateAdapterContext) => {
    return context?.locale ?? options.locale;
  };

  const resolveZone = (context?: DateAdapterContext) => {
    return context?.timeZone ?? options.timeZone;
  };

  const toMoment = (date: Date, context?: DateAdapterContext): Moment => {
    const locale = resolveLocale(context);
    const zone = resolveZone(context);
    let value = isNil(zone) ? moment(date) : moment.tz(date, zone);

    if (!isNil(locale)) {
      value = value.locale(locale);
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
        toMoment(date, context).clone().hour(clamp(hours, 0, 23)),
      );
    },

    setMinutes: (date, minutes, context) => {
      return fromMoment(
        toMoment(date, context).clone().minute(clamp(minutes, 0, 59)),
      );
    },

    setSeconds: (date, seconds, context) => {
      return fromMoment(
        toMoment(date, context).clone().second(clamp(seconds, 0, 59)),
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
        context,
        toMoment,
        fromMoment,
        timeOptions,
      });
    },

    getMonthNames: (context) => {
      const locale = resolveLocale(context);

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
      const locale = resolveLocale(context);
      let value = isNil(zone) ? moment() : moment.tz(zone);

      if (!isNil(locale)) {
        value = value.locale(locale);
      }

      return fromMoment(value);
    },

    format: (date, context) => {
      if (!isValid(date)) {
        return "";
      }

      const locale = resolveLocale(context);
      const timeZone = resolveZone(context);

      return new Intl.DateTimeFormat(locale, {
        timeZone,
        day: "2-digit",
        year: "numeric",
        month: "2-digit",
      }).format(date);
    },

    getWeekdayNames: (context) => {
      const locale = resolveLocale(context);
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

      const locale = resolveLocale(context);
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
  };

  return adapter;
}

function parseTimeWithMoment(input: {
  adapter: DateAdapter<Date>;
  context?: DateAdapterContext;
  fromMoment: (value: Moment) => Date;
  timeOptions?: DateAdapterTimeOptions;
  toMoment: (date: Date, context?: DateAdapterContext) => Moment;
  value: string;
}): Date | null {
  const { value, adapter, context, toMoment, fromMoment, timeOptions } = input;

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
