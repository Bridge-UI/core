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

| Prop          | Type               | Default   | Description                                                                                |
| ------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| `classes`     | `RadioClasses`     | —         | Classes for the form control chrome and the radio control.                                 |
| `color`       | `RadioColor`       | "primary" | The color to apply to the radio.                                                           |
| `customProps` | `RadioCustomProps` | —         | Extra props for internal parts.                                                            |
| `name`        | `string`           | —         | The `name` attribute shared by radios in the same group.                                   |
| `rounded`     | `RadioRounded`     | "full"    | The roundedness of the radio control.                                                      |
| `size`        | `RadioSize`        | "md"      | Size of the control and of form control labels (`2xs` … `2xl`, same scale as `FormField`). |
| `slots`       | `RadioSlots`       | —         | Chrome slots and the control slot.                                                         |
| `value`       | `string \| number` | —         | The value of this radio option.                                                            |

### Binding

| Prop       | Type                                   | Default | Description                                                             |
| ---------- | -------------------------------------- | ------- | ----------------------------------------------------------------------- |
| `checked`  | `boolean`                              | —       | Whether the radio is checked. Use with `onChange` for controlled state. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | —       | Native input change handler.                                            |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
