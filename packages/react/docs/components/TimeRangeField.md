# TimeRangeField

Form field that opens a `TimeRangePicker` in a menu. Extends FormField props.

## Import

```ts
import { TimeRangeField } from "@bridge-ui/react/Components/TimeRangeField";
```

## Examples

### Usage

```tsx
<TimeRangeField label="Hours" />

<TimeRangeField
  ampm
  label="Shift"
  value={range}
  onChange={setRange}
/>
```

### customProps

```tsx
<TimeRangeField
  label="Hours"
  customProps={{
    input: { name: "hours" },
    timeRangePicker: { root: { "data-testid": "tr-picker" } },
  }}
/>
```

## Props

### TimeRangeField-specific

| Prop           | Type                        | Default | Description                                |
| -------------- | --------------------------- | ------- | ------------------------------------------ |
| `ampm`         | `boolean`                   | `false` | Uses a 12-hour clock with an AM/PM column. |
| `classes`      | `TimeRangeFieldClasses`     | —       | Classes for field / input regions.         |
| `customProps`  | `TimeRangeFieldCustomProps` | —       | Extra props for internal parts.            |
| `defaultValue` | `TimeRangeValue \| null`    | `null`  | Uncontrolled initial value.                |
| `disableTimes` | `Date[]`                    | —       | Times that cannot be selected.             |
| `interval`     | `number`                    | `1`     | Minute step between options.               |
| `maxTime`      | `Date`                      | —       | Latest selectable time.                    |
| `minTime`      | `Date`                      | —       | Earliest selectable time.                  |
| `showFooter`   | `boolean`                   | `false` | Shows Cancel / Apply on the nested picker. |
| `slots`        | `TimeRangeFieldSlots`       | —       | Named slots (`FormField` slots).           |
| `timeZone`     | `string`                    | —       | IANA time zone.                            |
| `value`        | `TimeRangeValue \| null`    | —       | Controlled value.                          |

### Binding

| Prop       | Type                                      | Default | Description                            |
| ---------- | ----------------------------------------- | ------- | -------------------------------------- |
| `value`    | `TimeRangeValue \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: TimeRangeValue \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                                      | Description                    |
| ---------- | ----------------------------------------- | ------------------------------ |
| `onChange` | `(value: TimeRangeValue \| null) => void` | Called when the range changes. |
| `onClose`  | `() => void`                              | Called when the menu closes.   |
| `onOpen`   | `() => void`                              | Called when the menu opens.    |

## Related components

TimeRangePicker, FormField, TimeField
