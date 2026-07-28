# Drawer

Edge-docked overlay with portal, backdrop, and focus management. Put `Card` or any content inside.

## Import

```ts
import { Drawer } from "@bridge-ui/react/Components/Drawer";
```

## Examples

### Usage

```tsx
<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer show={open} onShowChange={setOpen}>
  <Card title="Confirm action" onClose={() => setOpen(false)}>
    Are you sure you want to continue?
  </Card>
</Drawer>
```

### Persistent

```tsx
<Drawer persistent show={open} onShowChange={setOpen}>
  <Card title="Persistent drawer" onClose={() => setOpen(false)}>
    Clicking the backdrop or pressing Escape has no effect.
  </Card>
</Drawer>
```

### Placements

`placement` docks the panel to one of the four viewport edges. `left`/`right` size along `size` width tokens; `top`/`bottom` size along `size` height tokens.

```tsx
<Drawer show={open} placement="right" onShowChange={setOpen}>
  <Card title="Right drawer" onClose={() => setOpen(false)}>
    Docks to the right edge.
  </Card>
</Drawer>
```

```tsx
<Drawer show={open} placement="bottom" onShowChange={setOpen}>
  <Card title="Bottom sheet" onClose={() => setOpen(false)}>
    Docks to the bottom edge.
  </Card>
</Drawer>
```

### Transitions

```tsx
<Drawer show={open} transition="fade" onShowChange={setOpen}>
  <Card title="Fade" onClose={() => setOpen(false)}>
    Overlay and panel fade in and out.
  </Card>
</Drawer>
```

```tsx
<Drawer show={open} transition="none" onShowChange={setOpen}>
  <Card title="No transition" onClose={() => setOpen(false)}>
    Opens and closes instantly.
  </Card>
</Drawer>
```

> `slide` (the default) animates the panel from the placement edge and fades the overlay. `fade` fades both layers in place. `none` disables both.

### Full composition (Card)

```tsx
<Drawer
  blur="md"
  size="lg"
  show={open}
  placement="right"
  onShowChange={setOpen}
>
  <Card
    borderless
    shadow="lg"
    rounded="none"
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
    Large right-docked drawer with Card title, body, and footer slots.
  </Card>
</Drawer>
```

### customProps

```tsx
<Drawer
  show={open}
  onShowChange={setOpen}
  customProps={{
    root: { id: "drawer-root" },
    panel: { id: "drawer-panel" },
    overlay: { id: "drawer-overlay" },
  }}
>
  <Card title="customProps" onClose={() => setOpen(false)}>
    Inspect the DOM for ids on each drawer part.
  </Card>
</Drawer>
```

## Props

| Prop                  | Type                | Default | Description                                                                                |
| --------------------- | ------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `ariaLabel`           | `string`            | —       | Accessible name for the dialog (`aria-label`).                                             |
| `ariaLabelledBy`      | `string`            | —       | Id of the element that labels the dialog (`aria-labelledby`).                              |
| `autoFocus`           | `boolean`           | `false` | When true, focuses the first focusable element inside the drawer on open.                  |
| `blur`                | `DrawerBlur`        | "none"  | Backdrop blur on the overlay.                                                              |
| `children`            | `ReactNode`         | —       | The children to render inside the drawer panel.                                            |
| `classes`             | `DrawerClasses`     | —       | The classes to apply to the drawer.                                                        |
| `closeOnEscape`       | `boolean`           | `true`  | Whether the drawer closes on escape key press.                                             |
| `closeOnOverlay`      | `boolean`           | `true`  | Whether the drawer closes on overlay click.                                                |
| `customProps`         | `DrawerCustomProps` | —       | Props forwarded to each drawer part.                                                       |
| `disableEnforceFocus` | `boolean`           | `false` | When true, focus is not trapped inside the drawer while open.                              |
| `disableRestoreFocus` | `boolean`           | `false` | When true, focus is not restored to the previously focused element on close.               |
| `disableScrollLock`   | `boolean`           | `false` | When true, body scroll is not locked while the drawer is open.                             |
| `hideBackdrop`        | `boolean`           | `false` | When true, the backdrop overlay is not rendered.                                           |
| `keepMounted`         | `boolean`           | `false` | When true, the drawer stays mounted in the DOM after closing (hidden).                     |
| `persistent`          | `boolean`           | `false` | When true, escape and overlay clicks do not close the drawer.                              |
| `placement`           | `DrawerPlacement`   | "left"  | Which edge the panel docks to.                                                             |
| `scroll`              | `DrawerScroll`      | "paper" | Where scroll happens: the page (`body`) or the drawer panel (`paper`).                     |
| `size`                | `DrawerSize`        | "md"    | Panel size along the placement axis (width for `left`/`right`, height for `top`/`bottom`). |
| `teleportTo`          | `string \| false`   | "body"  | Where to portal the drawer. Pass `false` to render in place.                               |
| `transition`          | `DrawerTransition`  | "slide" | Enter/leave animation for overlay and panel.                                               |

### Binding

| Prop           | Type                      | Default | Description                                                                  |
| -------------- | ------------------------- | ------- | ---------------------------------------------------------------------------- |
| `show`         | `boolean`                 | `false` | Whether the drawer is visible. Use with `onShowChange` for controlled state. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when `show` should change.                                            |

## Events

| Callback  | Payload | Description                                                                                                                                                                                                 |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onClose` | —       | Called when the user dismisses the drawer (overlay click or Escape). Not fired when the parent sets `show={false}` directly — use `onShowChange` for that. Sugar for `onShowChange(false)` on user dismiss. |

## Related components

Card, [useDrawerAction](./useDrawerAction.md), useDialogAction, useModalAction
