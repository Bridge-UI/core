# Bridge UI (Vue) — consumer guidelines

Use these rules when writing application code with `@bridge-ui/vue`. Do **not** invent APIs; prefer patterns from the package docs / upstream `docs/vue/`.

## Install

```bash
npm install @bridge-ui/vue
```

`@bridge-ui/core` is installed transitively. Peer: Vue ^3.4.

Enable agent guidelines/skills in this app:

```bash
npx bridge-ui-vue-ai install
# Windows / PnP fallback:
npx bridge-ui-vue-ai install --copy
```

Never import from monorepo paths (`packages/...`, `@/Components/...`) in a consumer app.

## Setup (required)

1. Tailwind CSS **v4** in the app.
2. Import theme CSS once:

```css
@import "tailwindcss";
@import "@bridge-ui/vue/theme.css";
```

3. Use `app.use(createBridgeUI({ ... }))` and/or wrap with `BridgeUIProvider`.
4. If using imperative dialogs/modals/drawers/snackbars, mount `BridgeUIHosts` inside the provider.

## Imports

Prefer deep component imports:

```ts
import { Button } from "@bridge-ui/vue/Components/Button";
```

Also valid: package root, `.../Provider`, `.../Actions`, `.../Utils`.

## Vue patterns

| Concern | Pattern |
|---------|---------|
| Fields | `v-model` / `modelValue` |
| Modal open | `v-model` |
| Events | emits / `v-on:close` |
| Slots | `<template #start>` |
| Templates | kebab-case attrs (`error-message`, `custom-props`) |

Script setup may still use camelCase prop names in objects.

## Styling and parts

- Prefer Bridge props (`color`, `size`, `variant`, `density`) when a token exists.
- `classes` / `:classes` — class overrides per internal part.
- `customProps` / `:custom-props` — extra props for **inner** parts. Root HTML attributes stay on the component.
- Do not compare Bridge to other UI libraries in generated docs or comments.

## Modal content

Put `Card` (or custom content) inside `Modal`. There is no exported `ModalCard`.

## Registry defaults

```ts
components: {
  Button: { defaultProps: { color: "primary", size: "md" } },
}
```

## Icons and i18n

Semantic icon names and chrome strings need `global.icons` / `global.i18n` on the provider.
