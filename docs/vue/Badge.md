# Badge

Small label for counts, status, or tags.

## Import

```ts
import { Badge } from "@bridge-ui/vue/Components/Badge";
```

## Examples

### Usage

```vue
<Badge>New</Badge>

<Badge density="mini">3</Badge>

<Badge color="success" variant="flat">
  Active
</Badge>
```

### Custom classes

```vue
<Badge color="primary" class="tracking-widest uppercase shadow-md">
  Styled
</Badge>
```

## Props

| Prop      | Type           | Default   | Description                        |
| --------- | -------------- | --------- | ---------------------------------- |
| `classes` | `BadgeClasses` | —         | The classes to apply to the badge. |
| `color`   | `BadgeColor`   | "primary" | The color to apply to the badge.   |
| `density` | `BadgeDensity` | "default" | The density of the badge.          |
| `full`    | `boolean`      | `false`   | Whether the badge is full width.   |
| `rounded` | `BadgeRounded` | "md"      | The roundedness of the badge.      |
| `size`    | `BadgeSize`    | "sm"      | The size of the badge.             |
| `variant` | `BadgeVariant` | "flat"    | The variant of the badge.          |

## Related components

Button
