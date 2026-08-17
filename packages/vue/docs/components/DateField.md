# DateField

Form field that opens a `DatePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

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

### Overlay

```vue
<DateField label="Date" overlay="auto" />

<DateField label="Date" overlay="drawer" />

<DateField
  label="Date"
  overlay="modal"
  :custom-props="{
    modal: { size: 'sm', transition: 'none' },
  }"
/>
```

Default `overlay` is `auto`: `menu` on desktop and bottom `drawer` on mobile.
When unset, `showFooter` defaults to `true` for `modal` / `drawer` overlays (`false` for `menu`).
Apply commits and closes the overlay; Cancel discards the draft and closes.

The input is read-only by default (picker only). Set `editable` to allow typing:

```vue
<DateField editable label="Date" />
```

### Custom footer

Replaces Cancel / Apply on the nested picker. `apply()` commits and closes; `cancel()` discards and closes.

```vue
<DateField overlay="modal">
  <template #footer="{ apply, cancel }">
    <button type="button" @click="cancel">Discard</button>
    <button type="button" @click="apply">Save</button>
  </template>
</DateField>
```

## Props

### DateField-specific

| Prop              | Type                   | Default                                      | Description                                                                           |
| ----------------- | ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `classes`         | `DateFieldClasses`     | —                                            | Classes for field / input regions.                                                    |
| `clearable`       | `boolean`              | `true`                                       | Whether the value can be cleared.                                                     |
| `customProps`     | `DateFieldCustomProps` | —                                            | Extra props for internal parts (`input`, `menu`, `modal`, `drawer`, `datePicker`, …). |
| `defaultValue`    | `DatePickerModel`      | `null`                                       | Uncontrolled initial value.                                                           |
| `defaultView`     | `CalendarView`         | `"date"`                                     | Initial calendar panel view.                                                          |
| `disableDates`    | `Date[]`               | —                                            | Dates that cannot be selected.                                                        |
| `disableMonths`   | `number[]`             | —                                            | Month indexes that cannot be selected.                                                |
| `disableYears`    | `number[]`             | —                                            | Years that cannot be selected.                                                        |
| `editable`        | `boolean`              | `false`                                      | Allows typing in the input. Input is read-only when unset.                            |
| `hideMonths`      | `boolean`              | `false`                                      | Hides month navigation / panel.                                                       |
| `hideOutsideDays` | `boolean`              | `false`                                      | Hides days that fall outside the displayed month.                                     |
| `hideWeekdays`    | `boolean`              | `false`                                      | Hides weekday labels.                                                                 |
| `hideYears`       | `boolean`              | `false`                                      | Hides year navigation / panel.                                                        |
| `maxDate`         | `Date`                 | —                                            | Latest selectable date.                                                               |
| `minDate`         | `Date`                 | —                                            | Earliest selectable date.                                                             |
| `multiple`        | `boolean`              | `false`                                      | Allows selecting multiple dates.                                                      |
| `overlay`         | `FieldOverlayMode`     | `"auto"`                                     | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                                  |
| `range`           | `boolean`              | `false`                                      | Selects a date range.                                                                 |
| `showFooter`      | `boolean`              | `false` (`true` for modal/drawer when unset) | Shows Cancel / Apply on the nested picker.                                            |
| `slots`           | `DateFieldSlots`       | —                                            | Named slots (`FormField` slots + calendar `day` + footer).                            |
| `startOfWeek`     | `StartOfWeek`          | `0`                                          | First day of the week.                                                                |
| `timeZone`        | `string`               | —                                            | IANA time zone.                                                                       |
| `value`           | `DatePickerModel`      | —                                            | Controlled value.                                                                     |

### v-model

| Prop / Event        | Type                               | Default | Description                           |
| ------------------- | ---------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `DatePickerModel`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: DatePickerModel) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                    | Description                                    |
| ------------- | -------------------------- | ---------------------------------------------- |
| `v-on:apply`  | `()`                       | Emitted when Apply is pressed (`showFooter`).  |
| `v-on:cancel` | `()`                       | Emitted when Cancel is pressed (`showFooter`). |
| `v-on:change` | `(value: DatePickerModel)` | Emitted when the selection model changes.      |
| `v-on:clear`  | `()`                       | Emitted when the value is cleared.             |
| `v-on:close`  | `()`                       | Emitted when the menu closes.                  |
| `v-on:open`   | `()`                       | Emitted when the menu opens.                   |

## Related components

DatePicker, FormField, DateRangeField
