# DateTimeRangeField

Form field that opens a `DateTimeRangePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

## Import

```ts
import { DateTimeRangeField } from "@bridge-ui/vue/Components/DateTimeRangeField";
```

## Examples

### Usage

```vue
<DateTimeRangeField label="Event" />

<DateTimeRangeField ampm label="Window" v-model="range" />
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

### customProps

```vue
<DateTimeRangeField
  label="Event"
  :custom-props="{
    input: { name: 'event' },
    dateTimeRangePicker: { root: { 'data-testid': 'dtr-picker' } },
  }"
/>
```

## Props

### DateTimeRangeField-specific

| Prop              | Type                            | Default                               | Description                                                                       |
| ----------------- | ------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------- |
| `ampm`            | `boolean`                       | `false`                               | Uses a 12-hour clock with an AM/PM column.                                        |
| `classes`         | `DateTimeRangeFieldClasses`     | —                                     | Classes for field / input regions.                                                |
| `clearable`       | `boolean`                       | `true`                                | Whether the value can be cleared.                                                 |
| `customProps`     | `DateTimeRangeFieldCustomProps` | —                                     | Extra props for internal parts.                                                   |
| `defaultValue`    | `DateRangeValue \| null`        | `null`                                | Uncontrolled initial value.                                                       |
| `disableDates`    | `Date[]`                        | —                                     | Dates that cannot be selected.                                                    |
| `disableMonths`   | `number[]`                      | —                                     | Month indexes that cannot be selected.                                            |
| `disableTimes`    | `Date[]`                        | —                                     | Times that cannot be selected.                                                    |
| `disableYears`    | `number[]`                      | —                                     | Years that cannot be selected.                                                    |
| `hideMonths`      | `boolean`                       | `false`                               | Hides month navigation / panel.                                                   |
| `hideOutsideDays` | `boolean`                       | `false`                               | Hides days that fall outside the displayed month.                                 |
| `hideWeekdays`    | `boolean`                       | `false`                               | Hides weekday labels.                                                             |
| `hideYears`       | `boolean`                       | `false`                               | Hides year navigation / panel.                                                    |
| `interval`        | `number`                        | `1`                                   | Minute step between time options.                                                 |
| `maxDate`         | `Date`                          | —                                     | Latest selectable date.                                                           |
| `maxTime`         | `Date`                          | —                                     | Latest selectable time.                                                           |
| `minDate`         | `Date`                          | —                                     | Earliest selectable date.                                                         |
| `minTime`         | `Date`                          | —                                     | Earliest selectable time.                                                         |
| `orientation`     | `"horizontal" \| "vertical"`    | `"horizontal"`                        | Dual calendar layout. Mobile `drawer` / `modal` default to `vertical` when unset. |
| `overlay`         | `FieldOverlayMode`              | `"auto"`                              | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                              |
| `showFooter`      | `boolean`                       | `false` (`true` on mobile when unset) | Shows Cancel / Apply on the nested picker.                                        |
| `slots`           | `DateTimeRangeFieldSlots`       | —                                     | Named slots (`FormField` slots + calendar `day`).                                 |
| `startOfWeek`     | `StartOfWeek`                   | `0`                                   | First day of the week.                                                            |
| `timeZone`        | `string`                        | —                                     | IANA time zone.                                                                   |
| `value`           | `DateRangeValue \| null`        | —                                     | Controlled value.                                                                 |

### v-model

| Prop / Event        | Type                                      | Default | Description                           |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DateRangeValue \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DateRangeValue \| null) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                           | Description                        |
| ------------- | --------------------------------- | ---------------------------------- |
| `v-on:change` | `(value: DateRangeValue \| null)` | Emitted when the range changes.    |
| `v-on:clear`  | `()`                              | Emitted when the value is cleared. |
| `v-on:close`  | `()`                              | Emitted when the menu closes.      |
| `v-on:open`   | `()`                              | Emitted when the menu opens.       |

## Related components

DateTimeRangePicker, FormField, DateRangeField, DateTimeField
