# TimeField

Form field that opens a `TimePicker` in an overlay (`Menu` by default). Extends FormField props. Uses the semantic `clock` icon by default.

## Import

```ts
import { TimeField } from "@bridge-ui/react/Components/TimeField";
```

## Examples

### Usage

```tsx
<TimeField label="Start time" />

<TimeField
  ampm
  label="Meeting"
  value={time}
  interval={5}
  onChange={setTime}
/>

<TimeField
  error
  label="Time"
  errorMessage="Pick a valid time."
/>
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

### customProps

```tsx
<TimeField
  label="Time"
  customProps={{
    input: { name: "time" },
    timePicker: { root: { "data-testid": "time-picker" } },
  }}
/>
```

## Props

### TimeField-specific

| Prop           | Type                   | Default  | Description                                          |
| -------------- | ---------------------- | -------- | ---------------------------------------------------- |
| `ampm`         | `boolean`              | `false`  | Uses a 12-hour clock with an AM/PM column.           |
| `classes`      | `TimeFieldClasses`     | —        | Classes for field / input regions.                   |
| `customProps`  | `TimeFieldCustomProps` | —        | Extra props for internal parts.                      |
| `defaultValue` | `Date \| null`         | `null`   | Uncontrolled initial value.                          |
| `disableTimes` | `Date[]`               | —        | Times that cannot be selected.                       |
| `interval`     | `number`               | `1`      | Minute step between options.                         |
| `maxTime`      | `Date`                 | —        | Latest selectable time.                              |
| `minTime`      | `Date`                 | —        | Earliest selectable time.                            |
| `overlay`      | `FieldOverlayMode`     | `"menu"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`. |
| `showFooter`   | `boolean`              | `false`  | Shows Cancel / Apply on the nested picker.           |
| `slots`        | `TimeFieldSlots`       | —        | Named slots (`FormField` slots).                     |
| `timeZone`     | `string`               | —        | IANA time zone.                                      |
| `value`        | `Date \| null`         | —        | Controlled value.                                    |

### Binding

| Prop       | Type                            | Default | Description                            |
| ---------- | ------------------------------- | ------- | -------------------------------------- |
| `value`    | `Date \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: Date \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                            | Description                   |
| ---------- | ------------------------------- | ----------------------------- |
| `onChange` | `(value: Date \| null) => void` | Called when the time changes. |
| `onClose`  | `() => void`                    | Called when the menu closes.  |
| `onOpen`   | `() => void`                    | Called when the menu opens.   |

## Related components

TimePicker, FormField, DateTimeField
