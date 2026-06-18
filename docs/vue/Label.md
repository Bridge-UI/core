# Label

Accessible label element with required and error styling.

## Import

```ts
import { Label } from "@bridge-ui/vue/Components/Label";
```

## Examples

### Usage

```vue
<Label for="email" required>Email</Label>
```

## Props

| Prop       | Type           | Default | Description                                         |
| ---------- | -------------- | ------- | --------------------------------------------------- |
| `classes`  | `LabelClasses` | —       | The classes to apply to the label.                  |
| `error`    | `boolean`      | `false` | Applies error label colors.                         |
| `for`      | `string`       | —       | Associates the label with a form control.           |
| `required` | `boolean`      | `false` | Shows a red required asterisk after the label text. |
| `size`     | `LabelSize`    | "md"    | Typography scale aligned with TextField sizes.      |

## Related components

FormField, FormControl
