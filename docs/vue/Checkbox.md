# Checkbox

Checkbox input with labels and form chrome. Extends FormControl props.

## Import

```ts
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
    icon: { 'aria-hidden': true },
    input: { name: 'terms', value: 'yes' },
    control: { 'data-testid': 'terms-control' },
  }"
/>
```

## Props

### Checkbox-specific

| Prop            | Type                  | Default   | Description                                                                                |
| --------------- | --------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `checked`       | `boolean`             | —         | Whether the checkbox is checked.                                                           |
| `classes`       | `CheckboxClasses`     | —         | Classes for the form control chrome and the checkbox control.                              |
| `color`         | `CheckboxColor`       | "primary" | The color to apply to the checkbox.                                                        |
| `customProps`   | `CheckboxCustomProps` | —         | Extra props for internal parts.                                                            |
| `indeterminate` | `boolean`             | `false`   | Whether the checkbox is in an indeterminate state.                                         |
| `rounded`       | `CheckboxRounded`     | "sm"      | The roundedness of the checkbox control.                                                   |
| `size`          | `CheckboxSize`        | "md"      | Size of the control and of form control labels (`2xs` … `2xl`, same scale as `FormField`). |
| `slots`         | `CheckboxSlots`       | —         | Chrome slots and the control slot.                                                         |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

FormControl, Radio, Switch
