# TimeField

Form field that opens a `TimePicker` in an overlay (`Menu` by default). Extends FormField props. Uses the semantic `clock` icon by default.

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

| Prop           | Type                   | Default  | Description                                          |
| -------------- | ---------------------- | -------- | ---------------------------------------------------- |
| `ampm`         | `boolean`              | `false`  | Uses a 12-hour clock with an AM/PM column.           |
| `classes`      | `TimeFieldClasses`     | —        | Classes for field / input regions.                   |
| `customProps`  | `TimeFieldCustomProps` | —        | Extra props for internal parts.                      |
| `defaultValue` | `Date \| null`         | `null`   | Uncontrolled initial value.                          |
| `disableTimes` | `Date[]`               | —        | Times that cannot be selected.                       |
| `interval`     | `number`               | `1`      | Minute step between options.                         |
| `maxTime`      | `Date`                 | —        | Latest selectable time.                              |
| `minTime`      | `Date`                 | —        | Earliest selectable time.                            |
| `overlay`      | `FieldOverlayMode`     | `"menu"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`. |
| `showFooter`   | `boolean`              | `false`  | Shows Cancel / Apply on the nested picker.           |
| `slots`        | `TimeFieldSlots`       | —        | Named slots (`FormField` slots).                     |
| `timeZone`     | `string`               | —        | IANA time zone.                                      |
| `value`        | `Date \| null`         | —        | Controlled value.                                    |

### v-model

| Prop / Event        | Type                            | Default | Description                           |
| ------------------- | ------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `Date \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: Date \| null) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                 | Description                    |
| ------------- | ----------------------- | ------------------------------ |
| `v-on:change` | `(value: Date \| null)` | Emitted when the time changes. |
| `v-on:close`  | `()`                    | Emitted when the menu closes.  |
| `v-on:open`   | `()`                    | Emitted when the menu opens.   |

## Related components

TimePicker, FormField, DateTimeField
