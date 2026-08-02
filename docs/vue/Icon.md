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

### Font Awesome definitions

With the Font Awesome adapter, pass definitions directly — `normalize` wraps them:

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { createFontAwesomeIconAdapter } from "@examples/adapters/vue/icon-fontawesome";

const icons = createFontAwesomeIconAdapter();

app.use(
  createBridgeUI({
    global: { icons },
  }),
);
```

```vue
<Icon :icon="faCoffee" />
<Icon icon="info" />
```

The example also exports `wrapFaIcon` if you need a component outside `<Icon />`.

## Props

| Prop   | Type         | Default | Description                                                                  |
| ------ | ------------ | ------- | ---------------------------------------------------------------------------- |
| `icon` | `IconSource` | —       | Semantic name, icon component, or adapter-normalized native value (e.g. FA). |
| `size` | `IconSize`   | "md"    | The size of the icon.                                                        |

## Related components

Button, Alert, TextField, BridgeUIProvider
