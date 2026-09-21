# CalendarRange

Dual-month calendar for selecting a date range. Year sits on the left and nav
on the right; month selectors sit inward from the header midpoint
(`orientation="horizontal"` side-by-side, or `"vertical"` stacked).

## Import

```ts
import { CalendarRange } from "@bridge-ui/react/Components/CalendarRange";
```

## Examples

### Usage

```tsx
<CalendarRange />

<CalendarRange
  value={range}
  onChange={setRange}
/>

<CalendarRange granularity="month" />

<CalendarRange orientation="vertical" />

<CalendarRange
  value={range}
  minDate={min}
  maxDate={max}
  onChange={setRange}
/>
```

### customProps

```tsx
<CalendarRange
  customProps={{
    startHeader: { className: "pr-2" },
    root: { "data-testid": "calendar-range" },
  }}
/>
```

## Props

| Prop              | Type                         | Default               | Description                                                                               |
| ----------------- | ---------------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `classes`         | `CalendarRangeClasses`       | —                     | Classes for calendar range regions.                                                       |
| `color`           | `CalendarColor`              | `"primary"`           | Accent color for tiles.                                                                   |
| `customProps`     | `CalendarRangeCustomProps`   | —                     | Extra props for internal parts.                                                           |
| `defaultValue`    | `DateRangeValue \| null`     | `null`                | Uncontrolled initial value.                                                               |
| `defaultView`     | `CalendarView`               | matches `granularity` | Uncontrolled initial panel. Clamped so it is not deeper than `granularity`.               |
| `disabled`        | `boolean`                    | `false`               | Disables the calendar range.                                                              |
| `disableDates`    | `Date[]`                     | —                     | Dates that cannot be selected.                                                            |
| `disableMonths`   | `number[]`                   | —                     | Month indexes that cannot be selected.                                                    |
| `disableYears`    | `number[]`                   | —                     | Years that cannot be selected.                                                            |
| `error`           | `boolean`                    | `false`               | Applies the error color palette to tiles.                                                 |
| `fill`            | `boolean`                    | `false`               | Fills the container width.                                                                |
| `granularity`     | `"day" \| "month" \| "year"` | `"day"`               | Deepest selectable panel. Month and year commit as a `Date`.                              |
| `hideMonths`      | `boolean`                    | `false`               | Hides the shared month selector and month panel. Ignored when `granularity` is `"month"`. |
| `hideOutsideDays` | `boolean`                    | `false`               | Hides days outside the displayed month on both date panels.                               |
| `hideWeekdays`    | `boolean`                    | `false`               | Hides weekday labels on both date panels.                                                 |
| `hideYears`       | `boolean`                    | `false`               | Hides the shared year selector and year panel. Ignored when `granularity` is `"year"`.    |
| `maxDate`         | `Date`                       | —                     | Latest selectable date.                                                                   |
| `minDate`         | `Date`                       | —                     | Earliest selectable date.                                                                 |
| `orientation`     | `"horizontal" \| "vertical"` | `"horizontal"`        | Dual calendar layout: side-by-side or stacked.                                            |
| `previewDate`     | `Date \| null`               | —                     | Controlled range-preview hover date.                                                      |
| `readOnly`        | `boolean`                    | `false`               | Prevents selection.                                                                       |
| `rounded`         | `CalendarRounded`            | `"md"`                | Border radius of tiles and chrome.                                                        |
| `slots`           | `CalendarRangeSlots`         | —                     | Named slots (`day`, optional `startAside` / `endAside`).                                  |
| `startOfWeek`     | `StartOfWeek`                | `0`                   | First day of the week.                                                                    |
| `timeZone`        | `string`                     | —                     | IANA time zone.                                                                           |
| `value`           | `DateRangeValue \| null`     | —                     | Controlled range value (`[start, end]`).                                                  |
| `viewDate`        | `Date`                       | —                     | Controlled start (left) displayed month.                                                  |

Calendar chrome tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Callback              | Type                                      | Description                                       |
| --------------------- | ----------------------------------------- | ------------------------------------------------- |
| `onChange`            | `(value: DateRangeValue \| null) => void` | Called when the range changes.                    |
| `onPreviewDateChange` | `(date: Date \| null) => void`            | Called when the range preview hover date changes. |
| `onViewDateChange`    | `(date: Date) => void`                    | Called when the start displayed month changes.    |

## Related components

Calendar, CalendarDate, DateRangePicker, DateRangeField
