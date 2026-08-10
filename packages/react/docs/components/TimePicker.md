# TimePicker

Inline time picker built on `TimePanel`. Value is a `Date` carrying wall-clock hours/minutes.

## Import

```ts
import { TimePicker } from "@bridge-ui/react/Components/TimePicker";
```

## Examples

### Usage

```tsx
<TimePicker />

<TimePicker value={time} onChange={setTime} />

<TimePicker
  ampm
  interval={15}
  value={time}
  showFooter
  onChange={setTime}
/>
```

## Props

| Prop           | Type                    | Default     | Description                                           |
| -------------- | ----------------------- | ----------- | ----------------------------------------------------- |
| `ampm`         | `boolean`               | `false`     | Uses a 12-hour clock with an AM/PM column.            |
| `classes`      | `TimePickerClasses`     | —           | Classes for picker regions.                           |
| `color`        | `CalendarColor`         | `"primary"` | Accent color.                                         |
| `customProps`  | `TimePickerCustomProps` | —           | Extra props for internal parts.                       |
| `defaultValue` | `Date \| null`          | `null`      | Uncontrolled initial value.                           |
| `disabled`     | `boolean`               | `false`     | Disables the picker.                                  |
| `disableTimes` | `Date[]`                | —           | Times that cannot be selected.                        |
| `interval`     | `number`                | `1`         | Minute step between options.                          |
| `maxTime`      | `Date`                  | —           | Latest selectable time.                               |
| `minTime`      | `Date`                  | —           | Earliest selectable time.                             |
| `readOnly`     | `boolean`               | `false`     | Prevents selection.                                   |
| `rounded`      | `CalendarRounded`       | `"md"`      | Border radius of time tiles and chrome.               |
| `showFooter`   | `boolean`               | `false`     | Shows Cancel / Apply. Selection is draft until Apply. |
| `showSeconds`  | `boolean`               | `false`     | Shows seconds in the panel and formatted value.       |
| `timeZone`     | `string`                | —           | IANA time zone.                                       |
| `tokens`       | `TimePickerTokens`      | —           | Token overrides.                                      |
| `value`        | `Date \| null`          | —           | Controlled value.                                     |

## Events

| Callback   | Type                            | Description                                                            |
| ---------- | ------------------------------- | ---------------------------------------------------------------------- |
| `onCancel` | `() => void`                    | Called when Cancel is pressed.                                         |
| `onChange` | `(value: Date \| null) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

TimePanel, TimeField, DateTimePicker
