# TimePanel

Scrollable hour / minute (/ AM·PM) columns for selecting a wall-clock time. Building block for time pickers.

## Import

```ts
import { TimePanel } from "@bridge-ui/react/Components/TimePanel";
```

## Examples

### Usage

```tsx
<TimePanel value={time} onChange={setTime} />

<TimePanel
  ampm
  interval={5}
  value={time}
  onChange={setTime}
/>
```

## Props

| Prop           | Type                   | Default     | Description                                     |
| -------------- | ---------------------- | ----------- | ----------------------------------------------- |
| `ampm`         | `boolean`              | `false`     | Uses a 12-hour clock with an AM/PM column.      |
| `classes`      | `TimePanelClasses`     | —           | Classes for panel regions.                      |
| `color`        | `CalendarColor`        | `"primary"` | Accent color for time tiles.                    |
| `customProps`  | `TimePanelCustomProps` | —           | Extra props for internal parts.                 |
| `disabled`     | `boolean`              | `false`     | Disables the entire panel.                      |
| `disableTimes` | `Date[]`               | —           | Times that cannot be selected.                  |
| `error`        | `boolean`              | `false`     | Applies the error color palette to tiles.       |
| `interval`     | `number`               | `1`         | Minute step between options.                    |
| `maxTime`      | `Date`                 | —           | Latest selectable time.                         |
| `minTime`      | `Date`                 | —           | Earliest selectable time.                       |
| `readOnly`     | `boolean`              | `false`     | Prevents selection.                             |
| `rounded`      | `CalendarRounded`      | `"md"`      | Border radius of time tiles.                    |
| `showSeconds`  | `boolean`              | `false`     | Shows seconds in the panel and formatted value. |
| `timeZone`     | `string`               | —           | IANA time zone.                                 |
| `tokens`       | `TimePanelTokens`      | —           | Token overrides.                                |
| `value`        | `Date \| null`         | —           | Selected time (`Date` wall clock).              |

## Events

| Callback   | Type                            | Description                   |
| ---------- | ------------------------------- | ----------------------------- |
| `onChange` | `(value: Date \| null) => void` | Called when the time changes. |

## Related components

TimePicker, TimeField, DateTimePicker
