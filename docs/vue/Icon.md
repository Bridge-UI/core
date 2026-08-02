# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` / `createBridgeUI` (`global.icons`). Bridge does not ship a default set — copy an example from `examples/adapters/vue/`.

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
import { createBridgeUI } from "@bridge-ui/vue";
import { createLucideIconAdapter } from "@examples/adapters/vue/icon-lucide";

const icons = createLucideIconAdapter();

app.use(
  createBridgeUI({
    global: { icons },
  }),
);
```

```vue
<Icon size="md" icon="info" />
```

Other ready examples (same `create*IconAdapter()` shape):

| File                  | Library                     |
| --------------------- | --------------------------- |
| `icon-lucide.ts`      | Lucide                      |
| `icon-heroicons.ts`   | Heroicons (24 outline)      |
| `icon-tabler.ts`      | Tabler Icons                |
| `icon-phosphor.ts`    | Phosphor Icons              |
| `icon-fontawesome.ts` | Font Awesome 6 (free solid) |

Font Awesome exports definitions, not components. The example also exports `wrapFaIcon` for ad-hoc icons:

```ts
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { wrapFaIcon } from "@examples/adapters/vue/icon-fontawesome";

const CoffeeIcon = wrapFaIcon(faCoffee);
```

```vue
<Icon :icon="CoffeeIcon" />
```

## Props

| Prop   | Type         | Default | Description                      |
| ------ | ------------ | ------- | -------------------------------- |
| `icon` | `IconSource` | —       | Semantic name or icon component. |
| `size` | `IconSize`   | "md"    | The size of the icon.            |

## Related components

Button, Alert, TextField, BridgeUIProvider
