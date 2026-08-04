# Bridge UI (Vue) — consumer guidelines

Use these rules when writing application code with `@bridge-ui/vue`. Do **not** invent APIs; prefer examples from package docs (`.ai/docs/components/` after install, or `docs/components/` in this package).

## Install

```bash
npm install @bridge-ui/vue
npx bridge-ui-vue-ai install
```

`@bridge-ui/core` is transitive. Peer: Vue ^3.4.

## Setup (required)

1. Tailwind CSS **v4**.
2. `@import "@bridge-ui/vue/theme.css"`.
3. `createBridgeUI` and/or `BridgeUIProvider` — see `.ai/docs/components/BridgeUIProvider.md`.
4. Mount `BridgeUIHosts` when using action hooks.

## Imports

```ts
import { Button } from "@bridge-ui/vue/Components/Button";
```

## Vue patterns

| Concern    | Pattern                                            |
| ---------- | -------------------------------------------------- |
| Fields     | `v-model` / `modelValue`                           |
| Modal open | `v-model`                                          |
| Events     | emits / `v-on:close`                               |
| Slots      | `<template #start>`                                |
| Templates  | kebab-case attrs (`error-message`, `custom-props`) |

## Hard rules

- Prefer Bridge tokens (`color`, `size`, `variant`, `density`) when they exist.
- `custom-props` is for **inner** parts; root HTML attrs stay on the component.
- Modal/Drawer content: **`Card`** — no `ModalCard`.
- Do not destructure `useBreakpoint()` helpers — keep the reactive object.
- Do not compare Bridge to other UI libraries in generated docs or comments.
- Load skills under `.cursor/skills/` and read the linked `.ai/docs/` pages for examples.
