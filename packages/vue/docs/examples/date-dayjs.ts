/**
 * Example Day.js date adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.dates`.
 * Not published as an npm package.
 *
 * Requires `dayjs`. Loads `utc`, `timezone`, and `customParseFormat` plugins.
 */

// ** External Imports
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { clamp, isNil, isString, range } from "es-toolkit/compat";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterContext,
  DateAdapterTimeOptions,
} from "@bridge-ui/core";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * Options for {@link createDayjsDateAdapter}.
 */
export type DayjsDateAdapterOptions = {
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
 * Builds a Day.js-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 */
export function createDayjsDateAdapter(
  options: DayjsDateAdapterOptions = {},
): DateAdapter<Date> {
  const resolveLocale = (context?: DateAdapterContext) => {
    return context?.locale ?? options.locale;
  };

  const resolveZone = (context?: DateAdapterContext) => {
    return context?.timeZone ?? options.timeZone;
  };

  const toDayjs = (date: Date, context?: DateAdapterContext): Dayjs => {
    const locale = resolveLocale(context);
    const zone = resolveZone(context);
    let value = isNil(zone) ? dayjs(date) : dayjs(date).tz(zone);

    if (!isNil(locale)) {
      value = value.locale(locale);
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
    getDay: (date, context) => toDayjs(date, context).day(),

    getDate: (date, context) => toDayjs(date, context).date(),

    getYear: (date, context) => toDayjs(date, context).year(),

    getHours: (date, context) => toDayjs(date, context).hour(),

    getMonth: (date, context) => toDayjs(date, context).month(),

    isAfter: (a, b, context) => adapter.isBefore(b, a, context),

    getMinutes: (date, context) => toDayjs(date, context).minute(),

    getSeconds: (date, context) => toDayjs(date, context).second(),

    setDate: (date, day, context) => {
      return fromDayjs(toDayjs(date, context).date(day));
    },

    setYear: (date, year, context) => {
      return fromDayjs(toDayjs(date, context).year(year));
    },

    startOfDay: (date, context) => {
      return fromDayjs(toDayjs(date, context).startOf("day"));
    },

    endOfMonth: (date, context) => {
      return fromDayjs(toDayjs(date, context).endOf("month"));
    },

    setMonth: (date, month, context) => {
      return fromDayjs(toDayjs(date, context).month(month));
    },

    startOfMonth: (date, context) => {
      return fromDayjs(toDayjs(date, context).startOf("month"));
    },

    isSameDay: (a, b, context) => {
      return toDayjs(a, context).isSame(toDayjs(b, context), "day");
    },

    isSameYear: (a, b, context) => {
      return toDayjs(a, context).isSame(toDayjs(b, context), "year");
    },

    isSameMonth: (a, b, context) => {
      return toDayjs(a, context).isSame(toDayjs(b, context), "month");
    },

    addDays: (date, amount, context) => {
      return fromDayjs(toDayjs(date, context).add(amount, "day"));
    },

    addYears: (date, amount, context) => {
      return fromDayjs(toDayjs(date, context).add(amount, "year"));
    },

    addMonths: (date, amount, context) => {
      return fromDayjs(toDayjs(date, context).add(amount, "month"));
    },

    setHours: (date, hours, context) => {
      return fromDayjs(toDayjs(date, context).hour(clamp(hours, 0, 23)));
    },

    setMinutes: (date, minutes, context) => {
      return fromDayjs(toDayjs(date, context).minute(clamp(minutes, 0, 59)));
    },

    setSeconds: (date, seconds, context) => {
      return fromDayjs(toDayjs(date, context).second(clamp(seconds, 0, 59)));
    },

    isBefore: (a, b, context) => {
      return toDayjs(a, context)
        .startOf("day")
        .isBefore(toDayjs(b, context).startOf("day"));
    },

    parseTime: (value, context, timeOptions) => {
      return parseTimeWithDayjs({
        value,
        adapter,
        context,
        toDayjs,
        fromDayjs,
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
      const left = toDayjs(a, context);
      const right = toDayjs(b, context);

      return (
        left.hour() === right.hour() &&
        left.minute() === right.minute() &&
        left.second() === right.second()
      );
    },

    now: (context) => {
      const zone = resolveZone(context);
      const locale = resolveLocale(context);
      let value = isNil(zone) ? dayjs() : dayjs().tz(zone);

      if (!isNil(locale)) {
        value = value.locale(locale);
      }

      return fromDayjs(value);
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
      const parsed = isNil(zone) ? dayjs(trimmed) : dayjs.tz(trimmed, zone);

      if (!parsed.isValid()) {
        return null;
      }

      return fromDayjs(parsed.startOf("day"));
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

function parseTimeWithDayjs(input: {
  adapter: DateAdapter<Date>;
  context?: DateAdapterContext;
  fromDayjs: (value: Dayjs) => Date;
  timeOptions?: DateAdapterTimeOptions;
  toDayjs: (date: Date, context?: DateAdapterContext) => Dayjs;
  value: string;
}): Date | null {
  const { value, adapter, context, toDayjs, fromDayjs, timeOptions } = input;

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

  const base = toDayjs(adapter.now(context), context);

  return fromDayjs(
    base
      .hour(parsed.hour())
      .minute(parsed.minute())
      .second(showSeconds ? parsed.second() : 0)
      .millisecond(0),
  );
}
