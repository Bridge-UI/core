// ** External Imports
import { isArray, isNil } from "es-toolkit/compat";

// ** Local Imports
import type { DateAdapter, DateAdapterContext } from "@/Adapters/date";

/**
 * Inclusive date range tuple used when `range` is enabled.
 */
export type DateRangeValue<TDate = Date> = [TDate, TDate];

/**
 * Public model for date pickers (single, multiple, or range).
 */
export type DatePickerModel<TDate = Date> =
  | null
  | TDate
  | TDate[]
  | DateRangeValue<TDate>;

/**
 * Selection mode resolved from `multiple` / `range` flags.
 */
export type DatePickerMode = "range" | "single" | "multiple";

/**
 * Sunday = `0` … Saturday = `6`.
 */
export type StartOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Default first day of the week (Sunday). */
export const DEFAULT_START_OF_WEEK: StartOfWeek = 0;

/**
 * Resolves picker mode. When both flags are set, `range` wins.
 */
export function resolveDatePickerMode({
  range = false,
  multiple = false,
}: {
  multiple?: boolean;
  range?: boolean;
} = {}): DatePickerMode {
  if (range) {
    return "range";
  }

  if (multiple) {
    return "multiple";
  }

  return "single";
}

/**
 * Returns whether `value` is a range tuple.
 */
export function isDateRangeValue<TDate>(
  value: unknown,
): value is DateRangeValue<TDate> {
  return isArray(value) && value.length === 2;
}

/**
 * Sorts a range so the earlier day is first.
 */
export function sortDateRangeValue<TDate>(
  value: DateRangeValue<TDate>,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): DateRangeValue<TDate> {
  const [start, end] = value;

  if (adapter.isAfter(start, end, context)) {
    return [end, start];
  }

  return value;
}

/**
 * Predicate / list inputs for disabling calendar days.
 */
export type DisableDatesInput<TDate = Date> =
  | TDate
  | TDate[]
  | ((date: TDate) => boolean);

/**
 * Options for {@link isDateDisabled}.
 */
export type IsDateDisabledOptions<TDate = Date> = {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  disableDates?: DisableDatesInput<TDate>;
  disableMonths?: number[];
  disableYears?: number[];
  maxDate?: TDate;
  minDate?: TDate;
};

/**
 * Whether `date` is outside min/max or matched by disable rules.
 */
export function isDateDisabled<TDate>(
  date: TDate,
  {
    adapter,
    context,
    maxDate,
    minDate,
    disableDates,
    disableYears,
    disableMonths,
  }: IsDateDisabledOptions<TDate>,
): boolean {
  if (!isNil(minDate) && adapter.isBefore(date, minDate, context)) {
    return true;
  }

  if (!isNil(maxDate) && adapter.isAfter(date, maxDate, context)) {
    return true;
  }

  const year = adapter.getYear(date, context);
  const month = adapter.getMonth(date, context);

  if (!isNil(disableYears) && disableYears.includes(year)) {
    return true;
  }

  if (!isNil(disableMonths) && disableMonths.includes(month)) {
    return true;
  }

  if (isNil(disableDates)) {
    return false;
  }

  if (typeof disableDates === "function") {
    return (disableDates as (value: TDate) => boolean)(date);
  }

  const list = isArray(disableDates) ? disableDates : [disableDates];

  return list.some((entry) => adapter.isSameDay(date, entry, context));
}

/**
 * Whether `month` (`0`–`11`) is disabled for the given year view.
 */
export function isMonthDisabled({
  year,
  month,
  maxDate,
  minDate,
  adapter,
  context,
  disableMonths,
}: {
  adapter: DateAdapter;
  context?: DateAdapterContext;
  disableMonths?: number[];
  maxDate?: Date;
  minDate?: Date;
  month: number;
  year: number;
}): boolean {
  if (!isNil(disableMonths) && disableMonths.includes(month)) {
    return true;
  }

  if (!isNil(minDate)) {
    const minYear = adapter.getYear(minDate, context);
    const minMonth = adapter.getMonth(minDate, context);

    if (year < minYear || (year === minYear && month < minMonth)) {
      return true;
    }
  }

  if (!isNil(maxDate)) {
    const maxYear = adapter.getYear(maxDate, context);
    const maxMonth = adapter.getMonth(maxDate, context);

    if (year > maxYear || (year === maxYear && month > maxMonth)) {
      return true;
    }
  }

  return false;
}

/**
 * Whether `year` is disabled by year list or min/max bounds.
 */
export function isYearDisabled({
  year,
  adapter,
  context,
  maxDate,
  minDate,
  disableYears,
}: {
  adapter: DateAdapter;
  context?: DateAdapterContext;
  disableYears?: number[];
  maxDate?: Date;
  minDate?: Date;
  year: number;
}): boolean {
  if (!isNil(disableYears) && disableYears.includes(year)) {
    return true;
  }

  if (!isNil(minDate) && year < adapter.getYear(minDate, context)) {
    return true;
  }

  if (!isNil(maxDate) && year > adapter.getYear(maxDate, context)) {
    return true;
  }

  return false;
}

/**
 * Applies a day click for single / multiple / range selection.
 */
export function applyDateSelection<TDate>({
  mode,
  next,
  value,
  adapter,
  context,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  mode: DatePickerMode;
  next: TDate;
  value: DatePickerModel<TDate>;
}): DatePickerModel<TDate> {
  if (mode === "single") {
    return next;
  }

  if (mode === "multiple") {
    const current = isArray(value) ? ([...value] as TDate[]) : [];
    const index = current.findIndex((entry) =>
      adapter.isSameDay(entry, next, context),
    );

    if (index >= 0) {
      return current.filter((_, itemIndex) => itemIndex !== index);
    }

    return [...current, next];
  }

  if (isNil(value) || !isArray(value) || value.length !== 2) {
    return [next, next];
  }

  const [start, end] = value as DateRangeValue<TDate>;

  // Same start/end means the range is incomplete (waiting for the end day).
  if (adapter.isSameDay(start, end, context)) {
    return sortDateRangeValue([start, next], adapter, context);
  }

  // Completed range: start a new selection.
  return [next, next];
}

/**
 * Whether `date` is selected under the current model / mode.
 */
export function isDateSelected<TDate>({
  date,
  mode,
  value,
  adapter,
  context,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  date: TDate;
  mode: DatePickerMode;
  value: DatePickerModel<TDate>;
}): boolean {
  if (isNil(value)) {
    return false;
  }

  if (mode === "single" && !isArray(value)) {
    return adapter.isSameDay(value, date, context);
  }

  if (mode === "multiple" && isArray(value)) {
    return value.some((entry) => adapter.isSameDay(entry, date, context));
  }

  if (mode === "range" && isDateRangeValue(value)) {
    const [start, end] = sortDateRangeValue(value, adapter, context);

    return (
      adapter.isSameDay(date, start, context) ||
      adapter.isSameDay(date, end, context) ||
      (adapter.isAfter(date, start, context) &&
        adapter.isBefore(date, end, context))
    );
  }

  return false;
}

/**
 * Whether `date` is the range start or end endpoint.
 */
export function isDateRangeEndpoint<TDate>({
  date,
  value,
  adapter,
  context,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  date: TDate;
  value: DatePickerModel<TDate>;
}): boolean {
  if (!isDateRangeValue(value)) {
    return false;
  }

  const [start, end] = sortDateRangeValue(value, adapter, context);

  return (
    adapter.isSameDay(date, start, context) ||
    adapter.isSameDay(date, end, context)
  );
}

/**
 * Interactive tile state for calendar day / month / year buttons.
 * Priority: `disabled` / `readOnly` → `selected` → `base`.
 *
 * Pointer hover is CSS (`hover:` on the color token). Incomplete range fill
 * uses `data-preview` on the tile — not this state union.
 */
export type CalendarDayInteractionState =
  | "base"
  | "hover"
  | "disabled"
  | "selected";

/**
 * Resolves the visual interaction state for a calendar tile.
 * Pointer hover comes from the `hover` token’s `hover:` classes when the
 * resolved state is `base`. Range preview uses `data-preview`, not `"hover"`.
 */
export function resolveCalendarDayInteractionState({
  disabled = false,
  readOnly = false,
  selected = false,
}: {
  disabled?: boolean;
  readOnly?: boolean;
  selected?: boolean;
} = {}): CalendarDayInteractionState {
  if (disabled || readOnly) {
    return "disabled";
  }

  if (selected) {
    return "selected";
  }

  return "base";
}

/**
 * Whether `date` lies in the incomplete range preview between the anchored
 * start and the hovered `previewDate` (same look as pointer hover).
 */
export function isDateInRangePreview<TDate>({
  date,
  value,
  adapter,
  context,
  previewDate,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  date: TDate;
  previewDate?: null | TDate;
  value: DatePickerModel<TDate>;
}): boolean {
  if (isNil(previewDate) || !isDateRangeValue(value)) {
    return false;
  }

  const [start, end] = value;

  // Preview only while the range is incomplete (start === end).
  if (!adapter.isSameDay(start, end, context)) {
    return false;
  }

  const [from, to] = sortDateRangeValue([start, previewDate], adapter, context);

  return (
    adapter.isSameDay(date, from, context) ||
    adapter.isSameDay(date, to, context) ||
    (adapter.isAfter(date, from, context) &&
      adapter.isBefore(date, to, context))
  );
}

/**
 * Normalizes `startOfWeek` into `0`–`6`.
 */
export function resolveStartOfWeek(
  startOfWeek: number = DEFAULT_START_OF_WEEK,
): StartOfWeek {
  const normalized = ((startOfWeek % 7) + 7) % 7;

  return normalized as StartOfWeek;
}
