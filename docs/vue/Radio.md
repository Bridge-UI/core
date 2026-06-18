# Radio

Radio input for mutually exclusive choices. Extends FormControl props.

## Import

```ts
import { Radio } from "@bridge-ui/vue/Components/Radio";
```

## Examples

### Usage

```vue
<Radio
  name="plan"
  v-model="plan"
  value="starter"
  main-label="Starter"
  description="Free tier for individuals."
/>

<Radio
  name="plan"
  value="pro"
  v-model="plan"
  main-label="Pro"
  description="For growing teams."
/>
```

### Required and error

```vue
<Radio required value="req" name="required" main-label="Required field" />

<Radio
  error
  value="err"
  name="error"
  main-label="Invalid option"
  error-message="Please select a valid option."
/>
```

### customProps

```vue
<Radio
  name="plan"
  value="pro"
  main-label="Pro plan"
  :custom-props="{
    input: { id: 'plan-pro' },
    dot: { 'aria-hidden': true },
    control: { 'data-testid': 'plan-pro-control' },
  }"
/>
```

## Props

### Radio-specific

| Prop          | Type               | Default   | Description                                                                                |
| ------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| `checked`     | `boolean`          | —         | Whether the radio is checked.                                                              |
| `classes`     | `RadioClasses`     | —         | Classes for the form control chrome and the radio control.                                 |
| `color`       | `RadioColor`       | "primary" | The color to apply to the radio.                                                           |
| `customProps` | `RadioCustomProps` | —         | Extra props for internal parts.                                                            |
| `name`        | `string`           | —         | The `name` attribute shared by radios in the same group.                                   |
| `rounded`     | `RadioRounded`     | "full"    | The roundedness of the radio control.                                                      |
| `size`        | `RadioSize`        | "md"      | Size of the control and of form control labels (`2xs` … `2xl`, same scale as `FormField`). |
| `slots`       | `RadioSlots`       | —         | Chrome slots and the control slot.                                                         |
| `value`       | `string \| number` | —         | The value of this radio option.                                                            |

### v-model

| Prop / Event        | Type                                | Default | Description                                                                  |
| ------------------- | ----------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `string \| number`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: string \| number) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
