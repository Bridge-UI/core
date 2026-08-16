# DateTimeRangeField

Form field that opens a `DateTimeRangePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

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

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

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

| Prop              | Type                            | Default                                      | Description                                                                       |
| ----------------- | ------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| `ampm`            | `boolean`                       | `false`                                      | Uses a 12-hour clock with an AM/PM column.                                        |
| `classes`         | `DateTimeRangeFieldClasses`     | —                                            | Classes for field / input regions.                                                |
| `clearable`       | `boolean`                       | `true`                                       | Whether the value can be cleared.                                                 |
| `customProps`     | `DateTimeRangeFieldCustomProps` | —                                            | Extra props for internal parts.                                                   |
| `defaultValue`    | `DateRangeValue \| null`        | `null`                                       | Uncontrolled initial value.                                                       |
| `disableDates`    | `Date[]`                        | —                                            | Dates that cannot be selected.                                                    |
| `disableMonths`   | `number[]`                      | —                                            | Month indexes that cannot be selected.                                            |
| `disableTimes`    | `Date[]`                        | —                                            | Times that cannot be selected.                                                    |
| `disableYears`    | `number[]`                      | —                                            | Years that cannot be selected.                                                    |
| `hideMonths`      | `boolean`                       | `false`                                      | Hides month navigation / panel.                                                   |
| `hideOutsideDays` | `boolean`                       | `false`                                      | Hides days that fall outside the displayed month.                                 |
| `hideWeekdays`    | `boolean`                       | `false`                                      | Hides weekday labels.                                                             |
| `hideYears`       | `boolean`                       | `false`                                      | Hides year navigation / panel.                                                    |
| `interval`        | `number`                        | `1`                                          | Minute step between time options.                                                 |
| `maxDate`         | `Date`                          | —                                            | Latest selectable date.                                                           |
| `maxTime`         | `Date`                          | —                                            | Latest selectable time.                                                           |
| `minDate`         | `Date`                          | —                                            | Earliest selectable date.                                                         |
| `minTime`         | `Date`                          | —                                            | Earliest selectable time.                                                         |
| `orientation`     | `"horizontal" \| "vertical"`    | `"horizontal"`                               | Dual calendar layout. Mobile `drawer` / `modal` default to `vertical` when unset. |
| `overlay`         | `FieldOverlayMode`              | `"auto"`                                     | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                              |
| `showFooter`      | `boolean`                       | `false` (`true` for modal/drawer when unset) | Shows Cancel / Apply on the nested picker.                                        |
| `showSeconds`     | `boolean`                       | `false`                                      | Shows seconds in the panel and formatted value.                                   |
| `slots`           | `DateTimeRangeFieldSlots`       | —                                            | Named slots (`FormField` slots + calendar `day` + footer).                        |
| `startOfWeek`     | `StartOfWeek`                   | `0`                                          | First day of the week.                                                            |
| `timeZone`        | `string`                        | —                                            | IANA time zone.                                                                   |
| `value`           | `DateRangeValue \| null`        | —                                            | Controlled value.                                                                 |

### Binding

| Prop       | Type                                      | Default | Description                            |
| ---------- | ----------------------------------------- | ------- | -------------------------------------- |
| `value`    | `DateRangeValue \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: DateRangeValue \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                                      | Description                                   |
| ---------- | ----------------------------------------- | --------------------------------------------- |
| `onApply`  | `() => void`                              | Called when Apply is pressed (`showFooter`).  |
| `onCancel` | `() => void`                              | Called when Cancel is pressed (`showFooter`). |
| `onChange` | `(value: DateRangeValue \| null) => void` | Called when the range changes.                |
| `onClear`  | `() => void`                              | Called when the value is cleared.             |
| `onClose`  | `() => void`                              | Called when the menu closes.                  |
| `onOpen`   | `() => void`                              | Called when the menu opens.                   |

## Related components

DateTimeRangePicker, FormField, DateRangeField, DateTimeField
