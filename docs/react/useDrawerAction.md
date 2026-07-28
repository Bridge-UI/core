# useDrawerAction

Imperative API to mount custom components inside `Drawer`. Requires `BridgeDrawerHost`.

## Import

```ts
import { useDrawerAction } from "@bridge-ui/react/Actions";
```

## Prerequisites

Mount `BridgeUIHosts` with the matching host (`BridgeDialogHost`, `BridgeDrawerHost`, `BridgeModalHost`, or `BridgeSnackbarHost`) inside `BridgeUIProvider`.

## Examples

### Usage

```ts
const drawer = useDrawerAction();

const id = drawer.open({
  component: SettingsForm,
  drawer: { size: "lg", placement: "right" },
});
```

### open

```tsx
<Button onClick={openBasic}>Open basic</Button>

<Button variant="outline" onClick={openWithOptions}>
  Open with drawer options
</Button>
```

### close / closeTop

```tsx
<Button
  variant="outline"
  disabled={!lastId}
  onClick={() => lastId && drawer.close(lastId)}
>
  close(lastId)
</Button>

<Button variant="outline" onClick={() => drawer.closeTop()}>
  closeTop()
</Button>
```

### Nested stack

```tsx
<Button onClick={openNested}>Open nested example</Button>
```

## API

| Method              | Description                    |
| ------------------- | ------------------------------ |
| `open(options)`     | Push a drawer onto the stack   |
| `close(id)`         | Close a specific drawer        |
| `closeTop()`        | Close the topmost drawer       |
| `isOpen(id)`        | Whether an id is open          |
| `update(id, patch)` | Update props or drawer options |
| `stackSize`         | Current stack depth            |

**open() options:** `component`, `props`, `drawer` (`size`, `placement`, `transition`, `persistent`), `onClose`, `onClosed`

## Related components

Drawer, useModalAction, BridgeUIProvider
