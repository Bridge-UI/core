# Link

Styled anchor for in-app and external navigation.

## Import

```vue
import { Link } from "@bridge-ui/vue/Components/Link";
```

## Examples

### Usage

```vue
<Link href="/dashboard">Dashboard</Link>

<Link href="https://example.com" color="primary" underline="hover">
  External link
</Link>

<Link href="#" :left-icon="Info">
  With icon
</Link>
```

### States

```vue
<Link href="/button" disabled>
  Disabled
</Link>

<Link href="https://example.com" external>
  External
</Link>
```

### customProps

```vue
<Link
  href="#"
  :left-icon="ExternalLink"
  :custom-props="{
    leftIcon: { 'aria-hidden': true },
    root: { id: 'docs-link', target: '_blank', rel: 'noopener noreferrer' },
  }"
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
