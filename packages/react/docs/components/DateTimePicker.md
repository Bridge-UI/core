# DateTimePicker

Inline picker combining a `Calendar` and `TimePanel` side by side into a single
`Date` instant.

## Import

```ts
import { DateTimePicker } from "@bridge-ui/react/Components/DateTimePicker";
```

## Examples

### Usage

```tsx
<DateTimePicker />

<DateTimePicker value={when} onChange={setWhen} />

<DateTimePicker
  ampm
  showFooter
  value={when}
  interval={15}
  onChange={setWhen}
/>
```

## Props

| Prop              | Type                        | Default     | Description                                                       |
| ----------------- | --------------------------- | ----------- | ----------------------------------------------------------------- |
| `ampm`            | `boolean`                   | `false`     | Uses a 12-hour clock with an AM/PM column.                        |
| `classes`         | `DateTimePickerClasses`     | —           | Classes for picker regions.                                       |
| `color`           | `CalendarColor`             | `"primary"` | Accent color.                                                     |
| `customProps`     | `DateTimePickerCustomProps` | —           | Extra props for internal parts.                                   |
| `defaultValue`    | `Date \| null`              | `null`      | Uncontrolled initial value.                                       |
| `defaultView`     | `CalendarView`              | `"date"`    | Initial calendar panel view.                                      |
| `disabled`        | `boolean`                   | `false`     | Disables the picker.                                              |
| `disableDates`    | `Date[]`                    | —           | Dates that cannot be selected.                                    |
| `disableMonths`   | `number[]`                  | —           | Month indexes that cannot be selected.                            |
| `disableTimes`    | `Date[]`                    | —           | Times that cannot be selected.                                    |
| `disableYears`    | `number[]`                  | —           | Years that cannot be selected.                                    |
| `hideMonths`      | `boolean`                   | `false`     | Hides month navigation / panel.                                   |
| `hideOutsideDays` | `boolean`                   | `false`     | Hides days that fall outside the displayed month.                 |
| `hideWeekdays`    | `boolean`                   | `false`     | Hides weekday labels.                                             |
| `hideYears`       | `boolean`                   | `false`     | Hides year navigation / panel.                                    |
| `interval`        | `number`                    | `1`         | Minute step between time options.                                 |
| `maxDate`         | `Date`                      | —           | Latest selectable date.                                           |
| `maxTime`         | `Date`                      | —           | Latest selectable time.                                           |
| `minDate`         | `Date`                      | —           | Earliest selectable date.                                         |
| `minTime`         | `Date`                      | —           | Earliest selectable time.                                         |
| `readOnly`        | `boolean`                   | `false`     | Prevents selection.                                               |
| `rounded`         | `CalendarRounded`           | `"md"`      | Border radius of calendar / time tiles and chrome.                |
| `showFooter`      | `boolean`                   | `false`     | Shows Cancel / Apply. Selection is draft until Apply.             |
| `showSeconds`     | `boolean`                   | `false`     | Shows seconds in the panel and formatted value.                   |
| `slots`           | `DateTimePickerSlots`       | —           | Named slots (`day` on the calendar, `footer` for Cancel / Apply). |
| `startOfWeek`     | `StartOfWeek`               | `0`         | First day of the week.                                            |
| `timeZone`        | `string`                    | —           | IANA time zone.                                                   |
| `tokens`          | `DateTimePickerTokens`      | —           | Token overrides.                                                  |
| `value`           | `Date \| null`              | —           | Controlled date-time value.                                       |

## Events

| Callback   | Type                            | Description                                                            |
| ---------- | ------------------------------- | ---------------------------------------------------------------------- |
| `onApply`  | `() => void`                    | Called when Apply is pressed (`showFooter`).                           |
| `onCancel` | `() => void`                    | Called when Cancel is pressed.                                         |
| `onChange` | `(value: Date \| null) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

Calendar, TimePanel, DateTimeField, DatePicker
