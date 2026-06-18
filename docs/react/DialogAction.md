# DialogAction

Imperative API to open preset confirmation dialogs. Requires `BridgeUIHosts` and `BridgeDialogHost`.

## Import

```ts
import { useDialogAction } from "@bridge-ui/react/Actions";
```

## Prerequisites

Mount `BridgeUIHosts` with the matching host (`BridgeDialogHost`, `BridgeModalHost`, or `BridgeSnackbarHost`) inside `BridgeUIProvider`.

## Examples

### Usage

```ts
const dialog = useDialogAction();

const id = dialog.open({
  title: "Delete item?",
  description: "This action cannot be undone.",
  actions: {
    reject: { label: "Cancel" },
    accept: { label: "Delete", color: "error" },
  },
});
```

### open

```tsx
<Button onClick={openBasic}>Open basic</Button>

<Button variant="outline" onClick={openDestructive}>
  Open destructive
</Button>
```

### close / closeTop

```tsx
<Button
  variant="outline"
  disabled={!lastId}
  onClick={() => lastId && dialog.close(lastId)}
>
  close(lastId)
</Button>

<Button variant="outline" onClick={() => dialog.closeTop()}>
  closeTop()
</Button>
```

### update

```tsx
<Button onClick={openUpdateDemo}>Open update demo</Button>

<Button
  variant="outline"
  disabled={!updateDemoId}
  onClick={() =>
    dialog.update(updateDemoId, {
      props: { title: "Updated title" },
    })
  }
>
  update props
</Button>
```

### Nested stack

```tsx
<Button onClick={openNested}>Open nested example</Button>
```

## API

| Method              | Description                   |
| ------------------- | ----------------------------- |
| `open(options)`     | Push a dialog onto the stack  |
| `close(id)`         | Close a specific dialog       |
| `closeTop()`        | Close the topmost dialog      |
| `isOpen(id)`        | Whether an id is open         |
| `update(id, patch)` | Update props or modal options |
| `stackSize`         | Current stack depth           |

**open() options:** `title`, `description`, `color`, `modal` (`size`, `transition`, `persistent`, `align`), `actions.accept`, `actions.reject`, `onClose`, `onClosed`

## Related components

Modal, ModalAction, BridgeUIProvider
