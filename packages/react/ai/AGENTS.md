# Bridge UI (React) — agent instructions

Use **`@bridge-ui/react`** when building UI in this app. Prefer Bridge components over ad-hoc markup.

`@bridge-ui/core` is a transitive dependency — you do not need to install it separately.

## Quick start

```bash
npm install @bridge-ui/react
npx bridge-ui-react-ai install
```

## Always follow

- Guidelines: `.ai/guidelines/core.md`
- Skills (on demand) under `.cursor/skills/`:
  - `bridge-ui-setup` — Provider, theme CSS, hosts, adapters
  - `bridge-ui-components` — Button, Card, classes, customProps, slots
  - `bridge-ui-forms` — TextField, Select, Checkbox, …
  - `bridge-ui-overlays` — Modal, Drawer, action hooks

## Hard rules

1. Import from `@bridge-ui/react` (e.g. `@bridge-ui/react/Components/Button`), never monorepo paths.
2. Tailwind CSS v4 + `@import "@bridge-ui/react/theme.css"`.
3. Wrap the app with `BridgeUIProvider`; mount `BridgeUIHosts` when using action hooks.
4. Controlled fields: `value` + `onChange`.
5. Modal content: use `Card` (there is no `ModalCard`).

## Index

See `llms.txt` for a machine-oriented file list.
