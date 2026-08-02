# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` (`global.icons`). Bridge does not ship a default set — see `examples/adapters/react/icon-lucide.ts`.

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
import { createIconAdapter } from "@bridge-ui/core";
import { BridgeUIProvider } from "@bridge-ui/react";
import { Info, X } from "lucide-react";

const icons = createIconAdapter({
  // …map every SemanticIconName — see examples/adapters/react/icon-lucide.ts
  info: Info,
  clear: X,
});
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <Icon icon="info" />
</BridgeUIProvider>
```

## Props

| Prop   | Type         | Default | Description                      |
| ------ | ------------ | ------- | -------------------------------- |
| `icon` | `IconSource` | —       | Semantic name or icon component. |
| `size` | `IconSize`   | "md"    | The size of the icon.            |

## Related components

Button, Alert, TextField, BridgeUIProvider
