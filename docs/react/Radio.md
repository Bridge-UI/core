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
<Radio required name="required" value="req" mainLabel="Required field" />

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
    control: { "data-testid": "plan-pro-control" },
    dot: { "aria-hidden": true },
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
