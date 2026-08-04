---
name: bridge-ui-setup
description: >-
  Install and configure Bridge UI Vue — Tailwind v4 theme CSS, createBridgeUI /
  BridgeUIProvider, component defaults, icon and i18n adapters, BridgeUIHosts.
  Use when scaffolding Bridge, wiring the provider, or fixing missing theme /
  hosts / adapters.
---

# Bridge UI (Vue) — setup

## Install

```bash
npm install @bridge-ui/vue
npx bridge-ui-vue-ai install
```

`@bridge-ui/core` comes as a dependency. Peer: Vue ^3.4. Requires **Tailwind CSS v4**.

## Theme CSS

```css
@import "tailwindcss";
@import "@bridge-ui/vue/theme.css";
```

## Provider / plugin

```ts
import { createApp } from "vue";
import { createBridgeUI } from "@bridge-ui/vue";
import { BridgeUIHosts } from "@bridge-ui/vue/Actions";

const app = createApp(App);
app.use(
  createBridgeUI({
    global: { theme: "light", locale: "en-US" },
    components: {
      Alert: { defaultProps: { color: "success" } },
    },
  }),
);
```

And/or wrap with `<BridgeUIProvider :global="...">`. Nested providers merge over parents.

Mount `BridgeUIHosts` when using action composables (`useDialogAction`, `useModalAction`, …).

## `global` fields

| Field | Default | Notes |
|-------|---------|--------|
| `theme` | `"light"` | Also toggle document `dark` / color-scheme as needed |
| `locale` | `"en-US"` | `setLocale` calls `i18n.setLocale` when set |
| `direction` | `"ltr"` | |
| `mobileBreakpoint` | `"sm"` | `useBreakpoint().mobile` threshold |
| `breakpoints` | `{}` | Optional CSS length overrides |
| `icons` | — | `IconAdapter` for semantic names |
| `i18n` | — | Chrome strings (`"Close"`, …) |

## Checklist

- [ ] `@bridge-ui/vue` installed
- [ ] Tailwind v4 + `theme.css` imported
- [ ] `createBridgeUI` and/or `BridgeUIProvider`
- [ ] `BridgeUIHosts` if using action hooks
- [ ] Optional: `components` defaults, `icons`, `i18n`
- [ ] `npx bridge-ui-vue-ai install` for agent guidelines
