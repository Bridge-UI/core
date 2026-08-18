# BridgeUIProvider

Root provider for theme, locale, direction, breakpoints, icon/i18n/date adapters, and component registry defaults.

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

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …). Optional `normalize` converts library-native values (e.g. Font Awesome definitions) so `<Icon icon={faCoffee} />` works. Ready samples in `packages/react/docs/examples/` (Lucide, Heroicons, Tabler, Phosphor, Font Awesome).

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createLucideIconAdapter } from "@examples/icon-lucide";

const icons = createLucideIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <App />
</BridgeUIProvider>
```

### i18n adapter

Provide `global.i18n` to translate Bridge chrome strings (`"Close"`, `"Hide password"`, …). Lookup is gettext-style (source English text is the key). Without an adapter, the source string is used. `setLocale` updates Bridge `locale` and calls optional `i18n.setLocale` (i18next / vue-i18n / dictionary). Persistence (localStorage, backend) stays in the app. Ready samples in `packages/react/docs/examples/` (dictionary, i18next). See [I18n](./I18n.md).

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createDictionaryI18nAdapter } from "@examples/i18n-dictionary";

const i18n = createDictionaryI18nAdapter();
```

```tsx
<BridgeUIProvider global={{ i18n }}>
  <App />
</BridgeUIProvider>
```

### Date adapter

Provide `global.dates` to replace the native `Date` adapter used by calendars and pickers. Without one, Bridge uses `createNativeDateAdapter`. Ready samples in `packages/react/docs/examples/` (Day.js, date-fns, Luxon, Moment).

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createDayjsDateAdapter } from "@examples/date-dayjs";

const dates = createDayjsDateAdapter();
```

```tsx
<BridgeUIProvider global={{ dates }}>
  <App />
</BridgeUIProvider>
```

### Form density defaults

Set `global.formDefaults` to apply shared `size` / `rounded` to form controls (TextField, Select, Checkbox, Slider, OtpField, …). Does not affect Button, Progress, Modal, etc.

Merge order: instance props → `components.{Name}.defaultProps` → `formDefaults` → library defaults.

Radio and Switch receive `size` only — their `rounded` stays shape-driven (`full`) unless overridden per component.

```tsx
<BridgeUIProvider
  global={{
    formDefaults: { size: "lg", rounded: "md" },
  }}
>
  <App />
</BridgeUIProvider>
```

### Nested chrome tokens

Building blocks (`FormField`, `FormControl`, `BaseField`) are not registry keys. Theme chrome under the public parent. Dropdown tokens live on `components.Listbox`:

```tsx
<BridgeUIProvider
  components={{
    Slider: {
      tokens: {
        baseField: {
          size: { md: { text: "text-base", group: "gap-3" } },
        },
      },
    },
    Checkbox: {
      tokens: {
        color: {
          error: {
            checked: "bg-error-700 border-error-700",
          },
        },
      },
    },
    Listbox: {
      tokens: {
        size: {
          md: {
            option: "px-3 py-2 text-sm",
            check: "size-4",
            message: "text-xs",
            primary: "font-medium",
            secondary: "text-xs opacity-70",
          },
        },
      },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

### Runtime updates

```ts
const { setLocale, setTheme, setDirection, setGlobal } = useBridgeUI()!;

setTheme("dark");
setLocale("pt-BR"); // also calls global.i18n.setLocale when present
setDirection("rtl");
setGlobal({ mobileBreakpoint: "md" });
```

## Props

| Prop         | Type                       | Default | Description                                                                                                 |
| ------------ | -------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `children`   | `ReactNode`                | —       | App tree rendered inside the provider                                                                       |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                                                      |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `mobileBreakpoint`, `breakpoints`, `icons`, `i18n`, `dates`, `formDefaults` |

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`, `setLocale`, `setTheme`, `setDirection`

## Related components

All components
