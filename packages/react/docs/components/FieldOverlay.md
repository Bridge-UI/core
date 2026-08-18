# FieldOverlay

Switches between `Menu`, `Modal`, and `Drawer` shells for field pickers and listboxes.
Dialog shells size to the picker: `modal` uses `w-fit` up to the viewport;
`drawer` is full width and up to `90dvh`, and scrolls horizontally when dual
calendars or time columns overflow. Nested pickers flush the bottom radius in a
drawer so the shell meets the screen edge.

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

`overlay` accepts `menu` | `modal` | `drawer` | `auto`. Default is `auto` (`menu` on desktop, bottom `drawer` on mobile).

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

### Footer close

Nested pickers and listboxes close the overlay on Apply (after committing) and
Cancel (without committing).

A custom `footer` slot on the nested picker or listbox receives `{ apply, cancel }`.
Call `apply()` to commit the draft and close, or `cancel()` to discard and close.

`useFieldOverlayFooter` only closes the overlay. Use the picker slot callbacks
in custom footers so Apply still commits.

## Props

| Prop           | Type                      | Default  | Description                                                |
| -------------- | ------------------------- | -------- | ---------------------------------------------------------- |
| `children`     | `ReactNode`               | —        | Content rendered inside the active overlay shell.          |
| `customProps`  | `FieldOverlayCustomProps` | —        | Extra props for nested shells (`menu`, `modal`, `drawer`). |
| `overlay`      | `FieldOverlayMode`        | `"auto"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.       |
| `show`         | `boolean`                 | `false`  | Whether the overlay is open.                               |
| `onShowChange` | `(show: boolean) => void` | —        | Called when open state should change.                      |

## Related components

Menu, Modal, Drawer, Select, Autocomplete, DateField, TimeField, DateTimeField, DateRangeField, TimeRangeField, DateTimeRangeField, ColorField, Listbox
