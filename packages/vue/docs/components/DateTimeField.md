# DateTimeField

Form field that opens a `DateTimePicker` in an overlay (`Menu` by default). Extends FormField props.

## Import

```ts
import { DateTimeField } from "@bridge-ui/vue/Components/DateTimeField";
```

## Examples

### Usage

```vue
<DateTimeField label="Appointment" />

<DateTimeField ampm label="Start" v-model="when" />

<DateTimeField error label="When" error-message="Pick a date and time." />
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

### customProps

```vue
<DateTimeField
  label="When"
  :custom-props="{
    input: { name: 'when' },
    dateTimePicker: { root: { 'data-testid': 'dt-picker' } },
  }"
/>
```

## Props

### DateTimeField-specific

| Prop              | Type                       | Default  | Description                                          |
| ----------------- | -------------------------- | -------- | ---------------------------------------------------- |
| `ampm`            | `boolean`                  | `false`  | Uses a 12-hour clock with an AM/PM column.           |
| `classes`         | `DateTimeFieldClasses`     | —        | Classes for field / input regions.                   |
| `customProps`     | `DateTimeFieldCustomProps` | —        | Extra props for internal parts.                      |
| `defaultValue`    | `Date \| null`             | `null`   | Uncontrolled initial value.                          |
| `defaultView`     | `CalendarView`             | `"date"` | Initial calendar panel view.                         |
| `disableDates`    | `Date[]`                   | —        | Dates that cannot be selected.                       |
| `disableMonths`   | `number[]`                 | —        | Month indexes that cannot be selected.               |
| `disableTimes`    | `Date[]`                   | —        | Times that cannot be selected.                       |
| `disableYears`    | `number[]`                 | —        | Years that cannot be selected.                       |
| `hideMonths`      | `boolean`                  | `false`  | Hides month navigation / panel.                      |
| `hideOutsideDays` | `boolean`                  | `false`  | Hides days that fall outside the displayed month.    |
| `hideWeekdays`    | `boolean`                  | `false`  | Hides weekday labels.                                |
| `hideYears`       | `boolean`                  | `false`  | Hides year navigation / panel.                       |
| `interval`        | `number`                   | `1`      | Minute step between time options.                    |
| `maxDate`         | `Date`                     | —        | Latest selectable date.                              |
| `maxTime`         | `Date`                     | —        | Latest selectable time.                              |
| `minDate`         | `Date`                     | —        | Earliest selectable date.                            |
| `minTime`         | `Date`                     | —        | Earliest selectable time.                            |
| `overlay`         | `FieldOverlayMode`         | `"menu"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`. |
| `showFooter`      | `boolean`                  | `false`  | Shows Cancel / Apply on the nested picker.           |
| `slots`           | `DateTimeFieldSlots`       | —        | Named slots (`FormField` slots + calendar `day`).    |
| `startOfWeek`     | `StartOfWeek`              | `0`      | First day of the week.                               |
| `timeZone`        | `string`                   | —        | IANA time zone.                                      |
| `value`           | `Date \| null`             | —        | Controlled value.                                    |

### v-model

| Prop / Event        | Type                            | Default | Description                           |
| ------------------- | ------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `Date \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: Date \| null) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                 | Description                     |
| ------------- | ----------------------- | ------------------------------- |
| `v-on:change` | `(value: Date \| null)` | Emitted when the value changes. |
| `v-on:close`  | `()`                    | Emitted when the menu closes.   |
| `v-on:open`   | `()`                    | Emitted when the menu opens.    |

## Related components

DateTimePicker, FormField, DateField, TimeField
