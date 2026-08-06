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

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `ampm` | `boolean` | `false` | Uses a 12-hour clock with an AM/PM column. |
| `classes` | `TimeRangePickerClasses` | — | Classes for picker regions. |
| `color` | `CalendarColor` | `"primary"` | Accent color. |
| `customProps` | `TimeRangePickerCustomProps` | — | Extra props for internal parts. |
| `defaultValue` | `TimeRangeValue \| null` | `null` | Uncontrolled initial value. |
| `disabled` | `boolean` | `false` | Disables the picker. |
| `disableTimes` | `Date[]` | — | Times that cannot be selected. |
| `interval` | `number` | `1` | Minute step between options. |
| `maxTime` | `Date` | — | Latest selectable time. |
| `minTime` | `Date` | — | Earliest selectable time. |
| `readOnly` | `boolean` | `false` | Prevents selection. |
| `rounded` | `CalendarRounded` | `"md"` | Border radius of time tiles and chrome. |
| `showFooter` | `boolean` | `false` | Shows Cancel / Apply. Selection is draft until Apply. |
| `timeZone` | `string` | — | IANA time zone. |
| `tokens` | `TimeRangePickerTokens` | — | Token overrides. |
| `value` | `TimeRangeValue \| null` | — | Controlled value (`[start, end]`). |

## Events

| Callback | Type | Description |
| -------- | ---- | ----------- |
| `onCancel` | `() => void` | Called when Cancel is pressed. |
| `onChange` | `(value: TimeRangeValue \| null) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

TimePanel, TimeRangeField, TimePicker
