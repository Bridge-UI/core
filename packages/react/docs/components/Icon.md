# Icon

Renders an icon from a semantic name (via the icon adapter) or a concrete icon component, with design-system sizing.

Semantic names require an icon adapter on `BridgeUIProvider` (`global.icons`). Bridge only defines the `IconAdapter` interface — copy an example from `packages/react/docs/examples/`.

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
import { createLucideIconAdapter } from "@examples/icon-lucide";

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

### Font Awesome definitions

With the Font Awesome adapter, pass definitions directly — `normalize` wraps them:

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { createFontAwesomeIconAdapter } from "@examples/icon-fontawesome";

const icons = createFontAwesomeIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <Icon icon={faCoffee} />
  <Icon icon="info" />
</BridgeUIProvider>
```

The example also exports `wrapFaIcon` if you need a component outside `<Icon />`.

## Props

| Prop   | Type         | Default | Description                                                                  |
| ------ | ------------ | ------- | ---------------------------------------------------------------------------- |
| `icon` | `IconSource` | —       | Semantic name, icon component, or adapter-normalized native value (e.g. FA). |
| `size` | `IconSize`   | "md"    | The size of the icon.                                                        |

## Related components

Button, Alert, TextField, BridgeUIProvider
