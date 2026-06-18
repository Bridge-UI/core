# Icon

Renders a Lucide icon with design-system sizing.

## Import

```ts
import { Icon } from "@bridge-ui/vue/Components/Icon";
```

## Examples

### Usage

```ts
import { Info } from "lucide-vue-next";
```

```vue
<Icon size="md" :icon="Info" />
```

## Props

| Prop   | Type         | Default | Description            |
| ------ | ------------ | ------- | ---------------------- |
| `icon` | `LucideIcon` | —       | Lucide icon component. |
| `size` | `IconSize`   | "md"    | The size of the icon.  |

## Related components

Button, Alert, TextField
