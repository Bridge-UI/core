# Modal

Modal overlay with portal, backdrop, and focus management. Put `Card` or any content inside.

## Import

```tsx
import { Modal } from "@bridge-ui/react/Components/Modal";
```

## Examples

### Usage

```tsx
<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal show={open} onShowChange={setOpen}>
  <ModalCard title="Confirm action" onClose={() => setOpen(false)}>
    Are you sure you want to continue?
  </ModalCard>
</Modal>
```

### Persistent

```tsx
<Modal persistent show={open} onShowChange={setOpen}>
  <ModalCard title="Persistent modal" onClose={() => setOpen(false)}>
    Clicking the backdrop or pressing Escape has no effect.
  </ModalCard>
</Modal>
```

### Nested modals

```tsx
<Modal show={outerOpen} onShowChange={setOuterOpen} size="lg">
  <ModalCard title="Outer modal" onClose={() => setOuterOpen(false)}>
    <Button size="sm" onClick={() => setInnerOpen(true)}>
      Open nested modal
    </Button>
  </ModalCard>

  <Modal show={innerOpen} onShowChange={setInnerOpen} size="sm">
    <ModalCard title="Nested confirmation" onClose={() => setInnerOpen(false)}>
      Press Escape to close only this layer.
    </ModalCard>
  </Modal>
</Modal>
```

### Full composition (Card)

```tsx
<Modal
  show={open}
  onShowChange={setOpen}
  size="lg"
  blur="md"
  transition="slide-up"
>
  <Card
    borderless
    shadow="lg"
    rounded="2xl"
    padding="large"
    variant="elevated"
    title="Edit profile"
    slots={{
      footer: (
        <>
          <Button
            size="sm"
            variant="flat"
            color="error"
            onClick={() => setOpen(false)}
          >
            Discard
          </Button>

          <Button size="sm" color="primary" onClick={() => setOpen(false)}>
            Save
          </Button>
        </>
      ),
    }}
  >
    Large modal with Card title, body, and footer slots.
  </Card>
</Modal>
```

### customProps

```tsx
<Modal
  show={open}
  onShowChange={setOpen}
  customProps={{
    root: { id: "modal-root" },
    panel: { id: "modal-panel" },
    overlay: { id: "modal-overlay" },
  }}
>
  <ModalCard title="customProps" onClose={() => setOpen(false)}>
    Inspect the DOM for ids on each modal part.
  </ModalCard>
</Modal>
```

## Props

| Prop             | Type                      | Default           | Description          |
| ---------------- | ------------------------- | ----------------- | -------------------- |
| `align`          | `ModalAlign`              | `"middle-center"` | Panel position       |
| `blur`           | `ModalBlur`               | `"none"`          | Backdrop blur        |
| `closeOnEscape`  | `boolean`                 | `true`            | Escape closes        |
| `closeOnOverlay` | `boolean`                 | `true`            | Overlay click closes |
| `onShowChange`   | `(show: boolean) => void` | —                 | Visibility callback  |
| `persistent`     | `boolean`                 | `false`           | Block dismiss        |
| `scroll`         | `"body" \| "panel"`       | `"body"`          | Scroll container     |
| `show`           | `boolean`                 | `false`           | Open state           |
| `size`           | `ModalSize`               | `"md"`            | Panel width          |
| `teleportTo`     | `string \| false`         | `"body"`          | Portal target        |
| `transition`     | `ModalTransition`         | `"fade"`          | Enter/exit animation |

## Related components

Card, DialogAction, ModalAction
