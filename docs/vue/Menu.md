# Menu

Anchored floating panel for actions and dropdowns. Control with `v-model` / `show`.

## Import

```vue
import { Menu } from "@bridge-ui/vue/Components/Menu";
```

## Examples

### Usage

```vue
<Menu v-model="open">
  <template #trigger>
    <Button v-on:click="open = true">Open menu</Button>
  </template>

  <MenuContent v-on:action="open = false" />
</Menu>
```

### Placement

```vue
<Menu v-model="open" placement="bottom-end">
  <template #trigger>
    <Button v-on:click="open = true">Open menu</Button>
  </template>

  <MenuContent />
</Menu>
```

### Persistent

```vue
<Menu v-model="open" persistent>
  <template #trigger>
    <Button v-on:click="open = true">Open persistent</Button>
  </template>

  <MenuContent />
</Menu>
```

### anchorEl

```vue
<div ref="anchorRef">
  <Button v-on:click="open = true">External anchor</Button>
</div>

<Menu v-model="open" :anchor-el="anchorRef">
  <MenuContent />
</Menu>
```

## Props

| Prop                | Type                      | Default        | Description                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchorEl`          | `HTMLElement \| null`     | —              | Element that anchors the menu panel (MUI `anchorEl`). When set, it is used for positioning and click-away instead of the `trigger` slot wrapper. Prefer this when the opener lives outside the `Menu` or is controlled manually. Not merged into Bridge defaults (DOM nodes must not be deep-merged). |
| `classes`           | `MenuClasses`             | —              | The classes to apply to the menu.                                                                                                                                                                                                                                                                     |
| `closeOnClickAway`  | `boolean`                 | `true`         | Whether the menu closes when clicking outside the trigger and panel.                                                                                                                                                                                                                                  |
| `closeOnEscape`     | `boolean`                 | `true`         | Whether the menu closes on escape key press.                                                                                                                                                                                                                                                          |
| `customProps`       | `MenuCustomProps`         | —              | Props forwarded to each menu part.                                                                                                                                                                                                                                                                    |
| `disableAutoFocus`  | `boolean`                 | `false`        | When true, the menu does not auto-focus the first focusable item on open.                                                                                                                                                                                                                             |
| `disableScrollLock` | `boolean`                 | `true`         | When true, body scroll is not locked while the menu is open.                                                                                                                                                                                                                                          |
| `keepMounted`       | `boolean`                 | `false`        | When true, the menu stays mounted in the DOM after closing (hidden).                                                                                                                                                                                                                                  |
| `offset`            | `number`                  | 4              | Gap between the trigger and the menu panel (px).                                                                                                                                                                                                                                                      |
| `onShowChange`      | `(show: boolean) => void` | —              | Called when `show` should change (controlled state without `v-model`).                                                                                                                                                                                                                                |
| `persistent`        | `boolean`                 | `false`        | When true, escape and click-away do not close the menu.                                                                                                                                                                                                                                               |
| `placement`         | `PositionPlacement`       | "bottom-start" | Preferred placement of the menu relative to the anchor (Floating UI).                                                                                                                                                                                                                                 |
| `rounded`           | `MenuRounded`             | "md"           | The roundedness of the menu panel.                                                                                                                                                                                                                                                                    |
| `shadow`            | `MenuShadow`              | "md"           | The shadow to apply to the menu panel.                                                                                                                                                                                                                                                                |
| `strategy`          | `PositionStrategy`        | "fixed"        | CSS position strategy for the floating panel.                                                                                                                                                                                                                                                         |
| `teleportTo`        | `string \| false`         | "body"         | Where to portal the menu panel. Pass `false` to render in place.                                                                                                                                                                                                                                      |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | `false` | Whether the menu is open. Bound with `v-model`.                              |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Events

| Event        | Payload | Description                                                                                                                      |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `v-on:close` | —       | Emitted when the user dismisses the menu (Escape or click-away). Not emitted when the parent sets `v-model` to `false` directly. |

## Related components

List, ListItem, Select, Button
