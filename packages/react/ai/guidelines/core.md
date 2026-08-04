# Bridge UI (React) — consumer guidelines

Use these rules when writing application code with `@bridge-ui/react`. Do **not** invent APIs; prefer patterns from the package docs / upstream `docs/react/`.

## Install

```bash
npm install @bridge-ui/react
```

`@bridge-ui/core` is installed transitively. Peer: React 18 or 19.

Enable agent guidelines/skills in this app:

```bash
npx bridge-ui-react-ai install
# Windows / PnP fallback:
npx bridge-ui-react-ai install --copy
```

Never import from monorepo paths (`packages/...`, `@/Components/...`) in a consumer app.

## Setup (required)

1. Tailwind CSS **v4** in the app.
2. Import theme CSS once:

```css
@import "tailwindcss";
@import "@bridge-ui/react/theme.css";
```

3. Wrap with `BridgeUIProvider`.
4. If using imperative dialogs/modals/drawers/snackbars, mount `BridgeUIHosts` inside the provider.

## Imports

Prefer deep component imports:

```ts
import { Button } from "@bridge-ui/react/Components/Button";
```

Also valid: package root, `.../Provider`, `.../Actions`, `.../Utils`.

## React patterns

| Concern    | Pattern                 |
| ---------- | ----------------------- |
| Fields     | `value` + `onChange`    |
| Modal open | `show` + `onShowChange` |
| Events     | `onClose`, `onOpen`, …  |
| Slots      | `slots={{ start: … }}`  |

## Styling and parts

- Prefer Bridge props (`color`, `size`, `variant`, `density`) when a token exists.
- `classes` — className overrides per internal part.
- `customProps` — extra props for **inner** parts. Root HTML attributes stay on the component.
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
