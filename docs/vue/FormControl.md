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

| Prop                  | Type                     | Default | Description                                              |
| --------------------- | ------------------------ | ------- | -------------------------------------------------------- |
| default slot          | —                        | —       | Form control inside the row                              |
| `classes`             | `FormControlClasses`     | —       | Per-part classes (`root`, `row`, labels, description, …) |
| `controlId`           | `string`                 | —       | Associated control id (auto-generated when omitted)      |
| `customProps`         | `FormControlCustomProps` | —       | Props for internal parts                                 |
| `description`         | `string`                 | —       | Helper text below the row (hidden when invalid)          |
| `disabled`            | `boolean`                | `false` | Disabled state                                           |
| `endLabel`            | `string`                 | —       | Inline-end label after the main label                    |
| `error`               | `boolean`                | `false` | Invalid styling on labels; hides description             |
| `errorMessage`        | `string`                 | —       | Error message below the row                              |
| `field`               | `UseFormControlReturn`   | —       | Pre-composed API for `<FormControl :field="…" />` only   |
| `mainLabel`           | `string`                 | —       | Main label next to the control                           |
| `readonly`            | `boolean`                | `false` | Read-only state                                          |
| `required`            | `boolean`                | `false` | Sets native `required` on the control                    |
| `size`                | `LabelSize`              | `"md"`  | Typography scale for labels, description, and error      |
| `slots`               | `FormControlSlots`       | —       | `mainLabel`, `startLabel`, `endLabel`, `description`, …  |
| `startLabel`          | `string`                 | —       | Inline-start label before the control                    |
| `withoutErrorMessage` | `boolean`                | `false` | Do not reserve space below the row for errors            |

## Related components

Checkbox, Radio, Switch, Label
