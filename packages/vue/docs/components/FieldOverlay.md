# FieldOverlay

Switches between `Menu`, `Modal`, and `Drawer` shells for field pickers and listboxes.
Dialog shells size to the picker: `modal` uses `w-fit` up to the viewport;
`drawer` is full width and up to `90dvh`. Dual calendars and time columns that
overflow the sheet width scroll on an inner scroller (`bridge-scroll-fade-x`).
Vertical fade comes from `scroll="paper"`. Nested pickers flush the bottom
radius in a drawer so the shell meets the screen edge.

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

Forward props to the active shell via `customProps.menu`, `customProps.modal`, or `customProps.drawer`. The drawer inner scroller accepts `customProps.drawerScroller`. Menu-only options such as `anchorEl`, `placement`, `disableAutoFocus`, and `rounded` go through `customProps.menu`.

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

<FieldOverlay
  v-model="open"
  overlay="drawer"
  :custom-props="{
    drawerScroller: { class: 'bridge-scroll-fade-none' },
  }"
>
  <PickerContent />
</FieldOverlay>
```

### Footer close

Nested pickers and listboxes close the overlay on Apply (after committing) and
Cancel (without committing).

A custom `footer` slot on the nested picker or listbox receives `{ apply, cancel }`.
Call `apply()` to commit the draft and close, or `cancel()` to discard and close.

The FieldOverlay injection (`FIELD_OVERLAY_INJECTION_KEY`) only closes the
overlay. Use the picker slot callbacks in custom footers so Apply still commits.

## Props

| Prop          | Type                      | Default  | Description                                                                                           |
| ------------- | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `customProps` | `FieldOverlayCustomProps` | —        | Extra props for nested shells (`menu`, `modal`, `drawer`) and the drawer scroller (`drawerScroller`). |
| `overlay`     | `FieldOverlayMode`        | `"auto"` | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                                                  |

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

Menu, Modal, Drawer, Select, Autocomplete, DateField, TimeField, DateTimeField, DateRangeField, TimeRangeField, DateTimeRangeField, ColorField, Listbox
