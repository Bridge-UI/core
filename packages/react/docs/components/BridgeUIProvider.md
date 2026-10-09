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

Provide `global.icons` when using semantic icon names (`"clear"`, `"check"`, …). Optional `normalize` converts library-native values (e.g. Font Awesome definitions) so `<Icon icon={faCoffee} />` works. Ready adapters: `@bridge-ui/adapters/react/icon-lucide` (and `icon-heroicons`, `icon-tabler`, `icon-phosphor`, `icon-fontawesome`). Install `@bridge-ui/adapters` and the matching icon library.

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createLucideIconAdapter } from "@bridge-ui/adapters/react/icon-lucide";

const icons = createLucideIconAdapter();
```

```tsx
<BridgeUIProvider global={{ icons }}>
  <App />
</BridgeUIProvider>
```

### i18n adapter

Provide `global.i18n` to translate Bridge chrome strings (`"Close"`, `"Hide password"`, …). Lookup is gettext-style (source English text is the key). Without an adapter, the source string is used. `setLocale` updates Bridge `locale` and calls optional `i18n.setLocale` (i18next / vue-i18n / dictionary). Persistence (localStorage, backend) stays in the app. Ready adapters: `@bridge-ui/adapters/react/i18n-dictionary` and `@bridge-ui/adapters/react/i18n-i18next`. See [I18n](./I18n.md).

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createDictionaryI18nAdapter } from "@bridge-ui/adapters/react/i18n-dictionary";

const i18n = createDictionaryI18nAdapter();
```

```tsx
<BridgeUIProvider global={{ i18n }}>
  <App />
</BridgeUIProvider>
```

### Date adapter

Provide `global.dates` to replace the native `Date` adapter used by calendars and pickers. Without one, each provider creates its own native `Date` adapter. Ready adapters: `@bridge-ui/adapters/react/date-dayjs` (and `date-date-fns`, `date-luxon`, `date-moment`). Install `@bridge-ui/adapters` and the matching date library. `setTimeZone` updates Bridge `timeZone` and calls optional `dates.setTimeZone`.

Bridge locales stay `en-US` / `pt-BR`. Native, Luxon, and date-fns already use those tags. Day.js and Moment want ids like `en` / `pt-br` — pass that map to the factory and import the matching locale files.

Day.js IANA zones need `utc` and `timezone` extended in the app. Without `dayjs.tz`, `timeZone` is ignored. The adapter loads `customParseFormat` itself. Moment IANA zones need `moment-timezone` imported in the app. Without `moment.tz`, `timeZone` is ignored. date-fns ignores `timeZone` and keeps the local calendar. Use the native adapter, Luxon, or Day.js when a picker needs an IANA zone.

```ts
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { BridgeUIProvider } from "@bridge-ui/react";
import { createDayjsDateAdapter } from "@bridge-ui/adapters/react/date-dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

const dates = createDayjsDateAdapter({
  "en-US": "en",
  "pt-BR": "pt-br",
});
```

```ts
import "moment-timezone";
import { createMomentDateAdapter } from "@bridge-ui/adapters/react/date-moment";

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

### Custom global values

Packages can add their own keys to `global` by augmenting `BridgeUIGlobal`. Nested providers and `setGlobal` merge every key by the same rule:

- Plain data (`breakpoints`, `formDefaults`, custom settings objects) is deep-merged.
- Functions, class instances, and objects with a function member (adapters) are replaced — the last defined value wins, and `undefined` keeps the previous one.

Only the top-level members of a value are checked. An object whose functions sit deeper (`{ hooks: { onSave } }`) is deep-merged.

```ts
import "@bridge-ui/core/Config";

declare module "@bridge-ui/core/Config" {
  interface BridgeUIGlobal {
    editor?: { format: (value: string) => string };
  }
}
```

```tsx
<BridgeUIProvider global={{ editor: { format: (value) => value.trim() } }}>
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

### Default color

Set `global.defaultColor` to replace the library default `color` (`primary`, `dark`, or `secondary`) on every colorable component: Button, ButtonGroup, Badge, Alert, Avatar, Link, Tabs, ToggleGroup, Snackbar, Progress, Spinner, Stepper, Pagination, Accordion, Calendar, ActionFooter, form fields, and pickers. Divider, Tooltip, Text, and Heading keep their neutral defaults.

Use `"black"` for a monochrome UI. To rebrand `primary`, change the palette in CSS instead.

Merge order: instance props → `components.{Name}.defaultProps` → chrome → `formDefaults` → `defaultColor` → library defaults. Explicit props and `invalid` / error states are unaffected.

```tsx
<BridgeUIProvider
  global={{ defaultColor: "black" }}
  components={{ Alert: { defaultProps: { color: "info" } } }}
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
        applyVariant: "solid",
        cancelVariant: "outline",
      },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

### Custom components

Components shipped outside Bridge can use the registry too. Augment `BridgeUIComponentsRegistry` so `components.{Name}` is typed, then read it with `useBridgeUIComponent` from `@bridge-ui/react/Utils`.

Pass `chrome` to inherit a shared entry (`FormField`, `FormControl`, `BaseField`, `TimePanel`). Its `defaultProps` apply below the component's own entry, and form chrome (`FormField`, `FormControl`, `BaseField`) also applies `global.formDefaults`. `entry` and `chromeEntry` return the raw registry entries (`classes`, `tokens`).

```ts
import "@bridge-ui/core/Config";

declare module "@bridge-ui/core/Config" {
  interface BridgeUIComponentsRegistry {
    Editor: Partial<{
      classes: { root?: string };
      defaultProps: Partial<{ size: "sm" | "md" | "lg" }>;
    }>;
  }
}
```

```ts
import { useBridgeUIComponent } from "@bridge-ui/react/Utils";

type EditorProps = { size?: "sm" | "md" | "lg"; variant?: string };

export function useEditor(props: EditorProps) {
  const { merged, entry, chromeEntry } = useBridgeUIComponent<EditorProps>({
    props,
    chrome: "FormField",
    componentName: "Editor",
    libDefaults: { size: "md" },
  });

  return { merged, entry, chromeEntry };
}
```

```tsx
<BridgeUIProvider
  components={{
    Editor: { defaultProps: { size: "sm" } },
    FormField: { defaultProps: { variant: "filled" } },
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

| Prop         | Type                       | Default | Description                                                                                                                             |
| ------------ | -------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `children`   | `ReactNode`                | —       | App tree rendered inside the provider                                                                                                   |
| `components` | `BridgeUIComponentsConfig` | —       | Per-component defaults                                                                                                                  |
| `global`     | `Partial<BridgeUIGlobal>`  | —       | `theme`, `locale`, `direction`, `timeZone`, `mobileBreakpoint`, `breakpoints`, `icons`, `i18n`, `dates`, `formDefaults`, `defaultColor` |

**useBridgeUI():** `global`, `components`, `setGlobal`, `setComponents`, `setLocale`, `setTheme`, `setTimeZone`, `setDirection`

## Related components

All components
