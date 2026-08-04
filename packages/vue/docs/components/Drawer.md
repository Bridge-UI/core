# Drawer

Drawer overlay docked to a viewport edge, with portal, backdrop, and focus management. Put any content inside.

## Import

```ts
import { Drawer } from "@bridge-ui/vue/Components/Drawer";
```

## Examples

### Usage

```vue
<Button v-on:click="open = true">Open drawer</Button>

<Drawer v-model="open">
  <Card title="Filters" :on-close="() => (open = false)">
    Drawer content goes here.
  </Card>
</Drawer>
```

### Persistent

```vue
<Drawer persistent v-model="open">
  <Card title="Persistent drawer" :on-close="() => (open = false)">
    Clicking the backdrop or pressing Escape has no effect.
  </Card>
</Drawer>
```

### Placement

```vue
<Drawer v-model="open" placement="right">
  <Card title="Right drawer" :on-close="() => (open = false)">
    Docks to the right edge instead of the default left.
  </Card>
</Drawer>
```

### Bottom sheet

```vue
<Drawer v-model="open" placement="bottom">
  <Card title="Bottom sheet" :on-close="() => (open = false)">
    Docks to the bottom edge; `size` controls the sheet height.
  </Card>
</Drawer>
```

### Full composition (Card)

```vue
<Drawer blur="md" size="lg" v-model="open" transition="slide">
  <Card
    borderless
    shadow="lg"
    rounded="none"
    padding="large"
    variant="elevated"
    title="Edit filters"
  >
    Large drawer with Card title, body, and footer slots.

    <template #footer>
      <Button size="sm" color="error" variant="flat" v-on:click="open = false">
        Discard
      </Button>

      <Button size="sm" color="primary" v-on:click="open = false">Save</Button>
    </template>
  </Card>
</Drawer>
```

### customProps

```vue
<Drawer
  v-model="open"
  :custom-props="{
    root: { id: 'drawer-root' },
    panel: { id: 'drawer-panel' },
    overlay: { id: 'drawer-overlay' },
  }"
>
  <Card title="customProps" :on-close="() => (open = false)">
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
| `placement`           | `DrawerPlacement`   | "left"  | Edge the panel docks to.                                                                   |
| `scroll`              | `DrawerScroll`      | "paper" | Where scroll happens: the page (`body`) or the drawer panel (`paper`).                     |
| `size`                | `DrawerSize`        | "md"    | Panel size along the placement axis (width for `left`/`right`, height for `top`/`bottom`). |
| `teleportTo`          | `string \| false`   | "body"  | Where to teleport the drawer. Pass `false` to render in place.                             |
| `transition`          | `DrawerTransition`  | "slide" | Enter/leave animation for overlay and panel.                                               |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | `false` | Whether the drawer is visible. Bound with `v-model`.                         |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Events

| Event              | Payload           | Description                                                                                                                     |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `v-on:close`       | —                 | Emitted when the user dismisses the drawer (overlay or Escape). Not emitted when the parent sets `v-model` to `false` directly. |
| `v-on:show-change` | `(show: boolean)` | Emitted when visibility should change (controlled state). Listen with `v-on:show-change`.                                       |

## Related components

Card, useDialogAction, useDrawerAction, useModalAction
