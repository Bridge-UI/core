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

| Prop         | Type               | Default | Description    |
| ------------ | ------------------ | ------- | -------------- |
| `name`       | `string`           | —       | Group name     |
| `value`      | `string \| number` | —       | Option value   |
| `modelValue` | `string \| number` | —       | Selected value |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
