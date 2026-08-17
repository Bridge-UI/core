# TimeField

Form field that opens a `TimePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props. Uses the semantic `clock` icon by default.

## Import

```ts
import { TimeField } from "@bridge-ui/vue/Components/TimeField";
```

## Examples

### Usage

```vue
<TimeField label="Start time" />

<TimeField ampm label="Meeting" :interval="5" v-model="time" />

<TimeField error label="Time" error-message="Pick a valid time." />
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).
The input is read-only by default (picker only). Set `editable` to unlock typing. The field does not parse or commit typed text — handle that in your own component if needed:

```vue
<TimeField editable label="Time" />
```

### customProps

```vue
<TimeField
  label="Time"
  :custom-props="{
    input: { name: 'time' },
    timePicker: { root: { 'data-testid': 'time-picker' } },
  }"
/>
```

## Props

### TimeField-specific

| Prop           | Type                   | Default                                      | Description                                                                        |
| -------------- | ---------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `ampm`         | `boolean`              | `false`                                      | Uses a 12-hour clock with an AM/PM column.                                         |
| `classes`      | `TimeFieldClasses`     | —                                            | Classes for field / input regions.                                                 |
| `clearable`    | `boolean`              | `true`                                       | Whether the value can be cleared.                                                  |
| `customProps`  | `TimeFieldCustomProps` | —                                            | Extra props for internal parts.                                                    |
| `defaultValue` | `Date \| null`         | `null`                                       | Uncontrolled initial value.                                                        |
| `disableTimes` | `Date[]`               | —                                            | Times that cannot be selected.                                                     |
| `editable`     | `boolean`              | `false`                                      | Unlocks the input. Does not parse or commit typed text.                            |
| `fill`         | `boolean`              | —                                            | Fills the overlay width. Unset: `true` for `drawer`, `false` for `menu` / `modal`. |
| `interval`     | `number`               | `1`                                          | Minute step between options.                                                       |
| `maxTime`      | `Date`                 | —                                            | Latest selectable time.                                                            |
| `minTime`      | `Date`                 | —                                            | Earliest selectable time.                                                          |
| `overlay`      | `FieldOverlayMode`     | `"auto"`                                     | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                               |
| `showFooter`   | `boolean`              | `false` (`true` for modal/drawer when unset) | Shows Cancel / Apply on the nested picker.                                         |
| `showSeconds`  | `boolean`              | `false`                                      | Shows seconds in the panel and formatted value.                                    |
| `slots`        | `TimeFieldSlots`       | —                                            | Named slots (`FormField` slots + footer).                                          |
| `timeZone`     | `string`               | —                                            | IANA time zone.                                                                    |
| `value`        | `Date \| null`         | —                                            | Controlled value.                                                                  |

### v-model

| Prop / Event        | Type                            | Default | Description                           |
| ------------------- | ------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `Date \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: Date \| null) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                 | Description                                    |
| ------------- | ----------------------- | ---------------------------------------------- |
| `v-on:apply`  | `()`                    | Emitted when Apply is pressed (`showFooter`).  |
| `v-on:cancel` | `()`                    | Emitted when Cancel is pressed (`showFooter`). |
| `v-on:change` | `(value: Date \| null)` | Emitted when the time changes.                 |
| `v-on:clear`  | `()`                    | Emitted when the value is cleared.             |
| `v-on:close`  | `()`                    | Emitted when the menu closes.                  |
| `v-on:open`   | `()`                    | Emitted when the menu opens.                   |

## Related components

TimePicker, FormField, DateTimeField
