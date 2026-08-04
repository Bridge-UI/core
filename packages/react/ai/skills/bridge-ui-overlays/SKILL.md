---
name: bridge-ui-overlays
description: >-
  Bridge UI React overlays and imperative actions — Modal, Drawer, Menu,
  Tooltip, Snackbar, useModalAction, useDialogAction, useDrawerAction,
  useSnackbarAction, BridgeUIHosts. Use when opening layers or toast/dialog flows.
---

# Bridge UI (React) — overlays & actions

Do **not** invent APIs. Copy examples from `.ai/docs/components/{Component}.md`.

## Binding

Overlays: **`show` + `onShowChange`**. Modal/Drawer body: **`Card`** (no `ModalCard`).

## Start here

| Need              | Doc                                        |
| ----------------- | ------------------------------------------ |
| Modal             | `.ai/docs/components/Modal.md`             |
| Drawer            | `.ai/docs/components/Drawer.md`            |
| Menu              | `.ai/docs/components/Menu.md`              |
| Tooltip           | `.ai/docs/components/Tooltip.md`           |
| Snackbar          | `.ai/docs/components/Snackbar.md`          |
| useModalAction    | `.ai/docs/components/useModalAction.md`    |
| useDialogAction   | `.ai/docs/components/useDialogAction.md`   |
| useDrawerAction   | `.ai/docs/components/useDrawerAction.md`   |
| useSnackbarAction | `.ai/docs/components/useSnackbarAction.md` |
| Breakpoints       | `.ai/docs/components/useBreakpoint.md`     |

## Hard rules

1. Mount `BridgeUIHosts` inside `BridgeUIProvider` before using action hooks.
2. `align` on Modal applies on all breakpoints — use `useBreakpoint` for mobile bottom sheets.
3. Menu panel children are real components (`List` / `ListItem`, etc.). Docs may show a local `MenuContent` helper — that is **not** a Bridge export.
4. Match action `open` option shapes to the `use*Action` docs. Escape closes the top nested layer only.
