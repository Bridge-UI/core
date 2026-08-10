# BridgeUIProvider

Root provider for theme, locale, direction, breakpoints, icon/i18n/date adapters, and component registry defaults.

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

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …). Optional `normalize` converts library-native values (e.g. Font Awesome definitions) so `<Icon :icon="faCoffee" />` works. Ready samples in `packages/vue/docs/examples/` (Lucide, Heroicons, Tabler, Phosphor, Font Awesome).

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { createLucideIconAdapter } from "@examples/icon-lucide";

const icons = createLucideIconAdapter();

app.use(
  createBridgeUI({
    global: { icons },
  }),
);
```

### i18n adapter

Provide `global.i18n` to translate Bridge chrome strings (`"Close"`, `"Hide password"`, …). Lookup is gettext-style (source English text is the key). Without an adapter, the source string is used. `setLocale` updates Bridge `locale` and calls optional `i18n.setLocale` (vue-i18n / i18next / dictionary). Persistence (localStorage, backend) stays in the app. Ready samples in `packages/vue/docs/examples/` (dictionary, vue-i18n). See [I18n](./I18n.md).

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { createDictionaryI18nAdapter } from "@examples/i18n-dictionary";

const i18n = createDictionaryI18nAdapter();

app.use(
  createBridgeUI({
    global: { i18n },
  }),
);
```

### Date adapter

Provide `global.dates` to replace the native `Date` adapter used by calendars and pickers. Without one, Bridge uses `createNativeDateAdapter`. Ready samples in `packages/vue/docs/examples/` (Day.js, date-fns, Luxon, Moment).

```ts
import { createBridgeUI } from "@bridge-ui/vue";
import { createDayjsDateAdapter } from "@examples/date-dayjs";

const dates = createDayjsDateAdapter();

app.use(
  createBridgeUI({
    global: { dates },
  }),
);
```

### Form density defaults

Set `global.formDefaults` to apply shared `size` / `rounded` to form controls (TextField, Select, Checkbox, Slider, OtpField, …). Does not affect Button, Progress, Modal, etc.

Merge order: instance props → `components.{Name}.defaultProps` → `formDefaults` → library defaults.

Radio and Switch receive `size` only — their `rounded` stays shape-driven (`full`) unless overridden per component.

```ts
import { createBridgeUI } from "@bridge-ui/vue";

app.use(
  createBridgeUI({
    global: {
      formDefaults: { size: "lg", rounded: "md" },
    },
  }),
);
```

### Nested chrome tokens

Building blocks (`FormField`, `FormControl`, `BaseField`, `Listbox`) are not registry keys. Theme chrome under the public parent:

```ts
app.use(
  createBridgeUI({
    components: {
      Slider: {
        tokens: {
          baseField: {
            size: { md: { text: "text-base", group: "gap-3" } },
          },
        },
      },
      Checkbox: {
        tokens: {
          formControl: {
            invalidated: {
              errorMessage: "text-error-700 dark:text-error-300",
            },
          },
        },
      },
      Select: {
        tokens: {
          listbox: {
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
      },
    },
  }),
);
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
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                                                      |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `mobileBreakpoint`, `breakpoints`, `icons`, `i18n`, `dates`, `formDefaults` |

App content is passed via the **default slot** (see Usage above).

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`, `setLocale`, `setTheme`, `setDirection`

## Related components

All components
