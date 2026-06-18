# Switch

Toggle switch. Extends FormControl props.

## Import

```vue
import { Switch } from "@bridge-ui/vue/Components/Switch";
```

## Examples

### Usage

```vue
<Switch main-label="Dark mode" description="Use dark theme across the app." />

<Switch v-model="enabled" main-label="Enable notifications" />
```

### Required and error

```vue
<Switch required main-label="Required field" />

<Switch
  error
  main-label="Invalid option"
  error-message="You must enable this setting."
/>
```

### customProps

```vue
<Switch
  main-label="Airplane mode"
  :custom-props="{
    input: { name: 'airplane' },
    control: { 'data-testid': 'airplane-switch' },
  }"
/>
```

## Props

### Switch-specific

| Prop          | Type                | Default     | Description              |
| ------------- | ------------------- | ----------- | ------------------------ |
| `classes`     | `SwitchClasses`     | —           | Per-part classes         |
| `color`       | `Color`             | `"primary"` | Accent color             |
| `customProps` | `SwitchCustomProps` | —           | Props for internal parts |
| `modelValue`  | `boolean`           | —           | Checked state            |
| `rounded`     | `Rounded`           | `"full"`    | Track radius             |
| `size`        | `Size`              | `"md"`      | Control size             |
| `slots`       | `SwitchSlots`       | —           | FormControl slots        |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
