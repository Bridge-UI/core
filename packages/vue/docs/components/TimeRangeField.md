# TimeRangeField

Form field that opens a `TimeRangePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

## Import

```ts
import { TimeRangeField } from "@bridge-ui/vue/Components/TimeRangeField";
```

## Examples

### Usage

```vue
<TimeRangeField label="Hours" />

<TimeRangeField ampm label="Shift" v-model="range" />
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).

### customProps

```vue
<TimeRangeField
  label="Hours"
  :custom-props="{
    input: { name: 'hours' },
    timeRangePicker: { root: { 'data-testid': 'tr-picker' } },
  }"
/>
```

## Props

### TimeRangeField-specific

| Prop           | Type                         | Default                                      | Description                                                                    |
| -------------- | ---------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------ |
| `ampm`         | `boolean`                    | `false`                                      | Uses a 12-hour clock with an AM/PM column.                                     |
| `classes`      | `TimeRangeFieldClasses`      | —                                            | Classes for field / input regions.                                             |
| `clearable`    | `boolean`                    | `true`                                       | Whether the value can be cleared.                                              |
| `customProps`  | `TimeRangeFieldCustomProps`  | —                                            | Extra props for internal parts.                                                |
| `defaultValue` | `TimeRangeValue \| null`     | `null`                                       | Uncontrolled initial value.                                                    |
| `disableTimes` | `Date[]`                     | —                                            | Times that cannot be selected.                                                 |
| `interval`     | `number`                     | `1`                                          | Minute step between options.                                                   |
| `maxTime`      | `Date`                       | —                                            | Latest selectable time.                                                        |
| `minTime`      | `Date`                       | —                                            | Earliest selectable time.                                                      |
| `orientation`  | `"horizontal" \| "vertical"` | `"horizontal"`                               | Dual panel layout. Mobile `drawer` / `modal` default to `vertical` when unset. |
| `overlay`      | `FieldOverlayMode`           | `"auto"`                                     | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                           |
| `showFooter`   | `boolean`                    | `false` (`true` for modal/drawer when unset) | Shows Cancel / Apply on the nested picker.                                     |
| `showSeconds`  | `boolean`                    | `false`                                      | Shows seconds in the panel and formatted value.                                |
| `slots`        | `TimeRangeFieldSlots`        | —                                            | Named slots (`FormField` slots + footer).                                      |
| `timeZone`     | `string`                     | —                                            | IANA time zone.                                                                |
| `value`        | `TimeRangeValue \| null`     | —                                            | Controlled value.                                                              |

### v-model

| Prop / Event        | Type                                      | Default | Description                           |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `TimeRangeValue \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: TimeRangeValue \| null) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                           | Description                                    |
| ------------- | --------------------------------- | ---------------------------------------------- |
| `v-on:apply`  | `()`                              | Emitted when Apply is pressed (`showFooter`).  |
| `v-on:cancel` | `()`                              | Emitted when Cancel is pressed (`showFooter`). |
| `v-on:change` | `(value: TimeRangeValue \| null)` | Emitted when the range changes.                |
| `v-on:clear`  | `()`                              | Emitted when the value is cleared.             |
| `v-on:close`  | `()`                              | Emitted when the menu closes.                  |
| `v-on:open`   | `()`                              | Emitted when the menu opens.                   |

## Related components

TimeRangePicker, FormField, TimeField
