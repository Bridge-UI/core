# BridgeUIProvider

Root provider for theme, locale, direction, breakpoints, and component registry defaults.

## Import

```ts
import { BridgeUIProvider, useBridgeUI } from "@bridge-ui/vue";
```

## Examples

### Usage

```vue
<BridgeUIProvider
  :global="{
    theme: 'light',
    locale: 'en-US',
    breakpoints: {},
    direction: 'ltr',
    mobileBreakpoint: 'sm',
  }"
>
  <App />
</BridgeUIProvider>
```

### Runtime updates

```ts
const { setGlobal, setComponents } = useBridgeUI();

setGlobal({ locale: "pt-BR", theme: "dark" });
```

## Props

| Prop         | Type                       | Default | Description                                                       |
| ------------ | -------------------------- | ------- | ----------------------------------------------------------------- |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                            |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `mobileBreakpoint`, `breakpoints` |

App content is passed via the **default slot** (see Usage above).

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
