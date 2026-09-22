/**
 * Luxon adapter (`TDate = Date`). Wire via `BridgeUIProvider` `global.dates`.
 * Requires the optional `luxon` peer. IANA zones via `DateTime.setZone`.
 */

// ** External Imports
import { clamp, isNil, isString, range } from "es-toolkit/compat";
import { DateTime, Info } from "luxon";

// ** Core Imports
import type {
  DateAdapter,
  DateAdapterTimeOptions,
} from "@bridge-ui/core/Adapters";

/**
 * Builds a Luxon-backed {@link DateAdapter} (`TDate = Date`) for Bridge calendars.
 * Locale and default IANA zone start unset until {@link DateAdapter.setLocale} /
 * {@link DateAdapter.setTimeZone}.
 */
export function createLuxonDateAdapter(): DateAdapter<Date> {
  let locale: string | undefined;
  let timeZone: string | undefined;

  const resolveLocale = () => locale;

  const resolveZone = (override?: string) => override ?? timeZone;

  const toDateTime = (date: Date, zone?: string): DateTime => {
    const locale = resolveLocale();
    const resolvedZone = resolveZone(zone);
    let value = DateTime.fromJSDate(date);

    if (!isNil(resolvedZone)) {
      value = value.setZone(resolvedZone);
    }

    if (!isNil(locale)) {
      value = value.setLocale(locale);
    }

    return value;
  };

  const fromDateTime = (value: DateTime): Date => {
    return value.toJSDate();
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

    getDate: (date, context) => toDateTime(date, context).day,

    getYear: (date, context) => toDateTime(date, context).year,

    getHours: (date, context) => toDateTime(date, context).hour,

    isAfter: (a, b, context) => adapter.isBefore(b, a, context),

    getMinutes: (date, context) => toDateTime(date, context).minute,

    getSeconds: (date, context) => toDateTime(date, context).second,

    getMonth: (date, context) => toDateTime(date, context).month - 1,

    getDay: (date, context) => toDateTime(date, context).weekday % 7,

    startOfDay: (date, context) => {
      return fromDateTime(toDateTime(date, context).startOf("day"));
    },

    setDate: (date, day, context) => {
      return fromDateTime(toDateTime(date, context).set({ day }));
    },

    setYear: (date, year, context) => {
      return fromDateTime(toDateTime(date, context).set({ year }));
    },

    startOfMonth: (date, context) => {
      return fromDateTime(toDateTime(date, context).startOf("month"));
    },

    isSameDay: (a, b, context) => {
      return toDateTime(a, context).hasSame(toDateTime(b, context), "day");
    },

    isSameYear: (a, b, context) => {
      return toDateTime(a, context).hasSame(toDateTime(b, context), "year");
    },

    isSameMonth: (a, b, context) => {
      return toDateTime(a, context).hasSame(toDateTime(b, context), "month");
    },

    addDays: (date, amount, context) => {
      return fromDateTime(toDateTime(date, context).plus({ days: amount }));
    },

    addYears: (date, amount, context) => {
      return fromDateTime(toDateTime(date, context).plus({ years: amount }));
    },

    setMonth: (date, month, context) => {
      return fromDateTime(toDateTime(date, context).set({ month: month + 1 }));
    },

    addMonths: (date, amount, context) => {
      return fromDateTime(toDateTime(date, context).plus({ months: amount }));
    },

    getMonthNames: () => {
      const locale = resolveLocale() ?? "en-US";

      return Info.months("long", { locale });
    },

    endOfMonth: (date, context) => {
      return fromDateTime(
        toDateTime(date, context).endOf("month").startOf("second"),
      );
    },

    setHours: (date, hours, context) => {
      return fromDateTime(
        toDateTime(date, context).set({ hour: clamp(hours, 0, 23) }),
      );
    },

    isBefore: (a, b, context) => {
      return (
        toDateTime(a, context).startOf("day") <
        toDateTime(b, context).startOf("day")
      );
    },

    setMinutes: (date, minutes, context) => {
      return fromDateTime(
        toDateTime(date, context).set({ minute: clamp(minutes, 0, 59) }),
      );
    },

    setSeconds: (date, seconds, context) => {
      return fromDateTime(
        toDateTime(date, context).set({ second: clamp(seconds, 0, 59) }),
      );
    },

    parseTime: (value, context, timeOptions) => {
      return parseTimeWithLuxon({
        value,
        adapter,
        toDateTime,
        timeOptions,
        fromDateTime,
        timeZone: context,
      });
    },

    getWeekdayNames: () => {
      const locale = resolveLocale() ?? "en-US";
      // Luxon weekdays are Monday-first; Bridge expects Sunday → Saturday.
      const names = Info.weekdays("short", { locale });

      return [names[6]!, ...names.slice(0, 6)];
    },

    isSameTime: (a, b, context) => {
      const left = toDateTime(a, context);
      const right = toDateTime(b, context);

      return (
        left.hour === right.hour &&
        left.minute === right.minute &&
        left.second === right.second
      );
    },

    now: (context) => {
      const zone = resolveZone(context);
      const locale = resolveLocale();
      let value: DateTime = DateTime.now();

      if (!isNil(zone)) {
        value = value.setZone(zone);
      }

      if (!isNil(locale)) {
        value = value.setLocale(locale);
      }

      return fromDateTime(value);
    },

    formatTime: (date, context, timeOptions) => {
      if (!isValid(date)) {
        return "";
      }

      const ampm = timeOptions?.ampm === true;
      const showSeconds = timeOptions?.showSeconds === true;

      return toDateTime(date, context).toLocaleString({
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: ampm ? "h12" : "h23",
        ...(showSeconds ? { second: "2-digit" as const } : {}),
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

    parse: (value, context) => {
      if (!isString(value) || value.trim() === "") {
        return null;
      }

      const trimmed = value.trim();
      const iso = DateTime.fromISO(trimmed, {
        locale: resolveLocale(),
        zone: resolveZone(context),
      });

      if (iso.isValid) {
        return fromDateTime(iso.startOf("day"));
      }

      const parsed = DateTime.fromJSDate(new Date(trimmed), {
        zone: resolveZone(context),
      });

      if (!parsed.isValid) {
        return null;
      }

      return fromDateTime(parsed.startOf("day"));
    },

    format: (date, context, options) => {
      if (!isValid(date)) {
        return "";
      }

      const granularity = options?.granularity ?? "day";

      if (granularity === "year") {
        return toDateTime(date, context).toLocaleString({ year: "numeric" });
      }

      if (granularity === "month") {
        return toDateTime(date, context).toLocaleString({
          month: "long",
          year: "numeric",
        });
      }

      return toDateTime(date, context).toLocaleString({
        day: "2-digit",
        year: "numeric",
        month: "2-digit",
      });
    },
  };

  return adapter;
}

function parseTimeWithLuxon(input: {
  adapter: DateAdapter<Date>;
  fromDateTime: (value: DateTime) => Date;
  timeOptions?: DateAdapterTimeOptions;
  timeZone?: string;
  toDateTime: (date: Date, timeZone?: string) => DateTime;
  value: string;
}): Date | null {
  const {
    value,
    adapter,
    toDateTime,
    timeOptions,
    fromDateTime,
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
      ? "h:mm:ss a"
      : "h:mm a"
    : showSeconds
      ? "H:mm:ss"
      : "H:mm";
  const parsed = DateTime.fromFormat(trimmed, format, { locale: "en-US" });

  if (!parsed.isValid) {
    return null;
  }

  const base = toDateTime(adapter.now(context), context);

  return fromDateTime(
    base.set({
      millisecond: 0,
      hour: parsed.hour,
      minute: parsed.minute,
      second: showSeconds ? parsed.second : 0,
    }),
  );
}
