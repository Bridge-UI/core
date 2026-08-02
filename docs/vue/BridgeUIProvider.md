# BridgeUIProvider

Root provider for theme, locale, direction, breakpoints, icon adapter, and component registry defaults.

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

### Icon adapter

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …). Ready samples in `examples/adapters/vue/` (Lucide, Heroicons, Tabler, Phosphor, Font Awesome).

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { createLucideIconAdapter } from "@examples/adapters/vue/icon-lucide";

const icons = createLucideIconAdapter();

app.use(
  createBridgeUI({
    global: { icons },
  }),
);
```

### Runtime updates

```ts
const { setGlobal, setComponents } = useBridgeUI();

setGlobal({ locale: "pt-BR", theme: "dark" });
```

## Props

| Prop         | Type                       | Default | Description                                                                |
| ------------ | -------------------------- | ------- | -------------------------------------------------------------------------- |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                     |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `mobileBreakpoint`, `breakpoints`, `icons` |

App content is passed via the **default slot** (see Usage above).

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
