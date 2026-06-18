# Modal

Modal overlay with portal, backdrop, and focus management. Put `Card` or any content inside.

## Import

```ts
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
  blur="md"
  size="lg"
  show={open}
  transition="slide-up"
  onShowChange={setOpen}
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
            color="error"
            variant="flat"
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

| Prop                  | Type               | Default         | Description                                                                                                            |
| --------------------- | ------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `align`               | `ModalAlign`       | "middle-center" | Panel position from the `sm` breakpoint up (`{row}-{column}` grid). Mobile always uses bottom sheet (`bottom-center`). |
| `autoFocus`           | `boolean`          | `false`         | When true, focuses the first focusable element inside the dialog on open.                                              |
| `blur`                | `ModalBlur`        | "none"          | Backdrop blur on the overlay.                                                                                          |
| `children`            | `ReactNode`        | —               | The children to render inside the dialog panel.                                                                        |
| `classes`             | `ModalClasses`     | —               | The classes to apply to the modal.                                                                                     |
| `closeOnEscape`       | `boolean`          | `true`          | Whether the modal closes on escape key press.                                                                          |
| `closeOnOverlay`      | `boolean`          | `true`          | Whether the modal closes on overlay click.                                                                             |
| `customProps`         | `ModalCustomProps` | —               | Props forwarded to each modal part.                                                                                    |
| `disableEnforceFocus` | `boolean`          | `false`         | When true, focus is not trapped inside the modal while open.                                                           |
| `disableRestoreFocus` | `boolean`          | `false`         | When true, focus is not restored to the previously focused element on close.                                           |
| `disableScrollLock`   | `boolean`          | `false`         | When true, body scroll is not locked while the modal is open.                                                          |
| `hideBackdrop`        | `boolean`          | `false`         | When true, the backdrop overlay is not rendered.                                                                       |
| `keepMounted`         | `boolean`          | `false`         | When true, the modal stays mounted in the DOM after closing (hidden).                                                  |
| `persistent`          | `boolean`          | `false`         | When true, escape and overlay clicks do not close the modal.                                                           |
| `scroll`              | `ModalScroll`      | "body"          | Where scroll happens: the page (`body`) or the dialog panel (`paper`).                                                 |
| `size`                | `ModalSize`        | "md"            | Max width of the dialog from the `sm` breakpoint up (`sm:max-w-*`).                                                    |
| `teleportTo`          | `string \| false`  | "body"          | Where to portal the modal. Pass `false` to render in place.                                                            |
| `transition`          | `ModalTransition`  | "fade"          | Enter/leave animation for overlay and panel.                                                                           |

### Binding

| Prop           | Type                      | Default | Description                                                                 |
| -------------- | ------------------------- | ------- | --------------------------------------------------------------------------- |
| `show`         | `boolean`                 | `false` | Whether the modal is visible. Use with `onShowChange` for controlled state. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when `show` should change.                                           |

## Events

| Callback  | Payload | Description                                                                                                                                                                                                |
| --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onClose` | —       | Called when the user dismisses the modal (overlay click or Escape). Not fired when the parent sets `show={false}` directly — use `onShowChange` for that. Sugar for `onShowChange(false)` on user dismiss. |

## Related components

Card, DialogAction, ModalAction
