# Switch

Toggle switch. Extends FormControl props.

## Import

```ts
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

| Prop          | Type                | Default   | Description                                                                                |
| ------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `checked`     | `boolean`           | —         | Whether the switch is on.                                                                  |
| `classes`     | `SwitchClasses`     | —         | Classes for the form control chrome and the switch control.                                |
| `color`       | `SwitchColor`       | "primary" | The color to apply to the switch.                                                          |
| `customProps` | `SwitchCustomProps` | —         | Extra props for internal parts.                                                            |
| `rounded`     | `SwitchRounded`     | "full"    | The roundedness of the switch track.                                                       |
| `size`        | `SwitchSize`        | "md"      | Size of the control and of form control labels (`2xs` … `2xl`, same scale as `FormField`). |
| `slots`       | `SwitchSlots`       | —         | Chrome slots and the control slot.                                                         |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
