# Bridge UI (React) — consumer guidelines

Use these rules when writing application code with `@bridge-ui/react`. Do **not** invent APIs; prefer examples from package docs (`.ai/docs/components/` after install, or `docs/components/` in this package).

## Install

```bash
npm install @bridge-ui/react
npx bridge-ui-react-ai install
```

`@bridge-ui/core` is transitive. Peer: React 18 or 19.

## Setup (required)

1. Tailwind CSS **v4**.
2. `@import "@bridge-ui/react/theme.css"`.
3. Wrap with `BridgeUIProvider` — see `.ai/docs/components/BridgeUIProvider.md`.
4. Mount `BridgeUIHosts` when using action hooks.

## Imports

```ts
import { Button } from "@bridge-ui/react/Components/Button";
```

## React patterns

| Concern    | Pattern                 |
| ---------- | ----------------------- |
| Fields     | `value` + `onChange`    |
| Modal open | `show` + `onShowChange` |
| Events     | `onClose`, `onOpen`, …  |
| Slots      | `slots={{ start: … }}`  |

## Hard rules

- Prefer Bridge tokens (`color`, `size`, `variant`, `density`) when they exist.
- `customProps` is for **inner** parts; root HTML attrs stay on the component.
- Modal/Drawer content: **`Card`** — no `ModalCard`.
- Do not compare Bridge to other UI libraries in generated docs or comments.
- Load skills under `.cursor/skills/` and read the linked `.ai/docs/` pages for examples.
