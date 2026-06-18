# ModalAction

Imperative API to mount custom components inside `Modal`. Requires `BridgeModalHost`.

## Import

```ts
import { useModalAction } from "@bridge-ui/react/Actions";
```

## Prerequisites

Mount `BridgeUIHosts` with the matching host (`BridgeDialogHost`, `BridgeModalHost`, or `BridgeSnackbarHost`) inside `BridgeUIProvider`.

## Examples

### Usage

```ts
const modal = useModalAction();

const id = modal.open({
  component: SettingsForm,
  modal: { size: "lg", title: "Settings" },
});
```

### open

```tsx
<Button onClick={openBasic}>Open basic</Button>

<Button variant="outline" onClick={openWithOptions}>
  Open with modal options
</Button>
```

### close / closeTop

```tsx
<Button
  variant="outline"
  disabled={!lastId}
  onClick={() => lastId && modal.close(lastId)}
>
  close(lastId)
</Button>

<Button variant="outline" onClick={() => modal.closeTop()}>
  closeTop()
</Button>
```

### Nested stack

```tsx
<Button onClick={openNested}>Open nested example</Button>
```

## API

| Method              | Description                   |
| ------------------- | ----------------------------- |
| `open(options)`     | Push a modal onto the stack   |
| `close(id)`         | Close a specific modal        |
| `closeTop()`        | Close the topmost modal       |
| `isOpen(id)`        | Whether an id is open         |
| `update(id, patch)` | Update props or modal options |
| `stackSize`         | Current stack depth           |

**open() options:** `component`, `props`, `modal` (`size`, `transition`, `persistent`, `align`), `onClose`, `onClosed`

## Related components

Modal, DialogAction, BridgeUIProvider
