# Checkbox

Checkbox input with labels and form chrome. Extends FormControl props.

## Import

```vue
import { Checkbox } from "@bridge-ui/vue/Components/Checkbox";
```

## Examples

### Usage

```vue
<Checkbox
  main-label="Accept terms"
  description="Receive updates about your account."
/>

<Checkbox v-model="terms" main-label="Remember me" />

<Checkbox indeterminate main-label="Select all" />
```

### Required and error

```vue
<Checkbox required main-label="Required field" />

<Checkbox
  error
  main-label="Invalid option"
  error-message="You must accept to continue."
/>
```

### States

```vue
<Checkbox disabled :model-value="true" main-label="Disabled" />

<Checkbox readonly :model-value="true" main-label="Read-only" />
```

### customProps

```vue
<Checkbox
  main-label="Accept terms"
  :custom-props="{
    input: { name: 'terms', value: 'yes' },
    control: { 'data-testid': 'terms-control' },
    icon: { 'aria-hidden': true },
  }"
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
