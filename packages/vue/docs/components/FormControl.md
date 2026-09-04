# FormControl

> Building block for toggle-row chrome. Prefer `Checkbox`, `Radio`, and `Switch` in apps; FormControl remains exported for advanced composition. Theme shared chrome via `components.FormControl`; override per public control (`components.Checkbox`, …).

Low-level form control chrome (labels, description, error) for Checkbox, Radio, and Switch.

Control tokens stay on the parent (`tokens.color`, …).

## Import

```ts
import { FormControl } from "@bridge-ui/vue";
```

## Examples

### Usage

```vue
<FormControl
  end-label="Email notifications"
  description="Receive product updates."
>
  <Checkbox :default-checked="true" />
</FormControl>
```

### customProps

```vue
<FormControl
  end-label="Email notifications"
  description="Receive product updates."
  :custom-props="{
    root: { id: 'notify-control' },
    endLabel: { id: 'notify-label' },
    description: { id: 'notify-desc', 'aria-live': 'polite' },
  }"
>
  <Checkbox :default-checked="true" />
</FormControl>
```

## Props

| Prop               | Type                     | Default | Description                                                                                                                          |
| ------------------ | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `classes`          | `FormControlClasses`     | —       | Classes for labels, description, error, and layout chrome.                                                                           |
| `controlId`        | `string`                 | —       | Associates labels and helper text with a form control. When omitted, an id is generated automatically.                               |
| `customProps`      | `FormControlCustomProps` | —       | Extra props for internal parts (`row`, `endLabel`, `description`, …).                                                                |
| `description`      | `string`                 | —       | Helper text below the control row (hidden when invalid).                                                                             |
| `disabled`         | `boolean`                | `false` | Whether the control is disabled.                                                                                                     |
| `endLabel`         | `string`                 | —       | Inline-end label after the control (right in LTR, left in RTL).                                                                      |
| `error`            | `boolean`                | `false` | When `true`, applies invalid styling on labels and hides description.                                                                |
| `errorMessage`     | `string`                 | —       | Error message below the control row.                                                                                                 |
| `field`            | `UseFormControlReturn`   | —       | Pre-composed form control API from a parent composable. Used by `<FormControl :field="…" />`; not set on Checkbox, Radio, or Switch. |
| `hideErrorMessage` | `boolean`                | `false` | When `true`, does not reserve space below the row for error messages.                                                                |
| `readonly`         | `boolean`                | `false` | Whether the control is read-only.                                                                                                    |
| `required`         | `boolean`                | `false` | Sets the native `required` attribute on the control and shows a required asterisk on labels.                                         |
| `size`             | `LabelSize`              | "md"    | Typography scale for labels, description, and error text (aligned with `FormField` / `Label`).                                       |
| `slots`            | `FormControlSlots`       | —       | Chrome slots (`startLabel`, `endLabel`, `description`, `errorMessage`, …) and the control.                                           |
| `startLabel`       | `string`                 | —       | Inline-start label before the control (left in LTR, right in RTL).                                                                   |

## Related components

Checkbox, Radio, Switch, Label
