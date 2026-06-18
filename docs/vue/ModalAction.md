# ModalAction

Imperative API to mount custom components inside `Modal`. Requires `BridgeModalHost`.

## Import

```vue
import { useModalAction } from "@bridge-ui/vue/Actions";
```

## Prerequisites

Mount `BridgeUIHosts` with the matching host (`BridgeDialogHost`, `BridgeModalHost`, or `BridgeSnackbarHost`) inside `BridgeUIProvider`.

## Examples

### Usage

```vue
const modal = useModalAction(); const id = modal.open({ component: SettingsForm,
modal: { size: "lg", title: "Settings" }, });
```

### open

```vue
<Button v-on:click="openBasic">Open basic</Button>

<Button variant="outline" v-on:click="openWithOptions">
  Open with modal options
</Button>
```

### close / closeTop

```vue
<Button
  variant="outline"
  :disabled="!lastId"
  v-on:click="lastId && modal.close(lastId)"
>
  close(lastId)
</Button>

<Button variant="outline" v-on:click="modal.closeTop()">
  closeTop()
</Button>
```

### Nested stack

```vue
<Button v-on:click="openNested">Open nested example</Button>
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
