# CalendarRange

Dual-month calendar for selecting a date range. Shared year/month selectors with
two date panels (`orientation="horizontal"` side-by-side, or `"vertical"` stacked).

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
    root: { "data-testid": "calendar-range" },
    panels: { className: "gap-4" },
  }}
/>
```

## Props

| Prop            | Type                         | Default        | Description                                              |
| --------------- | ---------------------------- | -------------- | -------------------------------------------------------- |
| `classes`       | `CalendarRangeClasses`       | —              | Classes for calendar range regions.                      |
| `color`         | `CalendarColor`              | `"primary"`    | Accent color for tiles.                                  |
| `customProps`   | `CalendarRangeCustomProps`   | —              | Extra props for internal parts.                          |
| `defaultValue`  | `DateRangeValue \| null`     | `null`         | Uncontrolled initial value.                              |
| `disabled`      | `boolean`                    | `false`        | Disables the calendar range.                             |
| `disableDates`  | `Date[]`                     | —              | Dates that cannot be selected.                           |
| `disableMonths` | `number[]`                   | —              | Month indexes that cannot be selected.                   |
| `disableYears`  | `number[]`                   | —              | Years that cannot be selected.                           |
| `hideMonths`    | `boolean`                    | `false`        | Hides the shared month selector and month panel.         |
| `hideWeekdays`  | `boolean`                    | `false`        | Hides weekday labels on both date panels.                |
| `hideYears`     | `boolean`                    | `false`        | Hides the shared year selector and year panel.           |
| `maxDate`       | `Date`                       | —              | Latest selectable date.                                  |
| `minDate`       | `Date`                       | —              | Earliest selectable date.                                |
| `orientation`   | `"horizontal" \| "vertical"` | `"horizontal"` | Dual calendar layout: side-by-side or stacked.           |
| `previewDate`   | `Date \| null`               | —              | Controlled range-preview hover date.                     |
| `readOnly`      | `boolean`                    | `false`        | Prevents selection.                                      |
| `rounded`       | `CalendarRounded`            | `"md"`         | Border radius of tiles and chrome.                       |
| `slots`         | `CalendarRangeSlots`         | —              | Named slots (`day`, optional `startAside` / `endAside`). |
| `startOfWeek`   | `StartOfWeek`                | `0`            | First day of the week.                                   |
| `timeZone`      | `string`                     | —              | IANA time zone.                                          |
| `tokens`        | `CalendarRangeTokens`        | —              | Token overrides.                                         |
| `value`         | `DateRangeValue \| null`     | —              | Controlled range value (`[start, end]`).                 |
| `viewDate`      | `Date`                       | —              | Controlled start (left) displayed month.                 |

## Events

| Callback              | Type                                      | Description                                       |
| --------------------- | ----------------------------------------- | ------------------------------------------------- |
| `onChange`            | `(value: DateRangeValue \| null) => void` | Called when the range changes.                    |
| `onPreviewDateChange` | `(date: Date \| null) => void`            | Called when the range preview hover date changes. |
| `onViewDateChange`    | `(date: Date) => void`                    | Called when the start displayed month changes.    |

## Related components

Calendar, CalendarDate, DateRangePicker, DateRangeField
