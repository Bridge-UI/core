# Badge

Small label for counts, status, or tags.

## Import

```vue
import { Badge } from "@bridge-ui/vue/Components/Badge";
```

## Examples

### Default

```vue
<Badge color="primary">"P"</Badge>
<Badge variant="flat">F</Badge>
<Badge size="2xs">2</Badge>
<Badge rounded="none">1</Badge>
```

### Mini

```vue
<Badge density="mini" color="primary">"P"</Badge>
<Badge density="mini" variant="flat">F</Badge>
<Badge density="mini" size="2xs">2</Badge>
<Badge density="mini" rounded="none">1</Badge>
```

### Variants (primary)

```vue
<Badge variant="flat">Flat</Badge>
<Badge variant="solid">Solid</Badge>
<Badge variant="outline">Outline</Badge>
```

### Sizes

```vue
<Badge size="2xs">2xs</Badge>
<Badge size="xs">xs</Badge>
<Badge size="sm">sm</Badge>
<Badge size="md">md</Badge>
<Badge size="lg">lg</Badge>
<Badge size="xl">xl</Badge>
<Badge size="2xl">2xl</Badge>
```

### Custom classes

```vue
<Badge color="primary" class="tracking-widest uppercase shadow-md">
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
