# CalendarRange

Dual-month calendar for selecting a date range. Shared year/month selectors with
two date panels (`orientation="horizontal"` side-by-side, or `"vertical"` stacked).

## Import

```ts
import { CalendarRange } from "@bridge-ui/vue/Components/CalendarRange";
```

## Examples

### Usage

```vue
<CalendarRange />

<CalendarRange v-model="range" />

<CalendarRange orientation="vertical" />

<CalendarRange v-model="range" :min-date="min" :max-date="max" />
```

### customProps

```vue
<CalendarRange
  :custom-props="{
    panels: { class: 'gap-4' },
    root: { 'data-testid': 'calendar-range' },
  }"
/>
```

## Props

| Prop              | Type                         | Default        | Description                                                 |
| ----------------- | ---------------------------- | -------------- | ----------------------------------------------------------- |
| `classes`         | `CalendarRangeClasses`       | —              | Classes for calendar range regions.                         |
| `color`           | `CalendarColor`              | `"primary"`    | Accent color for tiles.                                     |
| `customProps`     | `CalendarRangeCustomProps`   | —              | Extra props for internal parts.                             |
| `defaultValue`    | `DateRangeValue \| null`     | `null`         | Uncontrolled initial value.                                 |
| `disabled`        | `boolean`                    | `false`        | Disables the calendar range.                                |
| `disableDates`    | `Date[]`                     | —              | Dates that cannot be selected.                              |
| `disableMonths`   | `number[]`                   | —              | Month indexes that cannot be selected.                      |
| `disableYears`    | `number[]`                   | —              | Years that cannot be selected.                              |
| `error`           | `boolean`                    | `false`        | Applies the error color palette to tiles.                   |
| `fill`            | `boolean`                    | `false`        | Fills the container width.                                  |
| `hideMonths`      | `boolean`                    | `false`        | Hides the shared month selector and month panel.            |
| `hideOutsideDays` | `boolean`                    | `false`        | Hides days outside the displayed month on both date panels. |
| `hideWeekdays`    | `boolean`                    | `false`        | Hides weekday labels on both date panels.                   |
| `hideYears`       | `boolean`                    | `false`        | Hides the shared year selector and year panel.              |
| `maxDate`         | `Date`                       | —              | Latest selectable date.                                     |
| `minDate`         | `Date`                       | —              | Earliest selectable date.                                   |
| `orientation`     | `"horizontal" \| "vertical"` | `"horizontal"` | Dual calendar layout: side-by-side or stacked.              |
| `previewDate`     | `Date \| null`               | —              | Controlled range-preview hover date.                        |
| `readOnly`        | `boolean`                    | `false`        | Prevents selection.                                         |
| `rounded`         | `CalendarRounded`            | `"md"`         | Border radius of tiles and chrome.                          |
| `slots`           | `CalendarRangeSlots`         | —              | Named slots (`day`, optional `startAside` / `endAside`).    |
| `startOfWeek`     | `StartOfWeek`                | `0`            | First day of the week.                                      |
| `timeZone`        | `string`                     | —              | IANA time zone.                                             |
| `value`           | `DateRangeValue \| null`     | —              | Controlled range value (`[start, end]`).                    |
| `viewDate`        | `Date`                       | —              | Controlled start (left) displayed month.                    |

### v-model

| Prop / Event        | Type                                      | Default | Description                           |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DateRangeValue \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DateRangeValue \| null) => void` | —       | Emitted when `v-model` should update. |

Calendar chrome tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Event                      | Payload                           | Description                                        |
| -------------------------- | --------------------------------- | -------------------------------------------------- |
| `v-on:change`              | `(value: DateRangeValue \| null)` | Emitted when the range changes.                    |
| `v-on:preview-date-change` | `(date: Date \| null)`            | Emitted when the range preview hover date changes. |
| `v-on:view-date-change`    | `(date: Date)`                    | Emitted when the start displayed month changes.    |

## Related components

Calendar, CalendarDate, DateRangePicker, DateRangeField
