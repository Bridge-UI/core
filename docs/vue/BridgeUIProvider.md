# BridgeUIProvider

Root provider for theme, locale, direction, breakpoints, icon/i18n adapters, and component registry defaults.

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

### i18n adapter

Provide `global.i18n` to translate Bridge chrome strings (`"Close"`, `"Hide password"`, …). Lookup is gettext-style (source English text is the key). Without it, the source string is used. Ready samples in `examples/adapters/vue/` (dictionary, vue-i18n). See [I18n](./I18n.md).

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { createDictionaryI18nAdapter } from "@examples/adapters/vue/i18n-dictionary";

const i18n = createDictionaryI18nAdapter("pt-BR");

app.use(
  createBridgeUI({
    global: { i18n, locale: "pt-BR" },
  }),
);
```

### Runtime updates

```ts
const { setGlobal, setComponents } = useBridgeUI();

setGlobal({ locale: "pt-BR", theme: "dark" });
```

## Props

| Prop         | Type                       | Default | Description                                                                        |
| ------------ | -------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                             |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `mobileBreakpoint`, `breakpoints`, `icons`, `i18n` |

App content is passed via the **default slot** (see Usage above).

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`

## Related components

All components
