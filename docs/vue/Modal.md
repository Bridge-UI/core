# Modal

Modal overlay with portal, backdrop, and focus management. Put `Card` or any content inside.

## Import

```vue
import { Modal } from "@bridge-ui/vue/Components/Modal";
```

## Examples

### Usage

```vue
<Button @click="open = true">Open modal</Button>

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
    <Button size="sm" @click="innerOpen = true">Open nested modal</Button>
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
<Modal v-model="open" size="lg" blur="md" transition="slide-up">
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
      <Button size="sm" variant="flat" color="error" @click="open = false">
        Discard
      </Button>

      <Button size="sm" color="primary" @click="open = false">Save</Button>
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

| Prop             | Type                | Default           | Description          |
| ---------------- | ------------------- | ----------------- | -------------------- |
| `align`          | `ModalAlign`        | `"middle-center"` | Panel position       |
| `blur`           | `ModalBlur`         | `"none"`          | Backdrop blur        |
| `closeOnEscape`  | `boolean`           | `true`            | Escape closes        |
| `closeOnOverlay` | `boolean`           | `true`            | Overlay click closes |
| `modelValue`     | `boolean`           | `false`           | Open state           |
| `persistent`     | `boolean`           | `false`           | Block dismiss        |
| `scroll`         | `"body" \| "panel"` | `"body"`          | Scroll container     |
| `size`           | `ModalSize`         | `"md"`            | Panel width          |
| `teleportTo`     | `string \| false`   | `"body"`          | Portal target        |
| `transition`     | `ModalTransition`   | `"fade"`          | Enter/exit animation |

## Related components

Card, DialogAction, ModalAction
