---
name: bridge-ui-setup
description: >-
  Install and configure Bridge UI React — Tailwind v4 theme CSS, BridgeUIProvider,
  component defaults, icon and i18n adapters, BridgeUIHosts. Use when scaffolding
  Bridge, wiring the provider, or fixing missing theme / hosts / adapters.
---

# Bridge UI (React) — setup

## Install

```bash
npm install @bridge-ui/react
npx bridge-ui-react-ai install
```

`@bridge-ui/core` comes as a dependency. Peer: React 18/19. Requires **Tailwind CSS v4**.

## Theme CSS

```css
@import "tailwindcss";
@import "@bridge-ui/react/theme.css";
```

## Provider

```tsx
import { BridgeUIProvider } from "@bridge-ui/react";
import { BridgeUIHosts } from "@bridge-ui/react/Actions";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <BridgeUIProvider
      global={{
        theme: "light",
        locale: "en-US",
        direction: "ltr",
        mobileBreakpoint: "sm",
      }}
      components={{
        Button: { defaultProps: { color: "primary", size: "md" } },
      }}
    >
      <BridgeUIHosts>{children}</BridgeUIHosts>
    </BridgeUIProvider>
  );
}
```

`BridgeUIHosts` is required for `useDialogAction`, `useModalAction`, `useDrawerAction`, `useSnackbarAction`.

Runtime: `useBridgeUI()` → `setTheme`, `setLocale`, `setDirection`, `setGlobal`, `setComponents`.

## `global` fields

| Field              | Default   | Notes                                                |
| ------------------ | --------- | ---------------------------------------------------- |
| `theme`            | `"light"` | Also toggle document `dark` / color-scheme as needed |
| `locale`           | `"en-US"` | `setLocale` calls `i18n.setLocale` when set          |
| `direction`        | `"ltr"`   |                                                      |
| `mobileBreakpoint` | `"sm"`    | `useBreakpoint().mobile` threshold                   |
| `breakpoints`      | `{}`      | Optional CSS length overrides                        |
| `icons`            | —         | `IconAdapter` for semantic names                     |
| `i18n`             | —         | Chrome strings (`"Close"`, …)                        |

## Checklist

- [ ] `@bridge-ui/react` installed
- [ ] Tailwind v4 + `theme.css` imported
- [ ] `BridgeUIProvider` wrapping the app
- [ ] `BridgeUIHosts` if using action hooks
- [ ] Optional: `components` defaults, `icons`, `i18n`
- [ ] `npx bridge-ui-react-ai install` for agent guidelines
