# CalendarDate

Date-grid panel (weekdays + day tiles). Building block used by `Calendar` and `CalendarRange`.

## Import

```ts
import { CalendarDate } from "@bridge-ui/vue/Components/CalendarDate";
```

## Examples

### Usage

```vue
<CalendarDate v-model="date" />

<CalendarDate
  range
  v-model="range"
  :view-date="month"
  @view-date-change="month = $event"
/>
```

## Props

| Prop            | Type                      | Default     | Description                                     |
| --------------- | ------------------------- | ----------- | ----------------------------------------------- |
| `classes`       | `CalendarDateClasses`     | —           | Classes for calendar regions.                   |
| `color`         | `CalendarColor`           | `"primary"` | Accent color for day tiles.                     |
| `customProps`   | `CalendarDateCustomProps` | —           | Extra props for internal parts.                 |
| `defaultValue`  | `DatePickerModel`         | `null`      | Uncontrolled initial value.                     |
| `disabled`      | `boolean`                 | `false`     | Disables the entire calendar.                   |
| `disableDates`  | `Date[]`                  | —           | Dates that cannot be selected.                  |
| `disableMonths` | `number[]`                | —           | Month indexes that cannot be selected.          |
| `disableYears`  | `number[]`                | —           | Years that cannot be selected.                  |
| `hideWeekdays`  | `boolean`                 | `false`     | Hides the weekday header row.                   |
| `maxDate`       | `Date`                    | —           | Latest selectable date.                         |
| `minDate`       | `Date`                    | —           | Earliest selectable date.                       |
| `multiple`      | `boolean`                 | `false`     | Allows selecting multiple dates.                |
| `previewDate`   | `Date \| null`            | —           | Hovered date used for incomplete-range preview. |
| `range`         | `boolean`                 | `false`     | Selects a start/end range.                      |
| `readOnly`      | `boolean`                 | `false`     | Prevents selection.                             |
| `rounded`       | `CalendarRounded`         | `"md"`      | Border radius of day tiles.                     |
| `slots`         | `{ day?: … }`             | —           | Named slots (`day`).                            |
| `startOfWeek`   | `StartOfWeek`             | `0`         | First day of the week.                          |
| `timeZone`      | `string`                  | —           | IANA time zone.                                 |
| `tokens`        | `CalendarDateTokens`      | —           | Token overrides.                                |
| `value`         | `DatePickerModel`         | —           | Controlled selection model.                     |
| `viewDate`      | `Date`                    | —           | Month currently displayed in the grid.          |

### v-model

| Prop / Event        | Type                               | Default | Description                           |
| ------------------- | ---------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DatePickerModel`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DatePickerModel) => void` | —       | Emitted when `v-model` should update. |

## Events

| Event                      | Payload                    | Description                                        |
| -------------------------- | -------------------------- | -------------------------------------------------- |
| `v-on:change`              | `(value: DatePickerModel)` | Emitted when the selection model changes.          |
| `v-on:preview-date-change` | `(date: Date \| null)`     | Emitted when the range-preview hover date changes. |
| `v-on:view-date-change`    | `(date: Date)`             | Emitted when the displayed month should change.    |

## Related components

Calendar, CalendarMonth, CalendarYear, CalendarRange
