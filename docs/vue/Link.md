# Link

Styled anchor for in-app and external navigation.

## Import

```vue
import { Link } from "@bridge-ui/vue/Components/Link";
```

## Examples

### Default

```vue
<Link href="/vue/alert">Go to Alert</Link>

<Link href="#" color="primary">
  Primary Link
</Link>

<Link href="#" size="2xs">
  2xs link
</Link>
```

### Underline

```vue
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

```vue
<Link href="/vue/button" disabled>
  Disabled
</Link>
<Link href="https://example.com" external>
  External
</Link>
```

### Icons

```vue
<Link href="#" :left-icon="Info">
  Left icon
</Link>
<Link href="#" :right-icon="ArrowRight">
  Right icon
</Link>
<Link href="#" :left-icon="Info" :right-icon="ExternalLink">
  Both icons
</Link>
```

### Slots

```vue
<Link href="#">
  <template #prepend>
    <span class="text-xs opacity-80">◀</span>
  </template>

  With slots

  <template #append>
    <span class="text-xs opacity-80">▶</span>
  </template>
</Link>
```

### Custom classes

```vue
<Link href="#" class="font-semibold italic">
  Styled link
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
