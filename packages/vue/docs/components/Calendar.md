# Calendar

Standalone calendar with date, month, and year panels. Supports single, multiple, and range selection.

## Import

```ts
import { Calendar } from "@bridge-ui/vue/Components/Calendar";
```

## Examples

### Usage

```vue
<Calendar />

<Calendar v-model="date" />

<Calendar range v-model="range" :min-date="min" :max-date="max" />

<Calendar multiple v-model="dates" />
```

### Bounds and disabled dates

```vue
<Calendar
  :min-date="new Date(2024, 0, 1)"
  :max-date="new Date(2026, 11, 31)"
  :disable-dates="[new Date(2026, 7, 15)]"
/>
```

### customProps

```vue
<Calendar
  :custom-props="{
    root: { 'data-testid': 'calendar' },
    todayButton: { type: 'button' },
  }"
/>
```

## Props

| Prop              | Type                  | Default     | Description                                               |
| ----------------- | --------------------- | ----------- | --------------------------------------------------------- |
| `classes`         | `CalendarClasses`     | —           | Classes for calendar regions.                             |
| `color`           | `CalendarColor`       | `"primary"` | Accent color for tiles.                                   |
| `customProps`     | `CalendarCustomProps` | —           | Extra props for internal parts.                           |
| `defaultValue`    | `DatePickerModel`     | `null`      | Uncontrolled initial value.                               |
| `defaultView`     | `CalendarView`        | `"date"`    | Uncontrolled initial panel view.                          |
| `disabled`        | `boolean`             | `false`     | Disables the calendar.                                    |
| `disableDates`    | `Date[]`              | —           | Dates that cannot be selected.                            |
| `disableMonths`   | `number[]`            | —           | Month indexes (`0`–`11`) that cannot be selected.         |
| `disableYears`    | `number[]`            | —           | Years that cannot be selected.                            |
| `error`           | `boolean`             | `false`     | Applies the error color palette to tiles.                 |
| `hideMonths`      | `boolean`             | `false`     | Hides the month selector and month panel.                 |
| `hideOutsideDays` | `boolean`             | `false`     | Hides days that fall outside the displayed month.         |
| `hideWeekdays`    | `boolean`             | `false`     | Hides weekday labels on the date panel.                   |
| `hideYears`       | `boolean`             | `false`     | Hides the year selector and year panel.                   |
| `maxDate`         | `Date`                | —           | Latest selectable date.                                   |
| `minDate`         | `Date`                | —           | Earliest selectable date.                                 |
| `multiple`        | `boolean`             | `false`     | Allows selecting multiple dates.                          |
| `previewDate`     | `Date \| null`        | —           | Controlled range-preview hover date.                      |
| `range`           | `boolean`             | `false`     | Selects a start/end date range.                           |
| `readOnly`        | `boolean`             | `false`     | Prevents selection.                                       |
| `rounded`         | `CalendarRounded`     | `"md"`      | Border radius of tiles and chrome.                        |
| `slots`           | `CalendarDateSlots`   | —           | Named slots forwarded to `CalendarDate` (`day`).          |
| `startOfWeek`     | `StartOfWeek`         | `0`         | First day of the week (`0` = Sunday).                     |
| `timeZone`        | `string`              | —           | IANA time zone.                                           |
| `tokens`          | `CalendarTokens`      | —           | Token overrides.                                          |
| `value`           | `DatePickerModel`     | —           | Controlled selection model.                               |
| `view`            | `CalendarView`        | —           | Controlled panel view. Pair with `view-change`.           |
| `viewDate`        | `Date`                | —           | Controlled displayed month. Pair with `view-date-change`. |

### v-model

| Prop / Event        | Type                               | Default | Description                           |
| ------------------- | ---------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DatePickerModel`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DatePickerModel) => void` | —       | Emitted when `v-model` should update. |

## Events

| Event                      | Payload                    | Description                                        |
| -------------------------- | -------------------------- | -------------------------------------------------- |
| `v-on:change`              | `(value: DatePickerModel)` | Emitted when the selection model changes.          |
| `v-on:preview-date-change` | `(date: Date \| null)`     | Emitted when the range preview hover date changes. |
| `v-on:view-change`         | `(view: CalendarView)`     | Emitted when the active panel view changes.        |
| `v-on:view-date-change`    | `(date: Date)`             | Emitted when the displayed month changes.          |

## Related components

CalendarDate, CalendarMonth, CalendarYear, CalendarRange, DatePicker, DateField
