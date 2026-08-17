# DateTimeRangePicker

Inline picker combining `CalendarRange` with a time panel beside each month
(`Calendar + Time` pairs). With `orientation="vertical"`, pairs stack.

## Import

```ts
import { DateTimeRangePicker } from "@bridge-ui/react/Components/DateTimeRangePicker";
```

## Examples

### Usage

```tsx
<DateTimeRangePicker />

<DateTimeRangePicker value={range} onChange={setRange} />

<DateTimeRangePicker
  ampm
  interval={15}
  value={range}
  onChange={setRange}
/>
```

## Props

| Prop              | Type                             | Default        | Description                                                        |
| ----------------- | -------------------------------- | -------------- | ------------------------------------------------------------------ |
| `ampm`            | `boolean`                        | `false`        | Uses a 12-hour clock with an AM/PM column.                         |
| `classes`         | `DateTimeRangePickerClasses`     | —              | Classes for picker regions.                                        |
| `color`           | `CalendarColor`                  | `"primary"`    | Accent color.                                                      |
| `customProps`     | `DateTimeRangePickerCustomProps` | —              | Extra props for internal parts.                                    |
| `defaultValue`    | `DateRangeValue \| null`         | `null`         | Uncontrolled initial value.                                        |
| `disabled`        | `boolean`                        | `false`        | Disables the picker.                                               |
| `disableDates`    | `Date[]`                         | —              | Dates that cannot be selected.                                     |
| `disableMonths`   | `number[]`                       | —              | Month indexes that cannot be selected.                             |
| `disableTimes`    | `Date[]`                         | —              | Times that cannot be selected.                                     |
| `disableYears`    | `number[]`                       | —              | Years that cannot be selected.                                     |
| `error`           | `boolean`                        | `false`        | Applies the error color palette to tiles.                          |
| `hideMonths`      | `boolean`                        | `false`        | Hides month navigation / panel.                                    |
| `hideOutsideDays` | `boolean`                        | `false`        | Hides days that fall outside the displayed month.                  |
| `hideWeekdays`    | `boolean`                        | `false`        | Hides weekday labels.                                              |
| `hideYears`       | `boolean`                        | `false`        | Hides year navigation / panel.                                     |
| `interval`        | `number`                         | `1`            | Minute step between time options.                                  |
| `maxDate`         | `Date`                           | —              | Latest selectable date.                                            |
| `maxTime`         | `Date`                           | —              | Latest selectable time.                                            |
| `minDate`         | `Date`                           | —              | Earliest selectable date.                                          |
| `minTime`         | `Date`                           | —              | Earliest selectable time.                                          |
| `orientation`     | `"horizontal" \| "vertical"`     | `"horizontal"` | Dual calendar layout: side-by-side or stacked.                     |
| `readOnly`        | `boolean`                        | `false`        | Prevents selection.                                                |
| `rounded`         | `CalendarRounded`                | `"md"`         | Border radius of calendar / time tiles and chrome.                 |
| `showFooter`      | `boolean`                        | `false`        | Shows Cancel / Apply. Selection is draft until Apply.              |
| `showSeconds`     | `boolean`                        | `false`        | Shows seconds in the panel and formatted value.                    |
| `slots`           | `DateTimeRangePickerSlots`       | —              | Named slots (`day` on the calendars, `footer` for Cancel / Apply). |
| `startOfWeek`     | `StartOfWeek`                    | `0`            | First day of the week.                                             |
| `timeZone`        | `string`                         | —              | IANA time zone.                                                    |
| `tokens`          | `DateTimeRangePickerTokens`      | —              | Token overrides.                                                   |
| `value`           | `DateRangeValue \| null`         | —              | Controlled value (`[start, end]` date-times).                      |

## Events

| Callback   | Type                                      | Description                                                            |
| ---------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `onApply`  | `() => void`                              | Called when Apply is pressed (`showFooter`).                           |
| `onCancel` | `() => void`                              | Called when Cancel is pressed.                                         |
| `onChange` | `(value: DateRangeValue \| null) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

CalendarRange, TimePanel, DateTimeRangeField, DateRangePicker
