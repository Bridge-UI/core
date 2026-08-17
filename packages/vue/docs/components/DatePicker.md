# DatePicker

Inline calendar picker for a single date, multiple dates, or a range. Optional Cancel / Apply footer.

## Import

```ts
import { DatePicker } from "@bridge-ui/vue/Components/DatePicker";
```

## Examples

### Usage

```vue
<DatePicker />

<DatePicker v-model="date" />

<DatePicker range show-footer v-model="range" @cancel="() => {}" />
```

### Custom footer

Call `apply()` to commit and close the overlay, or `cancel()` to discard and close.

```vue
<DatePicker show-footer>
  <template #footer="{ apply, cancel }">
    <button type="button" @click="cancel">Discard</button>
    <button type="button" @click="apply">Save</button>
  </template>
</DatePicker>
```

### customProps

```vue
<DatePicker
  :custom-props="{
    root: { 'data-testid': 'date-picker' },
    applyButton: { type: 'button' },
  }"
/>
```

## Props

| Prop              | Type                    | Default     | Description                                                       |
| ----------------- | ----------------------- | ----------- | ----------------------------------------------------------------- |
| `classes`         | `DatePickerClasses`     | —           | Classes for picker regions.                                       |
| `color`           | `CalendarColor`         | `"primary"` | Accent color.                                                     |
| `customProps`     | `DatePickerCustomProps` | —           | Extra props for internal parts.                                   |
| `defaultValue`    | `DatePickerModel`       | `null`      | Uncontrolled initial value.                                       |
| `defaultView`     | `CalendarView`          | `"date"`    | Initial calendar panel view.                                      |
| `disabled`        | `boolean`               | `false`     | Disables the picker.                                              |
| `disableDates`    | `Date[]`                | —           | Dates that cannot be selected.                                    |
| `disableMonths`   | `number[]`              | —           | Month indexes that cannot be selected.                            |
| `disableYears`    | `number[]`              | —           | Years that cannot be selected.                                    |
| `error`           | `boolean`               | `false`     | Applies the error color palette to tiles.                         |
| `fill`            | `boolean`               | `false`     | Fills the container width.                                        |
| `hideMonths`      | `boolean`               | `false`     | Hides month navigation / panel.                                   |
| `hideOutsideDays` | `boolean`               | `false`     | Hides days that fall outside the displayed month.                 |
| `hideWeekdays`    | `boolean`               | `false`     | Hides weekday labels.                                             |
| `hideYears`       | `boolean`               | `false`     | Hides year navigation / panel.                                    |
| `maxDate`         | `Date`                  | —           | Latest selectable date.                                           |
| `minDate`         | `Date`                  | —           | Earliest selectable date.                                         |
| `multiple`        | `boolean`               | `false`     | Allows selecting multiple dates.                                  |
| `range`           | `boolean`               | `false`     | Selects a date range.                                             |
| `readOnly`        | `boolean`               | `false`     | Prevents selection.                                               |
| `rounded`         | `CalendarRounded`       | `"md"`      | Border radius of calendar tiles and chrome.                       |
| `showFooter`      | `boolean`               | `false`     | Shows Cancel / Apply. Selection is draft until Apply.             |
| `slots`           | `DatePickerSlots`       | —           | Named slots (`day` on the calendar, `footer` for Cancel / Apply). |
| `startOfWeek`     | `StartOfWeek`           | `0`         | First day of the week.                                            |
| `timeZone`        | `string`                | —           | IANA time zone.                                                   |
| `tokens`          | `DatePickerTokens`      | —           | Token overrides.                                                  |
| `value`           | `DatePickerModel`       | —           | Controlled value.                                                 |

### v-model

| Prop / Event        | Type                               | Default | Description                           |
| ------------------- | ---------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DatePickerModel`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DatePickerModel) => void` | —       | Emitted when `v-model` should update. |

## Events

| Event         | Payload                    | Description                                                             |
| ------------- | -------------------------- | ----------------------------------------------------------------------- |
| `v-on:apply`  | `()`                       | Emitted when Apply is pressed (`showFooter`).                           |
| `v-on:cancel` | `()`                       | Emitted when Cancel is pressed.                                         |
| `v-on:change` | `(value: DatePickerModel)` | Emitted when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

Calendar, DateField, DateRangePicker
