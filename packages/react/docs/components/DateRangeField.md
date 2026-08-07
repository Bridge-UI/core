# DateRangeField

Form field that opens a `DateRangePicker` in a menu. Extends FormField props.

## Import

```ts
import { DateRangeField } from "@bridge-ui/react/Components/DateRangeField";
```

## Examples

### Usage

```tsx
<DateRangeField label="Stay" />

<DateRangeField
  label="Trip"
  value={range}
  onChange={setRange}
/>

<DateRangeField
  error
  label="Dates"
  errorMessage="Select a valid range."
/>
```

### customProps

```tsx
<DateRangeField
  label="Stay"
  customProps={{
    input: { name: "stay" },
    dateRangePicker: { root: { "data-testid": "range-picker" } },
  }}
/>
```

## Props

### DateRangeField-specific

| Prop              | Type                         | Default        | Description                                       |
| ----------------- | ---------------------------- | -------------- | ------------------------------------------------- |
| `classes`         | `DateRangeFieldClasses`      | —              | Classes for field / input regions.                |
| `customProps`     | `DateRangeFieldCustomProps`  | —              | Extra props for internal parts.                   |
| `defaultValue`    | `DateRangeValue \| null`     | `null`         | Uncontrolled initial value.                       |
| `disableDates`    | `Date[]`                     | —              | Dates that cannot be selected.                    |
| `disableMonths`   | `number[]`                   | —              | Month indexes that cannot be selected.            |
| `disableYears`    | `number[]`                   | —              | Years that cannot be selected.                    |
| `hideMonths`      | `boolean`                    | `false`        | Hides month navigation / panel.                   |
| `hideOutsideDays` | `boolean`                    | `false`        | Hides days that fall outside the displayed month. |
| `hideWeekdays`    | `boolean`                    | `false`        | Hides weekday labels.                             |
| `hideYears`       | `boolean`                    | `false`        | Hides year navigation / panel.                    |
| `maxDate`         | `Date`                       | —              | Latest selectable date.                           |
| `minDate`         | `Date`                       | —              | Earliest selectable date.                         |
| `orientation`     | `"horizontal" \| "vertical"` | `"horizontal"` | Dual calendar layout forwarded to the picker.     |
| `showFooter`      | `boolean`                    | `false`        | Shows Cancel / Apply on the nested picker.        |
| `slots`           | `DateRangeFieldSlots`        | —              | Named slots (`FormField` slots + calendar `day`). |
| `startOfWeek`     | `StartOfWeek`                | `0`            | First day of the week.                            |
| `timeZone`        | `string`                     | —              | IANA time zone.                                   |
| `value`           | `DateRangeValue \| null`     | —              | Controlled value.                                 |

### Binding

| Prop       | Type                                      | Default | Description                            |
| ---------- | ----------------------------------------- | ------- | -------------------------------------- |
| `value`    | `DateRangeValue \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: DateRangeValue \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                                      | Description                    |
| ---------- | ----------------------------------------- | ------------------------------ |
| `onChange` | `(value: DateRangeValue \| null) => void` | Called when the range changes. |
| `onClose`  | `() => void`                              | Called when the menu closes.   |
| `onOpen`   | `() => void`                              | Called when the menu opens.    |

## Related components

DateRangePicker, FormField, DateField
