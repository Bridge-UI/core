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
    // icons: createLucideIconAdapter(), // see examples/adapters/react/icon-lucide.ts
  }}
>
  <App />
</BridgeUIProvider>
```

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …).

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
