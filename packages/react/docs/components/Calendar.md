# Calendar

Standalone calendar with date, month, and year panels. Supports single, multiple, and range selection.

## Import

```ts
import { Calendar } from "@bridge-ui/react/Components/Calendar";
```

## Examples

### Usage

```tsx
<Calendar />

<Calendar
  value={date}
  onChange={setDate}
/>

<Calendar
  range
  value={range}
  minDate={min}
  maxDate={max}
  onChange={setRange}
/>

<Calendar
  multiple
  value={dates}
  onChange={setDates}
/>
```

### Bounds and disabled dates

```tsx
<Calendar
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  disableDates={[new Date(2026, 7, 15)]}
/>
```

### customProps

```tsx
<Calendar
  customProps={{
    root: { "data-testid": "calendar" },
    todayButton: { type: "button" },
  }}
/>
```

## Props

| Prop              | Type                  | Default     | Description                                               |
| ----------------- | --------------------- | ----------- | --------------------------------------------------------- |
| `classes`         | `CalendarClasses`     | —           | Classes for calendar regions.                             |
| `color`           | `CalendarColor`       | `"primary"` | Accent color for tiles.                                   |
| `customProps`     | `CalendarCustomProps` | —           | Extra props for internal parts.                           |
| `defaultValue`    | `DatePickerModel`     | `null`      | Uncontrolled initial value.                               |
| `defaultView`     | `CalendarView`        | `"date"`    | Uncontrolled initial panel view.                          |
| `disabled`        | `boolean`             | `false`     | Disables the calendar.                                    |
| `disableDates`    | `Date[]`              | —           | Dates that cannot be selected.                            |
| `disableMonths`   | `number[]`            | —           | Month indexes (`0`–`11`) that cannot be selected.         |
| `disableYears`    | `number[]`            | —           | Years that cannot be selected.                            |
| `error`           | `boolean`             | `false`     | Applies the error color palette to tiles.                 |
| `fill`            | `boolean`             | `false`     | Fills the container width.                                |
| `hideMonths`      | `boolean`             | `false`     | Hides the month selector and month panel.                 |
| `hideOutsideDays` | `boolean`             | `false`     | Hides days that fall outside the displayed month.         |
| `hideWeekdays`    | `boolean`             | `false`     | Hides weekday labels on the date panel.                   |
| `hideYears`       | `boolean`             | `false`     | Hides the year selector and year panel.                   |
| `maxDate`         | `Date`                | —           | Latest selectable date.                                   |
| `minDate`         | `Date`                | —           | Earliest selectable date.                                 |
| `multiple`        | `boolean`             | `false`     | Allows selecting multiple dates.                          |
| `previewDate`     | `Date \| null`        | —           | Controlled range-preview hover date.                      |
| `range`           | `boolean`             | `false`     | Selects a start/end date range.                           |
| `readOnly`        | `boolean`             | `false`     | Prevents selection.                                       |
| `rounded`         | `CalendarRounded`     | `"md"`      | Border radius of tiles and chrome.                        |
| `slots`           | `CalendarDateSlots`   | —           | Named slots forwarded to `CalendarDate` (`day`).          |
| `startOfWeek`     | `StartOfWeek`         | `0`         | First day of the week (`0` = Sunday).                     |
| `timeZone`        | `string`              | —           | IANA time zone.                                           |
| `value`           | `DatePickerModel`     | —           | Controlled selection model.                               |
| `view`            | `CalendarView`        | —           | Controlled panel view. Pair with `onViewChange`.          |
| `viewDate`        | `Date`                | —           | Controlled displayed month. Pair with `onViewDateChange`. |

Calendar chrome tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Callback              | Type                               | Description                                       |
| --------------------- | ---------------------------------- | ------------------------------------------------- |
| `onChange`            | `(value: DatePickerModel) => void` | Called when the selection model changes.          |
| `onPreviewDateChange` | `(date: Date \| null) => void`     | Called when the range preview hover date changes. |
| `onViewChange`        | `(view: CalendarView) => void`     | Called when the active panel view changes.        |
| `onViewDateChange`    | `(date: Date) => void`             | Called when the displayed month changes.          |

## Related components

CalendarDate, CalendarMonth, CalendarYear, CalendarRange, DatePicker, DateField
