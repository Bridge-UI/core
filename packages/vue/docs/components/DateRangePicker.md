# DateRangePicker

Inline dual-month picker for an inclusive date range (`[start, end]`). Year sits
on the left and nav on the right; month selectors sit inward from the header
midpoint.

## Import

```ts
import { DateRangePicker } from "@bridge-ui/vue/Components/DateRangePicker";
```

## Examples

### Usage

```vue
<DateRangePicker />

<DateRangePicker v-model="range" />

<DateRangePicker orientation="vertical" />

<DateRangePicker show-footer v-model="range" v-on:cancel="() => {}" />
```

## Props

| Prop              | Type                         | Default        | Description                                                        |
| ----------------- | ---------------------------- | -------------- | ------------------------------------------------------------------ |
| `classes`         | `DateRangePickerClasses`     | —              | Classes for picker regions.                                        |
| `color`           | `CalendarColor`              | `"primary"`    | Accent color.                                                      |
| `customProps`     | `DateRangePickerCustomProps` | —              | Extra props for internal parts.                                    |
| `defaultValue`    | `DateRangeValue \| null`     | `null`         | Uncontrolled initial value.                                        |
| `disabled`        | `boolean`                    | `false`        | Disables the picker.                                               |
| `disableDates`    | `Date[]`                     | —              | Dates that cannot be selected.                                     |
| `disableMonths`   | `number[]`                   | —              | Month indexes that cannot be selected.                             |
| `disableYears`    | `number[]`                   | —              | Years that cannot be selected.                                     |
| `error`           | `boolean`                    | `false`        | Applies the error color palette to tiles.                          |
| `fill`            | `boolean`                    | `false`        | Fills the container width.                                         |
| `hideMonths`      | `boolean`                    | `false`        | Hides month navigation / panel.                                    |
| `hideOutsideDays` | `boolean`                    | `false`        | Hides days that fall outside the displayed month.                  |
| `hideWeekdays`    | `boolean`                    | `false`        | Hides weekday labels.                                              |
| `hideYears`       | `boolean`                    | `false`        | Hides year navigation / panel.                                     |
| `maxDate`         | `Date`                       | —              | Latest selectable date.                                            |
| `minDate`         | `Date`                       | —              | Earliest selectable date.                                          |
| `orientation`     | `"horizontal" \| "vertical"` | `"horizontal"` | Dual calendar layout: side-by-side or stacked.                     |
| `readOnly`        | `boolean`                    | `false`        | Prevents selection.                                                |
| `rounded`         | `CalendarRounded`            | `"md"`         | Border radius of calendar tiles and chrome.                        |
| `showFooter`      | `boolean`                    | `false`        | Shows Cancel / Apply. Selection is draft until Apply.              |
| `slots`           | `DateRangePickerSlots`       | —              | Named slots (`day` on the calendars, `footer` for Cancel / Apply). |
| `startOfWeek`     | `StartOfWeek`                | `0`            | First day of the week.                                             |
| `timeZone`        | `string`                     | —              | IANA time zone.                                                    |
| `value`           | `DateRangeValue \| null`     | —              | Controlled value (`[start, end]`).                                 |

### v-model

| Prop / Event        | Type                                      | Default | Description                           |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DateRangeValue \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DateRangeValue \| null) => void` | —       | Emitted when `v-model` should update. |

Calendar tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Event         | Payload                           | Description                                                             |
| ------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `v-on:apply`  | `()`                              | Emitted when Apply is pressed (`showFooter`).                           |
| `v-on:cancel` | `()`                              | Emitted when Cancel is pressed.                                         |
| `v-on:change` | `(value: DateRangeValue \| null)` | Emitted when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

CalendarRange, DateRangeField, DatePicker
