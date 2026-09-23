// ** External Imports
import { isArray, isFunction, isNil } from "es-toolkit/compat";

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
  null | TDate | TDate[] | DateRangeValue<TDate>;

/**
 * Selection mode resolved from `multiple` / `range` flags.
 */
export type DatePickerMode = "range" | "single" | "multiple";

/**
 * Deepest selectable calendar panel. The stored model stays a `Date`.
 */
export type CalendarGranularity = "day" | "year" | "month";

/**
 * Calendar panel shown in `Calendar` / `CalendarRange`.
 */
export type CalendarView = "date" | "year" | "month";

/**
 * Sunday = `0` … Saturday = `6`.
 */
export type StartOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Default first day of the week (Sunday). */
export const DEFAULT_START_OF_WEEK: StartOfWeek = 0;

/** Default calendar / picker granularity (day panel). */
export const DEFAULT_CALENDAR_GRANULARITY: CalendarGranularity = "day";

const CALENDAR_PANEL_DEPTH: Record<CalendarView, number> = {
  date: 2,
  year: 0,
  month: 1,
};

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
 * Panel that matches `granularity` (month picker opens on months, not days).
 */
export function calendarPanelViewFromGranularity(
  granularity: CalendarGranularity = DEFAULT_CALENDAR_GRANULARITY,
): CalendarView {
  if (granularity === "year") {
    return "year";
  }

  if (granularity === "month") {
    return "month";
  }

  return "date";
}

/**
 * Clamps `view` so it is not deeper than `granularity`.
 */
export function clampCalendarPanelView(
  view: CalendarView,
  granularity: CalendarGranularity = DEFAULT_CALENDAR_GRANULARITY,
): CalendarView {
  const deepest = calendarPanelViewFromGranularity(granularity);

  if (CALENDAR_PANEL_DEPTH[view] > CALENDAR_PANEL_DEPTH[deepest]) {
    return deepest;
  }

  return view;
}

/**
 * Resolves the visible panel, applying granularity clamp and hide flags.
 * Hiding the commit panel (`hideMonths` + `granularity="month"`) is a no-op.
 */
export function resolveCalendarPanelView({
  view,
  hideYears = false,
  hideMonths = false,
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  granularity?: CalendarGranularity;
  hideMonths?: boolean;
  hideYears?: boolean;
  view: CalendarView;
}): CalendarView {
  let next = clampCalendarPanelView(view, granularity);

  if (next === "year" && hideYears && granularity !== "year") {
    next = calendarPanelViewFromGranularity(granularity);
  }

  if (next === "month" && hideMonths && granularity !== "month") {
    next = calendarPanelViewFromGranularity(granularity);
  }

  return next;
}

/**
 * Whether the month selector / panel should stay hidden.
 */
export function isCalendarMonthPanelHidden({
  hideMonths = false,
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  granularity?: CalendarGranularity;
  hideMonths?: boolean;
} = {}): boolean {
  if (granularity === "year") {
    return true;
  }

  if (granularity === "month") {
    return false;
  }

  return hideMonths;
}

/**
 * Whether the year selector / panel should stay hidden.
 */
export function isCalendarYearPanelHidden({
  hideYears = false,
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  granularity?: CalendarGranularity;
  hideYears?: boolean;
} = {}): boolean {
  if (granularity === "year") {
    return false;
  }

  return hideYears;
}

/**
 * Builds the first day of `month` in `year` (local / zoned).
 */
export function dateFromYearMonth<TDate>({
  year,
  month,
  adapter,
  context,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  month: number;
  year: number;
}): TDate {
  const origin = adapter.startOfMonth(adapter.now(context), context);

  return adapter.startOfMonth(
    adapter.setMonth(adapter.setYear(origin, year, context), month, context),
    context,
  );
}

/**
 * Builds January 1 of `year` (local / zoned).
 */
export function dateFromYear<TDate>({
  year,
  adapter,
  context,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  year: number;
}): TDate {
  return dateFromYearMonth({
    year,
    adapter,
    context,
    month: 0,
  });
}

/**
 * Numeric key for comparing dates at `granularity`.
 */
function granularityKey<TDate>(
  date: TDate,
  granularity: CalendarGranularity,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): number {
  const year = adapter.getYear(date, context);

  if (granularity === "year") {
    return year;
  }

  const month = adapter.getMonth(date, context);

  if (granularity === "month") {
    return year * 12 + month;
  }

  return year * 10_000 + month * 100 + adapter.getDate(date, context);
}

/**
 * Whether `a` and `b` fall in the same unit for `granularity`.
 */
export function isSameAtGranularity<TDate>(
  a: TDate,
  b: TDate,
  granularity: CalendarGranularity,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): boolean {
  return (
    granularityKey(a, granularity, adapter, context) ===
    granularityKey(b, granularity, adapter, context)
  );
}

/**
 * Whether `a` is before `b` at `granularity`.
 */
export function isBeforeAtGranularity<TDate>(
  a: TDate,
  b: TDate,
  granularity: CalendarGranularity,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): boolean {
  return (
    granularityKey(a, granularity, adapter, context) <
    granularityKey(b, granularity, adapter, context)
  );
}

/**
 * Whether `a` is after `b` at `granularity`.
 */
export function isAfterAtGranularity<TDate>(
  a: TDate,
  b: TDate,
  granularity: CalendarGranularity,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): boolean {
  return (
    granularityKey(a, granularity, adapter, context) >
    granularityKey(b, granularity, adapter, context)
  );
}

/**
 * Normalizes `date` on commit: month → first of month, year → January 1.
 */
export function normalizeDateToGranularity<TDate>(
  date: TDate,
  granularity: CalendarGranularity = DEFAULT_CALENDAR_GRANULARITY,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): TDate {
  if (granularity === "year") {
    return adapter.startOfMonth(adapter.setMonth(date, 0, context), context);
  }

  if (granularity === "month") {
    return adapter.startOfMonth(date, context);
  }

  return date;
}

/**
 * Normalizes a picker model on commit at `granularity`.
 */
export function normalizeDatePickerModel<TDate>(
  value: DatePickerModel<TDate>,
  granularity: CalendarGranularity = DEFAULT_CALENDAR_GRANULARITY,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
): DatePickerModel<TDate> {
  if (isNil(value)) {
    return value;
  }

  if (isDateRangeValue(value)) {
    return sortDateRangeValue(
      [
        normalizeDateToGranularity(value[0], granularity, adapter, context),
        normalizeDateToGranularity(value[1], granularity, adapter, context),
      ],
      adapter,
      context,
    );
  }

  if (isArray(value)) {
    return value.map((entry) => {
      return normalizeDateToGranularity(entry, granularity, adapter, context);
    });
  }

  return normalizeDateToGranularity(value, granularity, adapter, context);
}

/**
 * Formats a picker model with the adapter at `granularity`.
 */
export function formatDatePickerModel<TDate>(
  value: DatePickerModel<TDate>,
  adapter: DateAdapter<TDate>,
  context?: DateAdapterContext,
  granularity: CalendarGranularity = DEFAULT_CALENDAR_GRANULARITY,
): string {
  if (isNil(value)) {
    return "";
  }

  const formatDate = (date: TDate) => {
    return adapter.format(date, context, { granularity });
  };

  if (isDateRangeValue(value)) {
    return `${formatDate(value[0])} – ${formatDate(value[1])}`;
  }

  if (isArray(value)) {
    return value.map(formatDate).join(", ");
  }

  return formatDate(value);
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
  TDate | TDate[] | ((date: TDate) => boolean);

/**
 * Options for {@link isDateDisabled}.
 */
export type IsDateDisabledOptions<TDate = Date> = {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  disableDates?: DisableDatesInput<TDate>;
  disableMonths?: number[];
  disableYears?: number[];
  granularity?: CalendarGranularity;
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
    granularity = DEFAULT_CALENDAR_GRANULARITY,
  }: IsDateDisabledOptions<TDate>,
): boolean {
  if (
    !isNil(minDate) &&
    isBeforeAtGranularity(date, minDate, granularity, adapter, context)
  ) {
    return true;
  }

  if (
    !isNil(maxDate) &&
    isAfterAtGranularity(date, maxDate, granularity, adapter, context)
  ) {
    return true;
  }

  const year = adapter.getYear(date, context);
  const month = adapter.getMonth(date, context);

  if (!isNil(disableYears) && disableYears.includes(year)) {
    return true;
  }

  if (
    granularity !== "year" &&
    !isNil(disableMonths) &&
    disableMonths.includes(month)
  ) {
    return true;
  }

  if (isNil(disableDates)) {
    return false;
  }

  if (isFunction(disableDates)) {
    return (disableDates as (value: TDate) => boolean)(date);
  }

  const list = isArray(disableDates) ? disableDates : [disableDates];

  return list.some((entry) => {
    return isSameAtGranularity(date, entry, granularity, adapter, context);
  });
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
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  granularity?: CalendarGranularity;
  mode: DatePickerMode;
  next: TDate;
  value: DatePickerModel<TDate>;
}): DatePickerModel<TDate> {
  const committed = normalizeDateToGranularity(
    next,
    granularity,
    adapter,
    context,
  );

  if (mode === "single") {
    return committed;
  }

  if (mode === "multiple") {
    const current = isArray(value) ? ([...value] as TDate[]) : [];
    const index = current.findIndex((entry) =>
      isSameAtGranularity(entry, committed, granularity, adapter, context),
    );

    if (index >= 0) {
      return current.filter((_, itemIndex) => itemIndex !== index);
    }

    return [...current, committed];
  }

  if (isNil(value) || !isArray(value) || value.length !== 2) {
    return [committed, committed];
  }

  const [start, end] = value as DateRangeValue<TDate>;

  // Same start/end means the range is incomplete (waiting for the end unit).
  if (isSameAtGranularity(start, end, granularity, adapter, context)) {
    return sortDateRangeValue([start, committed], adapter, context);
  }

  // Completed range: start a new selection.
  return [committed, committed];
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
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  date: TDate;
  granularity?: CalendarGranularity;
  mode: DatePickerMode;
  value: DatePickerModel<TDate>;
}): boolean {
  if (isNil(value)) {
    return false;
  }

  if (mode === "single" && !isArray(value)) {
    return isSameAtGranularity(value, date, granularity, adapter, context);
  }

  if (mode === "multiple" && isArray(value)) {
    return value.some((entry) => {
      return isSameAtGranularity(entry, date, granularity, adapter, context);
    });
  }

  if (mode === "range" && isDateRangeValue(value)) {
    const [start, end] = sortDateRangeValue(value, adapter, context);

    return (
      isSameAtGranularity(date, end, granularity, adapter, context) ||
      isSameAtGranularity(date, start, granularity, adapter, context) ||
      (isAfterAtGranularity(date, start, granularity, adapter, context) &&
        isBeforeAtGranularity(date, end, granularity, adapter, context))
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
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  date: TDate;
  granularity?: CalendarGranularity;
  value: DatePickerModel<TDate>;
}): boolean {
  if (!isDateRangeValue(value)) {
    return false;
  }

  const [start, end] = sortDateRangeValue(value, adapter, context);

  return (
    isSameAtGranularity(date, end, granularity, adapter, context) ||
    isSameAtGranularity(date, start, granularity, adapter, context)
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
  "base" | "hover" | "disabled" | "selected";

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
  granularity = DEFAULT_CALENDAR_GRANULARITY,
}: {
  adapter: DateAdapter<TDate>;
  context?: DateAdapterContext;
  date: TDate;
  granularity?: CalendarGranularity;
  previewDate?: null | TDate;
  value: DatePickerModel<TDate>;
}): boolean {
  if (isNil(previewDate) || !isDateRangeValue(value)) {
    return false;
  }

  const [start, end] = value;

  // Preview only while the range is incomplete (start === end).
  if (!isSameAtGranularity(start, end, granularity, adapter, context)) {
    return false;
  }

  const [from, to] = sortDateRangeValue([start, previewDate], adapter, context);

  return (
    isSameAtGranularity(date, to, granularity, adapter, context) ||
    isSameAtGranularity(date, from, granularity, adapter, context) ||
    (isAfterAtGranularity(date, from, granularity, adapter, context) &&
      isBeforeAtGranularity(date, to, granularity, adapter, context))
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
