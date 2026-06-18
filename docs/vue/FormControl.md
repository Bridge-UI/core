# FormControl

Low-level form control chrome (labels, description, error) for Checkbox, Radio, and Switch.

## Import

```vue
import { FormControl } from "@bridge-ui/vue/Components/FormControl";
```

## Examples

### Usage

```vue
<FormControl
  main-label="Email notifications"
  description="Receive product updates."
>
  <Checkbox :default-checked="true" />
</FormControl>
```

### customProps

```vue
<FormControl
  main-label="Email notifications"
  description="Receive product updates."
  :custom-props="{
    root: { id: 'notify-control' },
    mainLabel: { id: 'notify-label' },
    description: { id: 'notify-desc', 'aria-live': 'polite' },
  }"
>
  <Checkbox :default-checked="true" />
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
