# FormControl

Low-level form control chrome (labels, description, error) for Checkbox, Radio, and Switch.

## Import

```tsx
import { FormControl } from "@bridge-ui/react/Components/FormControl";
```

## Examples

### Usage

```tsx
<FormControl
  mainLabel="Email notifications"
  description="Receive product updates."
>
  <Checkbox defaultChecked />
</FormControl>
```

### customProps

```tsx
<FormControl
  mainLabel="Email notifications"
  description="Receive product updates."
  customProps={{
    root: { id: "notify-control" },
    mainLabel: { id: "notify-label" },
    description: { id: "notify-desc", "aria-live": "polite" },
  }}
>
  <Checkbox defaultChecked />
</FormControl>
```

## Props

| Prop           | Type      | Default | Description                 |
| -------------- | --------- | ------- | --------------------------- |
| `description`  | `string`  | —       | Helper text                 |
| `disabled`     | `boolean` | `false` | Disabled                    |
| `endLabel`     | `string`  | —       | Label at the end of the row |
| `error`        | `boolean` | `false` | Error state                 |
| `errorMessage` | `string`  | —       | Error message               |
| `mainLabel`    | `string`  | —       | Label after the control     |
| `readonly`     | `boolean` | `false` | Read-only                   |
| `required`     | `boolean` | `false` | Required                    |
| `size`         | `Size`    | `"md"`  | Control size                |
| `startLabel`   | `string`  | —       | Label before the control    |

## Related components

Checkbox, Radio, Switch, Label
