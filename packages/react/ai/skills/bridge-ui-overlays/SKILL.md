---
name: bridge-ui-overlays
description: >-
  Bridge UI React overlays and imperative actions — Modal, Drawer, Menu,
  Tooltip, Snackbar, useModalAction, useDialogAction, useDrawerAction,
  useSnackbarAction, BridgeUIHosts. Use when opening layers or toast/dialog flows.
---

# Bridge UI (React) — overlays & actions

## Declarative Modal

`show` + `onShowChange`. Content: **`Card`** (no `ModalCard`).

```tsx
import { Modal } from "@bridge-ui/react/Components/Modal";
import { Card } from "@bridge-ui/react/Components/Card";
import { Button } from "@bridge-ui/react/Components/Button";

<Button onClick={() => setOpen(true)}>Open</Button>

<Modal show={open} onShowChange={setOpen}>
  <Card title="Confirm" onClose={() => setOpen(false)}>
    Are you sure?
  </Card>
</Modal>
```

Useful props: `size`, `align`, `blur`, `transition`, `persistent`.

```tsx
const breakpoint = useBreakpoint();
<Modal
  show={open}
  align={breakpoint.mobile ? "bottom-center" : "middle-center"}
  onShowChange={setOpen}
>
  …
</Modal>;
```

## Drawer / Menu / Tooltip / Snackbar

Import from `Components/{Name}`. For imperative toasts, prefer action hooks.

## Imperative actions

```tsx
import { BridgeUIHosts } from "@bridge-ui/react/Actions";
import {
  useDialogAction,
  useModalAction,
  useDrawerAction,
  useSnackbarAction,
} from "@bridge-ui/react/Actions";

<BridgeUIProvider>
  <BridgeUIHosts>
    <App />
  </BridgeUIHosts>
</BridgeUIProvider>;
```

```ts
const modal = useModalAction();
const id = modal.open({
  component: SettingsForm,
  modal: { size: "lg", title: "Settings" },
});
modal.close(id);
modal.closeTop();
```

Match option shapes to docs. Escape closes the top nested layer.
