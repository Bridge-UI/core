# DateTimePicker

Inline picker combining a `Calendar` and `TimePanel` side by side into a single
`Date` instant.

## Import

```ts
import { DateTimePicker } from "@bridge-ui/vue/Components/DateTimePicker";
```

## Examples

### Usage

```vue
<DateTimePicker />

<DateTimePicker v-model="when" />

<DateTimePicker ampm show-footer v-model="when" :interval="15" />
```

## Props

| Prop              | Type                        | Default     | Description                                                       |
| ----------------- | --------------------------- | ----------- | ----------------------------------------------------------------- |
| `ampm`            | `boolean`                   | `false`     | Uses a 12-hour clock with an AM/PM column.                        |
| `classes`         | `DateTimePickerClasses`     | —           | Classes for picker regions.                                       |
| `color`           | `CalendarColor`             | `"primary"` | Accent color.                                                     |
| `customProps`     | `DateTimePickerCustomProps` | —           | Extra props for internal parts.                                   |
| `defaultValue`    | `Date \| null`              | `null`      | Uncontrolled initial value.                                       |
| `defaultView`     | `CalendarView`              | `"date"`    | Initial calendar panel view.                                      |
| `disabled`        | `boolean`                   | `false`     | Disables the picker.                                              |
| `disableDates`    | `Date[]`                    | —           | Dates that cannot be selected.                                    |
| `disableMonths`   | `number[]`                  | —           | Month indexes that cannot be selected.                            |
| `disableTimes`    | `Date[]`                    | —           | Times that cannot be selected.                                    |
| `disableYears`    | `number[]`                  | —           | Years that cannot be selected.                                    |
| `error`           | `boolean`                   | `false`     | Applies the error color palette to tiles.                         |
| `fill`            | `boolean`                   | `false`     | Fills the container width.                                        |
| `hideMonths`      | `boolean`                   | `false`     | Hides month navigation / panel.                                   |
| `hideOutsideDays` | `boolean`                   | `false`     | Hides days that fall outside the displayed month.                 |
| `hideWeekdays`    | `boolean`                   | `false`     | Hides weekday labels.                                             |
| `hideYears`       | `boolean`                   | `false`     | Hides year navigation / panel.                                    |
| `interval`        | `number`                    | `1`         | Minute step between time options.                                 |
| `maxDate`         | `Date`                      | —           | Latest selectable date.                                           |
| `maxTime`         | `Date`                      | —           | Latest selectable time.                                           |
| `minDate`         | `Date`                      | —           | Earliest selectable date.                                         |
| `minTime`         | `Date`                      | —           | Earliest selectable time.                                         |
| `readOnly`        | `boolean`                   | `false`     | Prevents selection.                                               |
| `rounded`         | `CalendarRounded`           | `"md"`      | Border radius of calendar / time tiles and chrome.                |
| `showFooter`      | `boolean`                   | `false`     | Shows Cancel / Apply. Selection is draft until Apply.             |
| `showSeconds`     | `boolean`                   | `false`     | Shows seconds in the panel and formatted value.                   |
| `slots`           | `DateTimePickerSlots`       | —           | Named slots (`day` on the calendar, `footer` for Cancel / Apply). |
| `startOfWeek`     | `StartOfWeek`               | `0`         | First day of the week.                                            |
| `timeZone`        | `string`                    | —           | IANA time zone.                                                   |
| `tokens`          | `DateTimePickerTokens`      | —           | Token overrides.                                                  |
| `value`           | `Date \| null`              | —           | Controlled date-time value.                                       |

### v-model

| Prop / Event        | Type                            | Default | Description                           |
| ------------------- | ------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `Date \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: Date \| null) => void` | —       | Emitted when `v-model` should update. |

## Events

| Event         | Payload                 | Description                                                             |
| ------------- | ----------------------- | ----------------------------------------------------------------------- |
| `v-on:apply`  | `()`                    | Emitted when Apply is pressed (`showFooter`).                           |
| `v-on:cancel` | `()`                    | Emitted when Cancel is pressed.                                         |
| `v-on:change` | `(value: Date \| null)` | Emitted when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

Calendar, TimePanel, DateTimeField, DatePicker
