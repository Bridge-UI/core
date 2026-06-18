# Icon

Renders a Lucide icon with design-system sizing.

## Import

```vue
import { Icon } from "@bridge-ui/vue/Components/Icon";
```

## Examples

### Usage

```vue
import { Info } from "lucide-vue-next";

<Icon size="md" :icon="Info" />
```

## Props

| Prop   | Type         | Default | Description                 |
| ------ | ------------ | ------- | --------------------------- |
| `icon` | `LucideIcon` | —       | Lucide component (required) |
| `size` | `IconSize`   | `"md"`  | Icon size token             |

## Related components

Button, Alert, TextField
