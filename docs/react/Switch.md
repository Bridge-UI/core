# Switch

Toggle switch. Extends FormControl props.

## Import

```tsx
import { Switch } from "@bridge-ui/react/Components/Switch";
```

## Examples

### Usage

```tsx
<Switch
  mainLabel="Dark mode"
  description="Use dark theme across the app."
/>

<Switch
  checked={enabled}
  mainLabel="Enable notifications"
  onChange={(event) => setEnabled(event.target.checked)}
/>
```

### Required and error

```tsx
<Switch required mainLabel="Required field" />

<Switch
  error
  mainLabel="Invalid option"
  errorMessage="You must enable this setting."
/>
```

### customProps

```tsx
<Switch
  mainLabel="Airplane mode"
  customProps={{
    input: { name: "airplane" },
    control: { "data-testid": "airplane-switch" },
  }}
/>
```

## Props

### Switch-specific

| Prop          | Type                | Default     | Description              |
| ------------- | ------------------- | ----------- | ------------------------ |
| `checked`     | `boolean`           | —           | Controlled checked state |
| `classes`     | `SwitchClasses`     | —           | Per-part classes         |
| `color`       | `Color`             | `"primary"` | Accent color             |
| `customProps` | `SwitchCustomProps` | —           | Props for internal parts |
| `rounded`     | `Rounded`           | `"full"`    | Track radius             |
| `size`        | `Size`              | `"md"`      | Control size             |
| `slots`       | `SwitchSlots`       | —           | FormControl slots        |

### Inherited from FormControl

| Prop                  | Type      | Default | Description                 |
| --------------------- | --------- | ------- | --------------------------- |
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

Checkbox, FormControl
