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

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …). Optional `normalize` converts library-native values (e.g. Font Awesome definitions) so `<Icon icon={faCoffee} />` works. Ready adapters: `@bridge-ui/react/Adapters/Examples/icon-lucide` (and `icon-heroicons`, `icon-tabler`, `icon-phosphor`, `icon-fontawesome`). Install the matching icon library next to `@bridge-ui/react`.

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createLucideIconAdapter } from "@bridge-ui/react/Adapters/Examples/icon-lucide";

const icons = createLucideIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <App />
</BridgeUIProvider>
```

### i18n adapter

Provide `global.i18n` to translate Bridge chrome strings (`"Close"`, `"Hide password"`, …). Lookup is gettext-style (source English text is the key). Without an adapter, the source string is used. `setLocale` updates Bridge `locale` and calls optional `i18n.setLocale` (i18next / vue-i18n / dictionary). Persistence (localStorage, backend) stays in the app. Ready adapters: `@bridge-ui/react/Adapters/Examples/i18n-dictionary` and `Adapters/Examples/i18n-i18next`. See [I18n](./I18n.md).

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createDictionaryI18nAdapter } from "@bridge-ui/react/Adapters/Examples/i18n-dictionary";

const i18n = createDictionaryI18nAdapter();
```

```tsx
<BridgeUIProvider global={{ i18n }}>
  <App />
</BridgeUIProvider>
```

### Date adapter

Provide `global.dates` to replace the native `Date` adapter used by calendars and pickers. Without one, each provider creates its own native `Date` adapter. Ready adapters: `@bridge-ui/react/Adapters/Examples/date-dayjs` (and `date-date-fns`, `date-luxon`, `date-moment`). Install the matching date library next to `@bridge-ui/react`. `setTimeZone` updates Bridge `timeZone` and calls optional `dates.setTimeZone`.

Bridge locales stay `en-US` / `pt-BR`. Native, Luxon, and date-fns already use those tags. Day.js and Moment want ids like `en` / `pt-br` — pass that map to the factory and import the matching locale files.

Day.js IANA zones need `utc` and `timezone` extended in the app. Without `dayjs.tz`, `timeZone` is ignored. The adapter loads `customParseFormat` itself. Moment IANA zones need `moment-timezone` imported in the app. Without `moment.tz`, `timeZone` is ignored. date-fns ignores `timeZone` and keeps the local calendar. Use the native adapter, Luxon, or Day.js when a picker needs an IANA zone.

```ts
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { BridgeUIProvider } from "@bridge-ui/react";
import { createDayjsDateAdapter } from "@bridge-ui/react/Adapters/Examples/date-dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

const dates = createDayjsDateAdapter({
  "en-US": "en",
  "pt-BR": "pt-br",
});
```

```ts
import "moment-timezone";
import { createMomentDateAdapter } from "@bridge-ui/react/Adapters/Examples/date-moment";

const dates = createMomentDateAdapter({
  "en-US": "en",
  "pt-BR": "pt-br",
});
```

```tsx
<BridgeUIProvider global={{ dates }}>
  <App />
</BridgeUIProvider>
```

### Rich-text adapter

Provide `global.richText` when using `RichTextEditor`. There is no native default — mounting without an adapter throws. Ready adapter: `@bridge-ui/react/Adapters/Examples/rich-text-tiptap`. Install the TipTap peers next to `@bridge-ui/react`.

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createTiptapRichTextAdapter } from "@bridge-ui/react/Adapters/Examples/rich-text-tiptap";

const richText = createTiptapRichTextAdapter();
```

```tsx
<BridgeUIProvider global={{ richText }}>
  <App />
</BridgeUIProvider>
```

### Form density defaults

Set `global.formDefaults` to apply shared `size` / `rounded` to form controls (TextField, Select, Checkbox, FileUpload, Slider, OtpField, …). Does not affect Button, Progress, Modal, etc.

Merge order: instance props → `components.{Name}.defaultProps` → chrome (`FormField` / `FormControl` / `BaseField` / `TimePanel`) → `formDefaults` → library defaults.

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

### Shared chrome

`FormField`, `FormControl`, `BaseField`, and `TimePanel` are registry keys. Set them once to theme a family; a public entry still overrides `defaultProps`. Chrome tokens live on the shared key (`components.FormField.tokens`, `components.BaseField.tokens`). Dropdown tokens live on `components.Listbox`. Set `components.Listbox.defaultProps.matchWidth` so Select / Autocomplete menus match the field width. Cancel / Apply in pickers and listboxes live on `components.ActionFooter`.

```tsx
<BridgeUIProvider
  components={{
    FormField: {
      defaultProps: {
        variant: "filled",
        color: "secondary",
      },
    },
    TextField: {
      defaultProps: { variant: "outline" },
    },
    BaseField: {
      tokens: {
        size: { md: { text: "text-base", group: "gap-3" } },
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

```tsx
<BridgeUIProvider
  components={{
    Listbox: {
      defaultProps: { matchWidth: true },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

```tsx
<BridgeUIProvider
  components={{
    ActionFooter: {
      defaultProps: {
        applyColor: "info",
        cancelVariant: "flat",
        cancelColor: "secondary",
      },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

### Runtime updates

```ts
const { setLocale, setTheme, setDirection, setTimeZone, setGlobal } =
  useBridgeUI()!;

setTheme("dark");
setLocale("pt-BR"); // also calls global.i18n.setLocale when present
setDirection("rtl");
setTimeZone("America/Sao_Paulo"); // UI wall clock; value Date is a UTC instant
setGlobal({ mobileBreakpoint: "md" });
```

## Props

| Prop         | Type                       | Default | Description                                                                                                             |
| ------------ | -------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `children`   | `ReactNode`                | —       | App tree rendered inside the provider                                                                                   |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                                                                  |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `timeZone`, `mobileBreakpoint`, `breakpoints`, `icons`, `i18n`, `dates`, `formDefaults` |

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`, `setLocale`, `setTheme`, `setTimeZone`, `setDirection`

## Related components

All components
