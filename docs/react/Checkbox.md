# Checkbox

Checkbox input with labels and form chrome. Extends FormControl props.

## Import

```ts
import { Checkbox } from "@bridge-ui/react/Components/Checkbox";
```

## Examples

### Usage

```tsx
<Checkbox
  endLabel="Accept terms"
  description="Receive updates about your account."
/>

<Checkbox
  checked={terms}
  endLabel="Remember me"
  onChange={(event) => setTerms(event.target.checked)}
/>

<Checkbox
  indeterminate
  endLabel="Select all"
/>
```

### Required and error

```tsx
<Checkbox required endLabel="Required field" />

<Checkbox
  error
  endLabel="Invalid option"
  errorMessage="You must accept to continue."
/>
```

### States

```tsx
<Checkbox
  disabled
  defaultChecked
  endLabel="Disabled"
/>

<Checkbox
  readonly
  defaultChecked
  endLabel="Read-only"
/>
```

### customProps

```tsx
<Checkbox
  endLabel="Accept terms"
  customProps={{
    icon: { "aria-hidden": true },
    input: { name: "terms", value: "yes" },
    control: { "data-testid": "terms-control" },
  }}
/>
```

## Props

### Checkbox-specific

| Prop            | Type                  | Default   | Description                                                                                |
| --------------- | --------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `classes`       | `CheckboxClasses`     | —         | Classes for the form control chrome and the checkbox control.                              |
| `color`         | `CheckboxColor`       | "primary" | The color to apply to the checkbox.                                                        |
| `customProps`   | `CheckboxCustomProps` | —         | Extra props for internal parts.                                                            |
| `indeterminate` | `boolean`             | `false`   | Whether the checkbox is in an indeterminate state.                                         |
| `rounded`       | `CheckboxRounded`     | "sm"      | The roundedness of the checkbox control.                                                   |
| `size`          | `CheckboxSize`        | "md"      | Size of the control and of form control labels (`2xs` … `2xl`, same scale as `FormField`). |
| `slots`         | `CheckboxSlots`       | —         | Chrome slots and the control slot.                                                         |

### Binding

| Prop       | Type                                   | Default | Description                                                                |
| ---------- | -------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `checked`  | `boolean`                              | —       | Whether the checkbox is checked. Use with `onChange` for controlled state. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | —       | Native input change handler.                                               |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

FormControl, Radio, Switch
