# BridgeUIProvider

Root provider for theme, locale, direction, and component registry defaults.

## Import

```vue
import { BridgeUIProvider, useBridgeUI } from "@bridge-ui/vue";
```

## Examples

### Usage

```vue
<BridgeUIProvider
  :global="{
    theme: 'light',
    locale: 'en-US',
    direction: 'ltr',
  }"
>
  <App />
</BridgeUIProvider>
```

### Runtime updates

```vue
const { setGlobal, setComponents } = useBridgeUI(); setGlobal({ locale: "pt-BR",
theme: "dark" });
```

## Props

| Prop         | Type                       | Default | Description                    |
| ------------ | -------------------------- | ------- | ------------------------------ |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults         |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction` |

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
