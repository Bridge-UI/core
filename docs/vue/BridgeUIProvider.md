# BridgeUIProvider

Root provider for theme, locale, direction, and component registry defaults.

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
    direction: 'ltr',
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

| Prop         | Type                       | Default | Description                    |
| ------------ | -------------------------- | ------- | ------------------------------ |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults         |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction` |

App content is passed via the **default slot** (see Usage above).

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
