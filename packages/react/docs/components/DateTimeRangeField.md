# DateTimeRangeField

Form field that opens a `DateTimeRangePicker` in a menu. Extends FormField props.

## Import

```ts
import { DateTimeRangeField } from "@bridge-ui/react/Components/DateTimeRangeField";
```

## Examples

### Usage

```tsx
<DateTimeRangeField label="Event" />

<DateTimeRangeField
  ampm
  label="Window"
  value={range}
  onChange={setRange}
/>
```

### customProps

```tsx
<DateTimeRangeField
  label="Event"
  customProps={{
    input: { name: "event" },
    dateTimeRangePicker: { root: { "data-testid": "dtr-picker" } },
  }}
/>
```

## Props

### DateTimeRangeField-specific

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `ampm` | `boolean` | `false` | Uses a 12-hour clock with an AM/PM column. |
| `classes` | `DateTimeRangeFieldClasses` | — | Classes for field / input regions. |
| `customProps` | `DateTimeRangeFieldCustomProps` | — | Extra props for internal parts. |
| `defaultValue` | `DateRangeValue \| null` | `null` | Uncontrolled initial value. |
| `disableDates` | `Date[]` | — | Dates that cannot be selected. |
| `disableMonths` | `number[]` | — | Month indexes that cannot be selected. |
| `disableTimes` | `Date[]` | — | Times that cannot be selected. |
| `disableYears` | `number[]` | — | Years that cannot be selected. |
| `hideMonths` | `boolean` | `false` | Hides month navigation / panel. |
| `hideWeekdays` | `boolean` | `false` | Hides weekday labels. |
| `hideYears` | `boolean` | `false` | Hides year navigation / panel. |
| `interval` | `number` | `1` | Minute step between time options. |
| `maxDate` | `Date` | — | Latest selectable date. |
| `maxTime` | `Date` | — | Latest selectable time. |
| `minDate` | `Date` | — | Earliest selectable date. |
| `minTime` | `Date` | — | Earliest selectable time. |
| `showFooter` | `boolean` | `false` | Shows Cancel / Apply on the nested picker. |
| `slots` | `DateTimeRangeFieldSlots` | — | Named slots (`FormField` slots + calendar `day`). |
| `startOfWeek` | `StartOfWeek` | `0` | First day of the week. |
| `timeZone` | `string` | — | IANA time zone. |
| `value` | `DateRangeValue \| null` | — | Controlled value. |

### Binding

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `DateRangeValue \| null` | — | Controlled value. Use with `onChange`. |
| `onChange` | `(value: DateRangeValue \| null) => void` | — | Called when the value changes. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback | Type | Description |
| -------- | ---- | ----------- |
| `onChange` | `(value: DateRangeValue \| null) => void` | Called when the range changes. |
| `onClose` | `() => void` | Called when the menu closes. |
| `onOpen` | `() => void` | Called when the menu opens. |

## Related components

DateTimeRangePicker, FormField, DateRangeField, DateTimeField
