# DateField

Form field that opens a `DatePicker` in a menu. Extends FormField props.

## Import

```ts
import { DateField } from "@bridge-ui/vue/Components/DateField";
```

## Examples

### Usage

```vue
<DateField label="Start date" />

<DateField
  label="Birthday"
  v-model="date"
  description="Stored as a local calendar date."
/>

<DateField error label="Date" error-message="Pick a valid date." />
```

### Range

```vue
<DateField range label="Trip" v-model="range" />
```

### customProps

```vue
<DateField
  label="Date"
  :custom-props="{
    input: { name: 'date' },
    datePicker: { root: { 'data-testid': 'date-picker' } },
  }"
/>
```

## Props

### DateField-specific

| Prop            | Type                   | Default  | Description                                                        |
| --------------- | ---------------------- | -------- | ------------------------------------------------------------------ |
| `classes`       | `DateFieldClasses`     | —        | Classes for field / input regions.                                 |
| `customProps`   | `DateFieldCustomProps` | —        | Extra props for internal parts (`input`, `menu`, `datePicker`, …). |
| `defaultValue`  | `DatePickerModel`      | `null`   | Uncontrolled initial value.                                        |
| `defaultView`   | `CalendarView`         | `"date"` | Initial calendar panel view.                                       |
| `disableDates`  | `Date[]`               | —        | Dates that cannot be selected.                                     |
| `disableMonths` | `number[]`             | —        | Month indexes that cannot be selected.                             |
| `disableYears`  | `number[]`             | —        | Years that cannot be selected.                                     |
| `hideMonths`    | `boolean`              | `false`  | Hides month navigation / panel.                                    |
| `hideWeekdays`  | `boolean`              | `false`  | Hides weekday labels.                                              |
| `hideYears`     | `boolean`              | `false`  | Hides year navigation / panel.                                     |
| `maxDate`       | `Date`                 | —        | Latest selectable date.                                            |
| `minDate`       | `Date`                 | —        | Earliest selectable date.                                          |
| `multiple`      | `boolean`              | `false`  | Allows selecting multiple dates.                                   |
| `range`         | `boolean`              | `false`  | Selects a date range.                                              |
| `showFooter`    | `boolean`              | `false`  | Shows Cancel / Apply on the nested picker.                         |
| `slots`         | `DateFieldSlots`       | —        | Named slots (`FormField` slots + calendar `day`).                  |
| `startOfWeek`   | `StartOfWeek`          | `0`      | First day of the week.                                             |
| `timeZone`      | `string`               | —        | IANA time zone.                                                    |
| `value`         | `DatePickerModel`      | —        | Controlled value.                                                  |

### v-model

| Prop / Event        | Type                               | Default | Description                           |
| ------------------- | ---------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DatePickerModel`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DatePickerModel) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                    | Description                               |
| ------------- | -------------------------- | ----------------------------------------- |
| `v-on:change` | `(value: DatePickerModel)` | Emitted when the selection model changes. |
| `v-on:close`  | `()`                       | Emitted when the menu closes.             |
| `v-on:open`   | `()`                       | Emitted when the menu opens.              |

## Related components

DatePicker, FormField, DateRangeField
