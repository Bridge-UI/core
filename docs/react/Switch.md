# Switch

Toggle switch. Extends FormControl props.

## Import

```ts
import { Switch } from "@bridge-ui/react/Components/Switch";
```

## Examples

### Usage

```tsx
<Switch
  endLabel="Dark mode"
  description="Use dark theme across the app."
/>

<Switch
  checked={enabled}
  endLabel="Enable notifications"
  onChange={(event) => setEnabled(event.target.checked)}
/>
```

### Required and error

```tsx
<Switch
  required
  endLabel="Required field"
/>

<Switch
  error
  endLabel="Invalid option"
  errorMessage="You must enable this setting."
/>
```

### customProps

```tsx
<Switch
  endLabel="Airplane mode"
  customProps={{
    input: { name: "airplane" },
    control: { "data-testid": "airplane-switch" },
  }}
/>
```

## Props

### Switch-specific

| Prop          | Type                | Default   | Description                                                                                |
| ------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `classes`     | `SwitchClasses`     | —         | Classes for the form control chrome and the switch control.                                |
| `color`       | `SwitchColor`       | "primary" | The color to apply to the switch.                                                          |
| `customProps` | `SwitchCustomProps` | —         | Extra props for internal parts.                                                            |
| `rounded`     | `SwitchRounded`     | "full"    | The roundedness of the switch track.                                                       |
| `size`        | `SwitchSize`        | "md"      | Size of the control and of form control labels (`2xs` … `2xl`, same scale as `FormField`). |
| `slots`       | `SwitchSlots`       | —         | Chrome slots and the control slot.                                                         |

### Binding

| Prop       | Type                                   | Default | Description                                                         |
| ---------- | -------------------------------------- | ------- | ------------------------------------------------------------------- |
| `checked`  | `boolean`                              | —       | Whether the switch is on. Use with `onChange` for controlled state. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | —       | Native input change handler.                                        |

### Inherited from FormControl

See [FormControl](./FormControl.md).

## Related components

Checkbox, FormControl
