// ** Local Imports
import type { DateAdapter } from "@/Adapters/date";

/**
 * Copies `year`/`month`/`day`/`hours`/`minutes`/`seconds` from `fromTimeZone`
 * onto a date interpreted in `toTimeZone` (no instant conversion).
 *
 * Use in a computed around v-model when the stored `Date` should keep the UI
 * wall clock as UTC fields instead of a real instant.
 */
export function copyDateWallClock<TDate>({
  date,
  adapter,
  toTimeZone,
  fromTimeZone,
}: {
  adapter: DateAdapter<TDate>;
  date: TDate;
  fromTimeZone?: string;
  toTimeZone?: string;
}): TDate {
  const year = adapter.getYear(date, fromTimeZone);
  const month = adapter.getMonth(date, fromTimeZone);
  const day = adapter.getDate(date, fromTimeZone);
  const hours = adapter.getHours(date, fromTimeZone);
  const minutes = adapter.getMinutes(date, fromTimeZone);
  const seconds = adapter.getSeconds(date, fromTimeZone);

  let next = adapter.setDate(adapter.now(toTimeZone), 1, toTimeZone);

  next = adapter.setYear(next, year, toTimeZone);
  next = adapter.setMonth(next, month, toTimeZone);
  next = adapter.setDate(next, day, toTimeZone);
  next = adapter.setHours(next, hours, toTimeZone);
  next = adapter.setMinutes(next, minutes, toTimeZone);
  next = adapter.setSeconds(next, seconds, toTimeZone);

  if (next instanceof Date) {
    next.setMilliseconds(0);
  }

  return next;
}
