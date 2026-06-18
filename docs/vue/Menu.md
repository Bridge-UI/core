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
    <Button @click="open = true">Open menu</Button>
  </template>

  <MenuContent @action="open = false" />
</Menu>
```

### Placement

```vue
<Menu v-model="open" placement="bottom-end">
  <template #trigger>
    <Button @click="open = true">Open menu</Button>
  </template>

  <MenuContent />
</Menu>
```

### Persistent

```vue
<Menu v-model="open" persistent>
  <template #trigger>
    <Button @click="open = true">Open persistent</Button>
  </template>

  <MenuContent />
</Menu>
```

### anchorEl

```vue
<div ref="anchorRef">
  <Button @click="open = true">External anchor</Button>
</div>

<Menu v-model="open" :anchor-el="anchorRef">
  <MenuContent />
</Menu>
```

## Props

| Prop               | Type              | Default          | Description             |
| ------------------ | ----------------- | ---------------- | ----------------------- |
| `anchorEl`         | `HTMLElement`     | —                | External anchor element |
| `closeOnClickAway` | `boolean`         | `true`           | Close on outside click  |
| `closeOnEscape`    | `boolean`         | `true`           | Close on Escape         |
| `modelValue`       | `boolean`         | `false`          | Open state              |
| `offset`           | `number`          | `8`              | Gap from anchor         |
| `persistent`       | `boolean`         | `false`          | Block dismiss           |
| `placement`        | `MenuPlacement`   | `"bottom-start"` | Panel position          |
| `shadow`           | `Shadow`          | `"md"`           | Panel shadow            |
| `teleportTo`       | `string \| false` | `"body"`         | Portal target           |

## Related components

List, ListItem, Select, Button
