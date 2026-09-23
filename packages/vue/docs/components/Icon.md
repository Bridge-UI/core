# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` / `createBridgeUI` (`global.icons`). Import a ready adapter from `@bridge-ui/vue/Adapters/Examples/icon-*` and install the matching icon library.

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
import { createLucideIconAdapter } from "@bridge-ui/vue/Adapters/Examples/icon-lucide";

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

Other ready adapters (same `create*IconAdapter()` shape):

| Import                                              | Library                     | Peer                           |
| --------------------------------------------------- | --------------------------- | ------------------------------ |
| `@bridge-ui/vue/Adapters/Examples/icon-lucide`      | Lucide                      | `@lucide/vue`                  |
| `@bridge-ui/vue/Adapters/Examples/icon-heroicons`   | Heroicons (24 outline)      | `@heroicons/vue`               |
| `@bridge-ui/vue/Adapters/Examples/icon-tabler`      | Tabler Icons                | `@tabler/icons-vue`            |
| `@bridge-ui/vue/Adapters/Examples/icon-phosphor`    | Phosphor Icons              | `@phosphor-icons/vue`          |
| `@bridge-ui/vue/Adapters/Examples/icon-fontawesome` | Font Awesome 6 (free solid) | `@fortawesome/vue-fontawesome` |

### Font Awesome definitions

With the Font Awesome adapter, pass definitions directly — `normalize` wraps them:

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { createFontAwesomeIconAdapter } from "@bridge-ui/vue/Adapters/Examples/icon-fontawesome";

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

The adapter also exports `wrapFaIcon` if you need a component outside `<Icon />`.

## Props

| Prop   | Type         | Default | Description                                                                  |
| ------ | ------------ | ------- | ---------------------------------------------------------------------------- |
| `icon` | `IconSource` | —       | Semantic name, icon component, or adapter-normalized native value (e.g. FA). |
| `size` | `IconSize`   | "md"    | The size of the icon.                                                        |

## Related components

Button, Alert, TextField, BridgeUIProvider
