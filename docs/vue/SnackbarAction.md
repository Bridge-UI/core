# SnackbarAction

Imperative API for toast notifications. Requires `BridgeSnackbarHost`.

## Import

```vue
import { useSnackbarAction } from "@bridge-ui/vue/Actions";
```

## Prerequisites

Mount `BridgeUIHosts` with the matching host (`BridgeDialogHost`, `BridgeModalHost`, or `BridgeSnackbarHost`) inside `BridgeUIProvider`.

## Examples

### Usage

```vue
const snackbar = useSnackbarAction(); snackbar.open({ title: "Saved", color:
"success", description: "Your changes were saved successfully.", });
```

### open

```vue
<Button v-on:click="openBasic">Open basic</Button>

<Button variant="outline" v-on:click="openWithOptions">
  Open with options
</Button>
```

### close / closeAll

```vue
<Button variant="outline" v-on:click="snackbar.closeTop()">
  closeTop()
</Button>

<Button variant="outline" v-on:click="snackbar.closeAll()">
  closeAll()
</Button>
```

### update

```vue
<Button v-on:click="openUpdateDemo">Open update demo</Button>

<Button
  variant="outline"
  :disabled="!updateDemoId"
  v-on:click="
    snackbar.update(updateDemoId, {
      props: { title: 'Updated title' },
    })
  "
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
