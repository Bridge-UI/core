# Checkbox

Checkbox input with labels and form chrome. Extends FormControl props.

## Import

```tsx
import { Checkbox } from "@bridge-ui/react/Components/Checkbox";
```

## Examples

### Usage

```tsx
<Checkbox
  mainLabel="Accept terms"
  description="Receive updates about your account."
/>

<Checkbox
  checked={terms}
  mainLabel="Remember me"
  onChange={(event) => setTerms(event.target.checked)}
/>

<Checkbox indeterminate mainLabel="Select all" />
```

### Required and error

```tsx
<Checkbox required mainLabel="Required field" />

<Checkbox
  error
  mainLabel="Invalid option"
  errorMessage="You must accept to continue."
/>
```

### States

```tsx
<Checkbox disabled defaultChecked mainLabel="Disabled" />

<Checkbox readonly defaultChecked mainLabel="Read-only" />
```

### customProps

```tsx
<Checkbox
  mainLabel="Accept terms"
  customProps={{
    input: { name: "terms", value: "yes" },
    control: { "data-testid": "terms-control" },
    icon: { "aria-hidden": true },
  }}
/>
```

## Props

### Checkbox-specific

| Prop            | Type                  | Default     | Description                 |
| --------------- | --------------------- | ----------- | --------------------------- |
| `checked`       | `boolean`             | —           | Controlled checked          |
| `classes`       | `CheckboxClasses`     | —           | Per-part classes            |
| `color`         | `Color`               | `"primary"` | Accent color                |
| `customProps`   | `CheckboxCustomProps` | —           | Props for internal parts    |
| `indeterminate` | `boolean`             | `false`     | Indeterminate state         |
| `rounded`       | `Rounded`             | `"sm"`      | Box radius                  |
| `size`          | `Size`                | `"md"`      | Control size                |
| `slots`         | `CheckboxSlots`       | —           | FormControl slots + control |

### Inherited from FormControl

| Prop                  | Type      | Default | Description                 |
| --------------------- | --------- | ------- | --------------------------- |
| `controlId`           | `string`  | —       | Associated control id       |
| `description`         | `string`  | —       | Helper text                 |
| `disabled`            | `boolean` | `false` | Disabled                    |
| `endLabel`            | `string`  | —       | Label at the end of the row |
| `error`               | `boolean` | `false` | Error state                 |
| `errorMessage`        | `string`  | —       | Error message               |
| `mainLabel`           | `string`  | —       | Label after the control     |
| `readonly`            | `boolean` | `false` | Read-only                   |
| `required`            | `boolean` | `false` | Required                    |
| `startLabel`          | `string`  | —       | Label before the control    |
| `withoutErrorMessage` | `boolean` | `false` | Hide error message row      |

## Related components

FormControl, Radio, Switch
