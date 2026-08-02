# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` (`global.icons`). Bridge does not ship a default set — copy an example from `examples/adapters/react/`.

## Import

```ts
import { Icon } from "@bridge-ui/react/Components/Icon";
```

## Examples

### Icon component

```ts
import { Info } from "lucide-react";
```

```tsx
<Icon size="md" icon={Info} />
```

### Semantic name + adapter

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createLucideIconAdapter } from "@examples/adapters/react/icon-lucide";

const icons = createLucideIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <Icon size="md" icon="info" />
</BridgeUIProvider>
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
import { wrapFaIcon } from "@examples/adapters/react/icon-fontawesome";

const CoffeeIcon = wrapFaIcon(faCoffee);
```

```tsx
<Icon icon={CoffeeIcon} />
```

## Props

| Prop   | Type         | Default | Description                      |
| ------ | ------------ | ------- | -------------------------------- |
| `icon` | `IconSource` | —       | Semantic name or icon component. |
| `size` | `IconSize`   | "md"    | The size of the icon.            |

## Related components

Button, Alert, TextField, BridgeUIProvider
