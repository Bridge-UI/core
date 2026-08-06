# DatePicker

Inline calendar picker for a single date, multiple dates, or a range. Optional Cancel / Apply footer.

## Import

```ts
import { DatePicker } from "@bridge-ui/react/Components/DatePicker";
```

## Examples

### Usage

```tsx
<DatePicker />

<DatePicker value={date} onChange={setDate} />

<DatePicker
  range
  value={range}
  showFooter
  onChange={setRange}
  onCancel={() => {}}
/>
```

### customProps

```tsx
<DatePicker
  customProps={{
    root: { "data-testid": "date-picker" },
    applyButton: { type: "button" },
  }}
/>
```

## Props

| Prop              | Type                    | Default     | Description                                           |
| ----------------- | ----------------------- | ----------- | ----------------------------------------------------- |
| `classes`         | `DatePickerClasses`     | —           | Classes for picker regions.                           |
| `color`           | `CalendarColor`         | `"primary"` | Accent color.                                         |
| `customProps`     | `DatePickerCustomProps` | —           | Extra props for internal parts.                       |
| `defaultValue`    | `DatePickerModel`       | `null`      | Uncontrolled initial value.                           |
| `defaultView`     | `CalendarView`          | `"date"`    | Initial calendar panel view.                          |
| `disabled`        | `boolean`               | `false`     | Disables the picker.                                  |
| `disableDates`    | `Date[]`                | —           | Dates that cannot be selected.                        |
| `disableMonths`   | `number[]`              | —           | Month indexes that cannot be selected.                |
| `disableYears`    | `number[]`              | —           | Years that cannot be selected.                        |
| `hideMonths`      | `boolean`               | `false`     | Hides month navigation / panel.                       |
| `hideOutsideDays` | `boolean`               | `false`     | Hides days that fall outside the displayed month.     |
| `hideWeekdays`    | `boolean`               | `false`     | Hides weekday labels.                                 |
| `hideYears`       | `boolean`               | `false`     | Hides year navigation / panel.                        |
| `maxDate`         | `Date`                  | —           | Latest selectable date.                               |
| `minDate`         | `Date`                  | —           | Earliest selectable date.                             |
| `multiple`        | `boolean`               | `false`     | Allows selecting multiple dates.                      |
| `range`           | `boolean`               | `false`     | Selects a date range.                                 |
| `readOnly`        | `boolean`               | `false`     | Prevents selection.                                   |
| `rounded`         | `CalendarRounded`       | `"md"`      | Border radius of calendar tiles and chrome.           |
| `showFooter`      | `boolean`               | `false`     | Shows Cancel / Apply. Selection is draft until Apply. |
| `slots`           | `CalendarDateSlots`     | —           | Named slots forwarded to `Calendar` (`day`).          |
| `startOfWeek`     | `StartOfWeek`           | `0`         | First day of the week.                                |
| `timeZone`        | `string`                | —           | IANA time zone.                                       |
| `tokens`          | `DatePickerTokens`      | —           | Token overrides.                                      |
| `value`           | `DatePickerModel`       | —           | Controlled value.                                     |

## Events

| Callback   | Type                               | Description                                                            |
| ---------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `onCancel` | `() => void`                       | Called when Cancel is pressed.                                         |
| `onChange` | `(value: DatePickerModel) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

Calendar, DateField, DateRangePicker
