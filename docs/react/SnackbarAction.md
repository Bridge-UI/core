# SnackbarAction

Imperative API for toast notifications. Requires `BridgeSnackbarHost`.

## Import

```tsx
import { useSnackbarAction } from "@bridge-ui/react/Actions";
```

## Prerequisites

Mount `BridgeUIHosts` with the matching host (`BridgeDialogHost`, `BridgeModalHost`, or `BridgeSnackbarHost`) inside `BridgeUIProvider`.

## Examples

### Usage

```tsx
const snackbar = useSnackbarAction();

snackbar.open({
  title: "Saved",
  description: "Your changes were saved successfully.",
  color: "success",
});
```

### open

```tsx
<Button onClick={openBasic}>Open basic</Button>

<Button variant="outline" onClick={openWithOptions}>
  Open with options
</Button>
```

### close / closeAll

```tsx
<Button variant="outline" onClick={() => snackbar.closeTop()}>
  closeTop()
</Button>

<Button variant="outline" onClick={() => snackbar.closeAll()}>
  closeAll()
</Button>
```

### update

```tsx
<Button onClick={openUpdateDemo}>Open update demo</Button>

<Button
  variant="outline"
  disabled={!updateDemoId}
  onClick={() =>
    snackbar.update(updateDemoId, {
      props: { title: "Updated title" },
    })
  }
>
  update props
</Button>
```

## API

| Method              | Description                    |
| ------------------- | ------------------------------ |
| `open(options)`     | Push a snackbar onto the stack |
| `close(id)`         | Close a specific snackbar      |
| `closeTop()`        | Close the topmost snackbar     |
| `closeAll()`        | Close all snackbars            |
| `isOpen(id)`        | Whether an id is open          |
| `update(id, patch)` | Update snackbar props          |
| `stackSize`         | Current stack depth            |

**open() options:** `title`, `description`, `color`, `duration`, `position`, `onClose`, `onClosed`

## Related components

Snackbar, Alert, BridgeUIProvider
