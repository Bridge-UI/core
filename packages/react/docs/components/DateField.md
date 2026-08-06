# DateField

Form field that opens a `DatePicker` in a menu. Extends FormField props.

## Import

```ts
import { DateField } from "@bridge-ui/react/Components/DateField";
```

## Examples

### Usage

```tsx
<DateField label="Start date" />

<DateField
  label="Birthday"
  value={date}
  onChange={setDate}
  description="Stored as a local calendar date."
/>

<DateField
  error
  label="Date"
  errorMessage="Pick a valid date."
/>
```

### Range

```tsx
<DateField
  range
  label="Trip"
  value={range}
  onChange={setRange}
/>
```

### customProps

```tsx
<DateField
  label="Date"
  customProps={{
    input: { name: "date" },
    datePicker: { root: { "data-testid": "date-picker" } },
  }}
/>
```

## Props

### DateField-specific

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `classes` | `DateFieldClasses` | — | Classes for field / input regions. |
| `customProps` | `DateFieldCustomProps` | — | Extra props for internal parts (`input`, `menu`, `datePicker`, …). |
| `defaultValue` | `DatePickerModel` | `null` | Uncontrolled initial value. |
| `defaultView` | `CalendarView` | `"date"` | Initial calendar panel view. |
| `disableDates` | `Date[]` | — | Dates that cannot be selected. |
| `disableMonths` | `number[]` | — | Month indexes that cannot be selected. |
| `disableYears` | `number[]` | — | Years that cannot be selected. |
| `hideMonths` | `boolean` | `false` | Hides month navigation / panel. |
| `hideWeekdays` | `boolean` | `false` | Hides weekday labels. |
| `hideYears` | `boolean` | `false` | Hides year navigation / panel. |
| `maxDate` | `Date` | — | Latest selectable date. |
| `minDate` | `Date` | — | Earliest selectable date. |
| `multiple` | `boolean` | `false` | Allows selecting multiple dates. |
| `range` | `boolean` | `false` | Selects a date range. |
| `showFooter` | `boolean` | `false` | Shows Cancel / Apply on the nested picker. |
| `slots` | `DateFieldSlots` | — | Named slots (`FormField` slots + calendar `day`). |
| `startOfWeek` | `StartOfWeek` | `0` | First day of the week. |
| `timeZone` | `string` | — | IANA time zone. |
| `value` | `DatePickerModel` | — | Controlled value. |

### Binding

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `DatePickerModel` | — | Controlled value. Use with `onChange`. |
| `onChange` | `(value: DatePickerModel) => void` | — | Called when the value changes. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback | Type | Description |
| -------- | ---- | ----------- |
| `onChange` | `(value: DatePickerModel) => void` | Called when the selection model changes. |
| `onClose` | `() => void` | Called when the menu closes. |
| `onOpen` | `() => void` | Called when the menu opens. |

## Related components

DatePicker, FormField, DateRangeField
