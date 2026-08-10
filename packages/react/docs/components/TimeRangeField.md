# TimeRangeField

Form field that opens a `TimeRangePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

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

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

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

| Prop           | Type                        | Default                               | Description                                          |
| -------------- | --------------------------- | ------------------------------------- | ---------------------------------------------------- |
| `ampm`         | `boolean`                   | `false`                               | Uses a 12-hour clock with an AM/PM column.           |
| `classes`      | `TimeRangeFieldClasses`     | —                                     | Classes for field / input regions.                   |
| `clearable`    | `boolean`                   | `true`                                | Whether the value can be cleared.                    |
| `customProps`  | `TimeRangeFieldCustomProps` | —                                     | Extra props for internal parts.                      |
| `defaultValue` | `TimeRangeValue \| null`    | `null`                                | Uncontrolled initial value.                          |
| `disableTimes` | `Date[]`                    | —                                     | Times that cannot be selected.                       |
| `interval`     | `number`                    | `1`                                   | Minute step between options.                         |
| `maxTime`      | `Date`                      | —                                     | Latest selectable time.                              |
| `minTime`      | `Date`                      | —                                     | Earliest selectable time.                            |
| `overlay`      | `FieldOverlayMode`          | `"auto"`                              | Overlay shell: `menu`, `modal`, `drawer`, or `auto`. |
| `showFooter`   | `boolean`                   | `false` (`true` on mobile when unset) | Shows Cancel / Apply on the nested picker.           |
| `showSeconds`  | `boolean`                   | `false`                               | Shows seconds in the panel and formatted value.      |
| `slots`        | `TimeRangeFieldSlots`       | —                                     | Named slots (`FormField` slots).                     |
| `timeZone`     | `string`                    | —                                     | IANA time zone.                                      |
| `value`        | `TimeRangeValue \| null`    | —                                     | Controlled value.                                    |

### Binding

| Prop       | Type                                      | Default | Description                            |
| ---------- | ----------------------------------------- | ------- | -------------------------------------- |
| `value`    | `TimeRangeValue \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: TimeRangeValue \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                                      | Description                       |
| ---------- | ----------------------------------------- | --------------------------------- |
| `onChange` | `(value: TimeRangeValue \| null) => void` | Called when the range changes.    |
| `onClear`  | `() => void`                              | Called when the value is cleared. |
| `onClose`  | `() => void`                              | Called when the menu closes.      |
| `onOpen`   | `() => void`                              | Called when the menu opens.       |

## Related components

TimeRangePicker, FormField, TimeField
