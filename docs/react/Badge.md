# Badge

Small label for counts, status, or tags.

## Import

```tsx
import { Badge } from "@bridge-ui/react/Components/Badge";
```

## Examples

### Usage

```tsx
<Badge>New</Badge>

<Badge density="mini">3</Badge>

<Badge color="success" variant="flat">
  Active
</Badge>
```

### Custom classes

```tsx
<Badge color="primary" className="tracking-widest uppercase shadow-md">
  Styled
</Badge>
```

## Props

| Prop      | Type                  | Default     | Description    |
| --------- | --------------------- | ----------- | -------------- |
| `color`   | `Color`               | `"primary"` | Color preset   |
| `density` | `"default" \| "mini"` | `"default"` | Compact pill   |
| `full`    | `boolean`             | `false`     | Full width     |
| `rounded` | `Rounded`             | `"md"`      | Border radius  |
| `size`    | `Size`                | `"sm"`      | Text size      |
| `variant` | `Variant`             | `"flat"`    | Visual variant |

## Related components

Button
