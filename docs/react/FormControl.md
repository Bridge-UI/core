# FormControl

Low-level form control chrome (labels, description, error) for Checkbox, Radio, and Switch.

## Import

```ts
import { FormControl } from "@bridge-ui/react/Components/FormControl";
```

## Examples

### Usage

```tsx
<FormControl
  endLabel="Email notifications"
  description="Receive product updates."
>
  <Checkbox defaultChecked />
</FormControl>
```

### customProps

```tsx
<FormControl
  endLabel="Email notifications"
  description="Receive product updates."
  customProps={{
    root: { id: "notify-control" },
    endLabel: { id: "notify-label" },
    description: { id: "notify-desc", "aria-live": "polite" },
  }}
>
  <Checkbox defaultChecked />
</FormControl>
```

## Props

| Prop                  | Type                     | Default | Description                                                                                                                         |
| --------------------- | ------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `children`            | `ReactNode`              | —       | The form control rendered inside the form control row.                                                                              |
| `classes`             | `FormControlClasses`     | —       | Classes for labels, description, error, and layout chrome.                                                                          |
| `controlId`           | `string`                 | —       | Associates labels and helper text with a form control. When omitted, an id is generated automatically.                              |
| `customProps`         | `FormControlCustomProps` | —       | Extra props for internal parts (`row`, `endLabel`, `description`, …).                                                               |
| `description`         | `string`                 | —       | Helper text below the control row (hidden when invalid).                                                                            |
| `disabled`            | `boolean`                | `false` | Whether the control is disabled.                                                                                                    |
| `endLabel`            | `string`                 | —       | Inline-end label after the control (flips to the start side in RTL).                                                                |
| `error`               | `boolean`                | `false` | When `true`, applies invalid styling on labels and hides description.                                                               |
| `errorMessage`        | `string`                 | —       | Error message below the control row.                                                                                                |
| `field`               | `UseFormControlReturn`   | —       | Pre-composed form control API from a parent composable. Used by `<FormControl field={…} />`; not set on Checkbox, Radio, or Switch. |
| `readonly`            | `boolean`                | `false` | Whether the control is read-only.                                                                                                   |
| `required`            | `boolean`                | `false` | Sets the native `required` attribute on the control.                                                                                |
| `size`                | `LabelSize`              | "md"    | Typography scale for labels, description, and error text (aligned with `FormField` / `Label`).                                      |
| `slots`               | `FormControlSlots`       | —       | Chrome slots (`startLabel`, `endLabel`, `description`, `errorMessage`, …) and the control.                                          |
| `startLabel`          | `string`                 | —       | Inline-start label before the control (flips to the end side in RTL).                                                               |
| `withoutErrorMessage` | `boolean`                | `false` | When `true`, does not reserve space below the row for error messages.                                                               |

## Related components

Checkbox, Radio, Switch, Label
