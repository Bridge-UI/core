# TimeRangePicker

Inline dual `TimePanel` picker for a time range (`[start, end]`).

## Import

```ts
import { TimeRangePicker } from "@bridge-ui/react/Components/TimeRangePicker";
```

## Examples

### Usage

```tsx
<TimeRangePicker />

<TimeRangePicker value={range} onChange={setRange} />

<TimeRangePicker
  ampm
  interval={15}
  value={range}
  onChange={setRange}
/>
```

## Props

| Prop           | Type                         | Default        | Description                                           |
| -------------- | ---------------------------- | -------------- | ----------------------------------------------------- |
| `ampm`         | `boolean`                    | `false`        | Uses a 12-hour clock with an AM/PM column.            |
| `classes`      | `TimeRangePickerClasses`     | —              | Classes for picker regions.                           |
| `color`        | `CalendarColor`              | `"primary"`    | Accent color.                                         |
| `customProps`  | `TimeRangePickerCustomProps` | —              | Extra props for internal parts.                       |
| `defaultValue` | `TimeRangeValue \| null`     | `null`         | Uncontrolled initial value.                           |
| `disabled`     | `boolean`                    | `false`        | Disables the picker.                                  |
| `disableTimes` | `Date[]`                     | —              | Times that cannot be selected.                        |
| `endTitle`     | `string`                     | `"End time"`   | Label above the end time panel.                       |
| `error`        | `boolean`                    | `false`        | Applies the error color palette to tiles.             |
| `fill`         | `boolean`                    | `false`        | Fills the container width.                            |
| `interval`     | `number`                     | `1`            | Minute step between options.                          |
| `maxTime`      | `Date`                       | —              | Latest selectable time.                               |
| `minTime`      | `Date`                       | —              | Earliest selectable time.                             |
| `readOnly`     | `boolean`                    | `false`        | Prevents selection.                                   |
| `rounded`      | `CalendarRounded`            | `"md"`         | Border radius of time tiles and chrome.               |
| `showFooter`   | `boolean`                    | `false`        | Shows Cancel / Apply. Selection is draft until Apply. |
| `showSeconds`  | `boolean`                    | `false`        | Shows seconds in the panel and formatted value.       |
| `slots`        | `TimeRangePickerSlots`       | —              | Named slots (`footer` for Cancel / Apply).            |
| `startTitle`   | `string`                     | `"Start time"` | Label above the start time panel.                     |
| `timeZone`     | `string`                     | —              | IANA time zone.                                       |
| `value`        | `TimeRangeValue \| null`     | —              | Controlled value (`[start, end]`).                    |

Time panel tokens live on `components.TimePanel` (`color`, `rounded`).

## Events

| Callback   | Type                                      | Description                                                            |
| ---------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `onApply`  | `() => void`                              | Called when Apply is pressed (`showFooter`).                           |
| `onCancel` | `() => void`                              | Called when Cancel is pressed.                                         |
| `onChange` | `(value: TimeRangeValue \| null) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

TimePanel, TimeRangeField, TimePicker
