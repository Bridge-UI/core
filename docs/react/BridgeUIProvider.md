# BridgeUIProvider

Root provider for theme, locale, direction, and component registry defaults.

## Import

```tsx
import { BridgeUIProvider, useBridgeUI } from "@bridge-ui/react";
```

## Examples

### Usage

```tsx
<BridgeUIProvider
  global={{ theme: "light", locale: "en-US", direction: "ltr" }}
>
  <App />
</BridgeUIProvider>
```

### Runtime updates

```tsx
const { setGlobal, setComponents } = useBridgeUI();

setGlobal({ locale: "pt-BR", theme: "dark" });
```

## Props

| Prop         | Type                       | Default | Description                    |
| ------------ | -------------------------- | ------- | ------------------------------ |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults         |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction` |

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
