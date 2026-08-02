# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` / `createBridgeUI` (`global.icons`). Bridge does not ship a default set — see `examples/adapters/vue/icon-lucide.ts`.

## Import

```ts
import { Icon } from "@bridge-ui/vue/Components/Icon";
```

## Examples

### Icon component

```ts
import { Info } from "@lucide/vue";
```

```vue
<Icon size="md" :icon="Info" />
```

### Semantic name + adapter

```ts
import { createIconAdapter } from "@bridge-ui/core";
import { createBridgeUI } from "@bridge-ui/vue";
import { Info, X } from "@lucide/vue";

const icons = createIconAdapter({
  // …map every SemanticIconName — see examples/adapters/vue/icon-lucide.ts
  info: Info,
  clear: X,
});

app.use(
  createBridgeUI({
    global: { icons },
  }),
);
```

```vue
<Icon icon="info" />
```

## Props

| Prop   | Type         | Default | Description                      |
| ------ | ------------ | ------- | -------------------------------- |
| `icon` | `IconSource` | —       | Semantic name or icon component. |
| `size` | `IconSize`   | "md"    | The size of the icon.            |

## Related components

Button, Alert, TextField, BridgeUIProvider
