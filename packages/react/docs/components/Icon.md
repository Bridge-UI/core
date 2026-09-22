# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` (`global.icons`). Import a ready adapter from `@bridge-ui/react/Adapters/Examples/icon-*` and install the matching icon library.

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
import { createLucideIconAdapter } from "@bridge-ui/react/Adapters/Examples/icon-lucide";

const icons = createLucideIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <Icon size="md" icon="info" />
</BridgeUIProvider>
```

Other ready adapters (same `create*IconAdapter()` shape):

| Import                                                | Library                     | Peer                             |
| ----------------------------------------------------- | --------------------------- | -------------------------------- |
| `@bridge-ui/react/Adapters/Examples/icon-lucide`      | Lucide                      | `lucide-react`                   |
| `@bridge-ui/react/Adapters/Examples/icon-heroicons`   | Heroicons (24 outline)      | `@heroicons/react`               |
| `@bridge-ui/react/Adapters/Examples/icon-tabler`      | Tabler Icons                | `@tabler/icons-react`            |
| `@bridge-ui/react/Adapters/Examples/icon-phosphor`    | Phosphor Icons              | `@phosphor-icons/react`          |
| `@bridge-ui/react/Adapters/Examples/icon-fontawesome` | Font Awesome 6 (free solid) | `@fortawesome/react-fontawesome` |

### Font Awesome definitions

With the Font Awesome adapter, pass definitions directly — `normalize` wraps them:

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { createFontAwesomeIconAdapter } from "@bridge-ui/react/Adapters/Examples/icon-fontawesome";

const icons = createFontAwesomeIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <Icon icon={faCoffee} />
  <Icon icon="info" />
</BridgeUIProvider>
```

The adapter also exports `wrapFaIcon` if you need a component outside `<Icon />`.

## Props

| Prop   | Type         | Default | Description                                                                  |
| ------ | ------------ | ------- | ---------------------------------------------------------------------------- |
| `icon` | `IconSource` | —       | Semantic name, icon component, or adapter-normalized native value (e.g. FA). |
| `size` | `IconSize`   | "md"    | The size of the icon.                                                        |

## Related components

Button, Alert, TextField, BridgeUIProvider
