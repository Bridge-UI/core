# Label

Accessible label element with required and error styling.

## Import

```vue
import { Label } from "@bridge-ui/vue/Components/Label";
```

## Examples

### Usage

```vue
<Label for="email" required>Email</Label>
```

## Props

| Prop       | Type      | Default | Description           |
| ---------- | --------- | ------- | --------------------- |
| `error`    | `boolean` | `false` | Error styling         |
| `for`      | `string`  | —       | Associated control id |
| `required` | `boolean` | `false` | Required indicator    |
| `size`     | `Size`    | `"md"`  | Label size            |

## Related components

FormField, FormControl
