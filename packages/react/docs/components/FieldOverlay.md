# FieldOverlay

Switches between `Menu`, `Modal`, and `Drawer` shells for field pickers and listboxes.

## Import

```ts
import { FieldOverlay } from "@bridge-ui/react/Components/FieldOverlay";
```

## Examples

### Usage

```tsx
<FieldOverlay show={open} overlay="menu" onShowChange={setOpen}>
  <PickerContent />
</FieldOverlay>
```

### Overlay modes

`overlay` accepts `menu` | `modal` | `drawer` | `auto`. Default is `menu`. Use `auto` for `menu` on desktop and bottom `drawer` on mobile.

```tsx
<FieldOverlay show={open} overlay="auto" onShowChange={setOpen}>
  <PickerContent />
</FieldOverlay>

<FieldOverlay show={open} overlay="drawer" onShowChange={setOpen}>
  <PickerContent />
</FieldOverlay>
```

### customProps

Forward props to the active shell via `customProps.menu`, `customProps.modal`, or `customProps.drawer`. Menu-only options such as `anchorEl`, `placement`, `disableAutoFocus`, and `rounded` go through `customProps.menu`.

```tsx
<FieldOverlay
  show={open}
  overlay="menu"
  onShowChange={setOpen}
  customProps={{
    menu: {
      anchorEl,
      rounded: "lg",
      placement: "bottom-start",
    },
  }}
>
  <PickerContent />
</FieldOverlay>

<FieldOverlay
  show={open}
  overlay="modal"
  onShowChange={setOpen}
  customProps={{
    modal: { size: "sm", transition: "none" },
  }}
>
  <PickerContent />
</FieldOverlay>
```

## Props

| Prop           | Type                      | Default  | Description                                                |
| -------------- | ------------------------- | -------- | ---------------------------------------------------------- |
| `children`     | `ReactNode`               | —        | Content rendered inside the active overlay shell.          |
| `customProps`  | `FieldOverlayCustomProps` | —        | Extra props for nested shells (`menu`, `modal`, `drawer`). |
| `overlay`      | `FieldOverlayMode`        | `"menu"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.       |
| `show`         | `boolean`                 | `false`  | Whether the overlay is open.                               |
| `onShowChange` | `(show: boolean) => void` | —        | Called when open state should change.                      |

## Related components

Menu, Modal, Drawer, Select, Autocomplete, DateField, TimeField, DateTimeField, DateRangeField, TimeRangeField, DateTimeRangeField, Listbox
