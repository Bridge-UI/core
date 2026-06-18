# Modal

Modal overlay with portal, backdrop, and focus management. Put `Card` or any content inside.

## Import

```vue
import { Modal } from "@bridge-ui/vue/Components/Modal";
```

## Examples

### Usage

```vue
<Button v-on:click="open = true">Open modal</Button>

<Modal v-model="open">
  <ModalCard title="Confirm action" :on-close="() => (open = false)">
    Are you sure you want to continue?
  </ModalCard>
</Modal>
```

### Persistent

```vue
<Modal v-model="open" persistent>
  <ModalCard title="Persistent modal" :on-close="() => (open = false)">
    Clicking the backdrop or pressing Escape has no effect.
  </ModalCard>
</Modal>
```

### Nested modals

```vue
<Modal v-model="outerOpen" size="lg">
  <ModalCard title="Outer modal" :on-close="() => (outerOpen = false)">
    <Button size="sm" v-on:click="innerOpen = true">Open nested modal</Button>
  </ModalCard>

  <Modal v-model="innerOpen" size="sm">
    <ModalCard title="Nested confirmation" :on-close="() => (innerOpen = false)">
      Press Escape to close only this layer.
    </ModalCard>
  </Modal>
</Modal>
```

### Full composition (Card)

```vue
<Modal blur="md" size="lg" v-model="open" transition="slide-up">
  <Card
    borderless
    shadow="lg"
    rounded="2xl"
    padding="large"
    variant="elevated"
    title="Edit profile"
  >
    Large modal with Card title, body, and footer slots.

    <template #footer>
      <Button size="sm" variant="flat" color="error" v-on:click="open = false">
        Discard
      </Button>

      <Button size="sm" color="primary" v-on:click="open = false">Save</Button>
    </template>
  </Card>
</Modal>
```

### customProps

```vue
<Modal
  v-model="open"
  :custom-props="{
    root: { id: 'modal-root' },
    panel: { id: 'modal-panel' },
    overlay: { id: 'modal-overlay' },
  }"
>
  <ModalCard title="customProps" :on-close="() => (open = false)">
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
| `teleportTo`          | `string \| false`  | "body"          | Where to teleport the modal. Pass `false` to render in place.                                                          |
| `transition`          | `ModalTransition`  | "fade"          | Enter/leave animation for overlay and panel.                                                                           |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | `false` | Whether the modal is visible. Bound with `v-model`.                          |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Events

| Event              | Payload           | Description                                                                                                                    |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `v-on:close`       | —                 | Emitted when the user dismisses the modal (overlay or Escape). Not emitted when the parent sets `v-model` to `false` directly. |
| `v-on:show-change` | `(show: boolean)` | Emitted when visibility should change (controlled state). Listen with `v-on:show-change`.                                      |

## Related components

Card, DialogAction, ModalAction
