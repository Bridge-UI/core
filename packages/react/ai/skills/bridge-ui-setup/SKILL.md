---
name: bridge-ui-setup
description: >-
  Install and configure Bridge UI React — Tailwind v4 theme CSS, BridgeUIProvider,
  component defaults, icon and i18n adapters, BridgeUIHosts, useBridgeUI. Use when
  scaffolding Bridge, wiring the provider, or fixing missing theme / hosts / adapters.
---

# Bridge UI (React) — setup

Do **not** invent APIs. Read the package docs (after install: `.ai/docs/`; in this package: `docs/`).

## Install

```bash
npm install @bridge-ui/react
npx bridge-ui-react-ai install
```

## Required reading

| Topic                                         | Doc                                       |
| --------------------------------------------- | ----------------------------------------- |
| Provider, `global`, `components`, icons, i18n | `.ai/docs/components/BridgeUIProvider.md` |
| Icon adapter usage                            | `.ai/docs/components/Icon.md`             |
| i18n adapter                                  | `.ai/docs/components/I18n.md`             |
| Breakpoints                                   | `.ai/docs/components/useBreakpoint.md`    |
| Adapter sample code                           | `.ai/docs/examples/`                      |

## Hard rules

1. Tailwind CSS **v4** + `@import "@bridge-ui/react/theme.css"`.
2. Wrap the app with `BridgeUIProvider`.
3. Mount `BridgeUIHosts` inside the provider when using action hooks (`useDialogAction`, `useModalAction`, `useDrawerAction`, `useSnackbarAction`).
4. Semantic icon names and chrome strings need `global.icons` / `global.i18n` — copy samples from `.ai/docs/examples/`.
5. Prefer deep imports: `@bridge-ui/react/Components/{Name}`.
