# TimeRangePicker

Inline dual `TimePanel` picker for a time range (`[start, end]`).

## Import

```ts
import { TimeRangePicker } from "@bridge-ui/vue/Components/TimeRangePicker";
```

## Examples

### Usage

```vue
<TimeRangePicker />

<TimeRangePicker v-model="range" />

<TimeRangePicker ampm :interval="15" v-model="range" />
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
| `interval`     | `number`                     | `1`            | Minute step between options.                          |
| `maxTime`      | `Date`                       | —              | Latest selectable time.                               |
| `minTime`      | `Date`                       | —              | Earliest selectable time.                             |
| `orientation`  | `"horizontal" \| "vertical"` | `"horizontal"` | Layout of start / end time panels.                    |
| `readOnly`     | `boolean`                    | `false`        | Prevents selection.                                   |
| `rounded`      | `CalendarRounded`            | `"md"`         | Border radius of time tiles and chrome.               |
| `showFooter`   | `boolean`                    | `false`        | Shows Cancel / Apply. Selection is draft until Apply. |
| `startTitle`   | `string`                     | `"Start time"` | Label above the start time panel.                     |
| `timeZone`     | `string`                     | —              | IANA time zone.                                       |
| `tokens`       | `TimeRangePickerTokens`      | —              | Token overrides.                                      |
| `value`        | `TimeRangeValue \| null`     | —              | Controlled value (`[start, end]`).                    |

### v-model

| Prop / Event        | Type                                      | Default | Description                           |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `TimeRangeValue \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: TimeRangeValue \| null) => void` | —       | Emitted when `v-model` should update. |

## Events

| Event         | Payload                           | Description                                                             |
| ------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `v-on:cancel` | `()`                              | Emitted when Cancel is pressed.                                         |
| `v-on:change` | `(value: TimeRangeValue \| null)` | Emitted when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

TimePanel, TimeRangeField, TimePicker
