# Label

Accessible label element with required and error styling.

## Import

```tsx
import { Label } from "@bridge-ui/react/Components/Label";
```

## Examples

### Usage

```tsx
<Label htmlFor="email" required>
  Email
</Label>
```

## Props

| Prop       | Type      | Default | Description           |
| ---------- | --------- | ------- | --------------------- |
| `error`    | `boolean` | `false` | Error styling         |
| `htmlFor`  | `string`  | —       | Associated control id |
| `required` | `boolean` | `false` | Required indicator    |
| `size`     | `Size`    | `"md"`  | Label size            |

## Related components

FormField, FormControl
