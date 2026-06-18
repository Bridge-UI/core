# Radio

Radio input for mutually exclusive choices. Extends FormControl props.

## Import

```vue
import { Radio } from "@bridge-ui/vue/Components/Radio";
```

## Examples

### Usage

```vue
<Radio
  v-model="plan"
  name="plan"
  value="starter"
  main-label="Starter"
  description="Free tier for individuals."
/>

<Radio
  v-model="plan"
  name="plan"
  value="pro"
  main-label="Pro"
  description="For growing teams."
/>
```

### Required and error

```vue
<Radio required name="required" value="req" main-label="Required field" />

<Radio
  error
  name="error"
  value="err"
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
    control: { 'data-testid': 'plan-pro-control' },
    dot: { 'aria-hidden': true },
  }"
/>
```

## Props

### Radio-specific

| Prop         | Type               | Default | Description    |
| ------------ | ------------------ | ------- | -------------- |
| `name`       | `string`           | —       | Group name     |
| `value`      | `string \| number` | —       | Option value   |
| `modelValue` | `string \| number` | —       | Selected value |

### Inherited from FormControl

| Prop           | Type      | Default | Description                 |
| -------------- | --------- | ------- | --------------------------- |
| `mainLabel`    | `string`  | —       | Label after the control     |
| `startLabel`   | `string`  | —       | Label before the control    |
| `endLabel`     | `string`  | —       | Label at the end of the row |
| `description`  | `string`  | —       | Helper text                 |
| `error`        | `boolean` | `false` | Error state                 |
| `errorMessage` | `string`  | —       | Error message               |
| `required`     | `boolean` | `false` | Required                    |
| `disabled`     | `boolean` | `false` | Disabled                    |
| `readonly`     | `boolean` | `false` | Read-only                   |
| `size`         | `Size`    | `"md"`  | Control size                |

## Related components

Checkbox, FormControl
