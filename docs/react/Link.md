# Link

Styled anchor for in-app and external navigation.

## Import

```tsx
import { Link } from "@bridge-ui/react/Components/Link";
```

## Examples

### Default

```tsx
<Link href="/react/alert">Go to Alert</Link>

<Link href="#" color="primary">
  Primary Link
</Link>

<Link href="#" size="2xs">
  2xs link
</Link>
```

### Underline

```tsx
<Link href="#" underline="always">
  Always
</Link>
<Link href="#" underline="hover">
  Hover
</Link>
<Link href="#" underline="none">
  None
</Link>
```

### States

```tsx
<Link href="/react/button" disabled>
  Disabled
</Link>
<Link href="https://example.com" external>
  External
</Link>
```

### Icons

```tsx
<Link href="#" leftIcon={Info}>
  Left icon
</Link>
<Link href="#" rightIcon={ArrowRight}>
  Right icon
</Link>
<Link href="#" leftIcon={Info} rightIcon={ExternalLink}>
  Both icons
</Link>
```

### Slots

```tsx
<Link
  href="#"
  slots={{
    append: <span className="text-xs opacity-80">▶</span>,
    prepend: <span className="text-xs opacity-80">◀</span>,
  }}
>
  With slots
</Link>
```

### Custom classes

```tsx
<Link href="#" className="font-semibold italic">
  Styled link
</Link>
```

### customProps

```tsx
<Link
  href="#"
  leftIcon={ExternalLink}
  customProps={{
    leftIcon: { "aria-hidden": true },
    root: { id: "docs-link", target: "_blank", rel: "noopener noreferrer" },
  }}
>
  Open documentation
</Link>
```

## Props

| Prop                     | Type                            | Default     | Description            |
| ------------------------ | ------------------------------- | ----------- | ---------------------- |
| `color`                  | `Color`                         | `"primary"` | Link color             |
| `disabled`               | `boolean`                       | `false`     | Disabled link          |
| `external`               | `boolean`                       | `false`     | Opens in new tab + rel |
| `href`                   | `string`                        | —           | Link URL               |
| `leftIcon` / `rightIcon` | `LucideIcon`                    | —           | Icons                  |
| `size`                   | `Size`                          | `"md"`      | Text size              |
| `underline`              | `"hover" \| "always" \| "none"` | `"hover"`   | Underline behavior     |

## Related components

Button
