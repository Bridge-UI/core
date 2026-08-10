# DateTimeField

Form field that opens a `DateTimePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

## Import

```ts
import { DateTimeField } from "@bridge-ui/react/Components/DateTimeField";
```

## Examples

### Usage

```tsx
<DateTimeField label="Appointment" />

<DateTimeField
  ampm
  label="Start"
  value={when}
  onChange={setWhen}
/>

<DateTimeField
  error
  label="When"
  errorMessage="Pick a date and time."
/>
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

### customProps

```tsx
<DateTimeField
  label="When"
  customProps={{
    input: { name: "when" },
    dateTimePicker: { root: { "data-testid": "dt-picker" } },
  }}
/>
```

## Props

### DateTimeField-specific

| Prop              | Type                       | Default                               | Description                                          |
| ----------------- | -------------------------- | ------------------------------------- | ---------------------------------------------------- |
| `ampm`            | `boolean`                  | `false`                               | Uses a 12-hour clock with an AM/PM column.           |
| `classes`         | `DateTimeFieldClasses`     | —                                     | Classes for field / input regions.                   |
| `clearable`       | `boolean`                  | `true`                                | Whether the value can be cleared.                    |
| `customProps`     | `DateTimeFieldCustomProps` | —                                     | Extra props for internal parts.                      |
| `defaultValue`    | `Date \| null`             | `null`                                | Uncontrolled initial value.                          |
| `defaultView`     | `CalendarView`             | `"date"`                              | Initial calendar panel view.                         |
| `disableDates`    | `Date[]`                   | —                                     | Dates that cannot be selected.                       |
| `disableMonths`   | `number[]`                 | —                                     | Month indexes that cannot be selected.               |
| `disableTimes`    | `Date[]`                   | —                                     | Times that cannot be selected.                       |
| `disableYears`    | `number[]`                 | —                                     | Years that cannot be selected.                       |
| `hideMonths`      | `boolean`                  | `false`                               | Hides month navigation / panel.                      |
| `hideOutsideDays` | `boolean`                  | `false`                               | Hides days that fall outside the displayed month.    |
| `hideWeekdays`    | `boolean`                  | `false`                               | Hides weekday labels.                                |
| `hideYears`       | `boolean`                  | `false`                               | Hides year navigation / panel.                       |
| `interval`        | `number`                   | `1`                                   | Minute step between time options.                    |
| `maxDate`         | `Date`                     | —                                     | Latest selectable date.                              |
| `maxTime`         | `Date`                     | —                                     | Latest selectable time.                              |
| `minDate`         | `Date`                     | —                                     | Earliest selectable date.                            |
| `minTime`         | `Date`                     | —                                     | Earliest selectable time.                            |
| `overlay`         | `FieldOverlayMode`         | `"auto"`                              | Overlay shell: `menu`, `modal`, `drawer`, or `auto`. |
| `showFooter`      | `boolean`                  | `false` (`true` on mobile when unset) | Shows Cancel / Apply on the nested picker.           |
| `slots`           | `DateTimeFieldSlots`       | —                                     | Named slots (`FormField` slots + calendar `day`).    |
| `startOfWeek`     | `StartOfWeek`              | `0`                                   | First day of the week.                               |
| `timeZone`        | `string`                   | —                                     | IANA time zone.                                      |
| `value`           | `Date \| null`             | —                                     | Controlled value.                                    |

### Binding

| Prop       | Type                            | Default | Description                            |
| ---------- | ------------------------------- | ------- | -------------------------------------- |
| `value`    | `Date \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: Date \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                            | Description                       |
| ---------- | ------------------------------- | --------------------------------- |
| `onChange` | `(value: Date \| null) => void` | Called when the value changes.    |
| `onClear`  | `() => void`                    | Called when the value is cleared. |
| `onClose`  | `() => void`                    | Called when the menu closes.      |
| `onOpen`   | `() => void`                    | Called when the menu opens.       |

## Related components

DateTimePicker, FormField, DateField, TimeField
