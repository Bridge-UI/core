# Radio

Radio input for mutually exclusive choices. Extends FormControl props.

## Import

```tsx
import { Radio } from "@bridge-ui/react/Components/Radio";
```

## Examples

### Usage

```tsx
<Radio
  name="plan"
  value="starter"
  mainLabel="Starter"
  checked={plan === "starter"}
  onChange={() => setPlan("starter")}
  description="Free tier for individuals."
/>

<Radio
  name="plan"
  value="pro"
  mainLabel="Pro"
  checked={plan === "pro"}
  onChange={() => setPlan("pro")}
  description="For growing teams."
/>
```

### Required and error

```tsx
<Radio
  required
  value="req"
  name="required"
  mainLabel="Required field"
/>

<Radio
  error
  name="error"
  value="err"
  mainLabel="Invalid option"
  errorMessage="Please select a valid option."
/>
```

### customProps

```tsx
<Radio
  name="plan"
  value="pro"
  mainLabel="Pro plan"
  customProps={{
    input: { id: "plan-pro" },
    dot: { "aria-hidden": true },
    control: { "data-testid": "plan-pro-control" },
  }}
/>
```

## Props

### Radio-specific

| Prop      | Type               | Default | Description    |
| --------- | ------------------ | ------- | -------------- |
| `name`    | `string`           | —       | Group name     |
| `value`   | `string \| number` | —       | Option value   |
| `checked` | `boolean`          | —       | Selected state |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
