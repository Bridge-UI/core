# FieldOverlay

Switches between `Menu`, `Modal`, and `Drawer` shells for field pickers and listboxes.
Dialog shells (`modal` / `drawer`) always center the picker and size the drawer
panel to its content (up to `90dvh`) so dual-month and dual-time pickers are not
clipped.

## Import

```ts
import { FieldOverlay } from "@bridge-ui/vue/Components/FieldOverlay";
```

## Examples

### Usage

```vue
<FieldOverlay v-model="open" overlay="menu">
  <PickerContent />
</FieldOverlay>
```

### Overlay modes

`overlay` accepts `menu` | `modal` | `drawer` | `auto`. Default is `auto` (`menu` on desktop, bottom `drawer` on mobile).

```vue
<FieldOverlay v-model="open" overlay="auto">
  <PickerContent />
</FieldOverlay>

<FieldOverlay v-model="open" overlay="drawer">
  <PickerContent />
</FieldOverlay>
```

### customProps

Forward props to the active shell via `customProps.menu`, `customProps.modal`, or `customProps.drawer`. Menu-only options such as `anchorEl`, `placement`, `disableAutoFocus`, and `rounded` go through `customProps.menu`.

```vue
<FieldOverlay
  v-model="open"
  overlay="menu"
  :custom-props="{
    menu: {
      anchorEl,
      rounded: 'lg',
      placement: 'bottom-start',
    },
  }"
>
  <PickerContent />
</FieldOverlay>

<FieldOverlay
  v-model="open"
  overlay="modal"
  :custom-props="{
    modal: { size: 'sm', transition: 'none' },
  }"
>
  <PickerContent />
</FieldOverlay>
```

### Footer close

Nested pickers and listboxes close the overlay on Apply (after committing) and
Cancel (without committing).

A custom `footer` slot on the nested picker or listbox receives `{ apply, cancel }`.
Calling those functions closes the overlay.

## Props

| Prop          | Type                      | Default  | Description                                                |
| ------------- | ------------------------- | -------- | ---------------------------------------------------------- |
| `customProps` | `FieldOverlayCustomProps` | —        | Extra props for nested shells (`menu`, `modal`, `drawer`). |
| `overlay`     | `FieldOverlayMode`        | `"auto"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.       |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | `false` | Whether the overlay is open. Bound with `v-model`.                           |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Events

| Event              | Payload           | Description                                  |
| ------------------ | ----------------- | -------------------------------------------- |
| `v-on:close`       | —                 | Emitted when the user dismisses the overlay. |
| `v-on:show-change` | `(show: boolean)` | Emitted when open state should change.       |

## Related components

Menu, Modal, Drawer, Select, Autocomplete, DateField, TimeField, DateTimeField, DateRangeField, TimeRangeField, DateTimeRangeField, Listbox
