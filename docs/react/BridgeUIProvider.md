# BridgeUIProvider

Root provider for theme, locale, direction, breakpoints, icon adapter, and component registry defaults.

## Import

```ts
import { BridgeUIProvider, useBridgeUI } from "@bridge-ui/react";
```

## Examples

### Usage

```tsx
<BridgeUIProvider
  global={{
    theme: "light",
    locale: "en-US",
    breakpoints: {},
    direction: "ltr",
    mobileBreakpoint: "sm",
  }}
>
  <App />
</BridgeUIProvider>
```

### Icon adapter

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …). Optional `normalize` converts library-native values (e.g. Font Awesome definitions) so `<Icon icon={faCoffee} />` works. Ready samples in `examples/adapters/react/` (Lucide, Heroicons, Tabler, Phosphor, Font Awesome).

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createLucideIconAdapter } from "@examples/adapters/react/icon-lucide";

const icons = createLucideIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <App />
</BridgeUIProvider>
```

### Runtime updates

```ts
const { setGlobal, setComponents } = useBridgeUI();

setGlobal({ locale: "pt-BR", theme: "dark" });
```

## Props

| Prop         | Type                       | Default | Description                                                                |
| ------------ | -------------------------- | ------- | -------------------------------------------------------------------------- |
| `children`   | `ReactNode`                | —       | App tree rendered inside the provider                                      |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                     |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `mobileBreakpoint`, `breakpoints`, `icons` |

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
