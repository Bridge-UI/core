# ListItem

List row with primary/secondary text and optional start/end slots.

## Import

```vue
import { ListItem } from "@bridge-ui/vue/Components/ListItem";
```

## Examples

### Usage

```vue
<ListItem
  primary="Brunch this weekend?"
  secondary="I'll be in your neighborhood doing errands"
/>

<ListItem primary="Settings" interactive @click="onSettings" />
```

### Start and end slots

```vue
<ListItem interactive primary="Inbox" secondary="12 unread messages">
  <template #start>
    <Mail class="text-secondary-500 size-5" />
  </template>

  <template #end>
    <span class="text-secondary-400 text-xs">12</span>
  </template>
</ListItem>
```

### Disabled and divider

```vue
<ListItem primary="Available action" interactive />
<ListItem primary="Disabled action" interactive disabled />
<ListItem primary="With divider" divider />
```

### customProps

```vue
<ListItem
  interactive
  primary="Profile"
  secondary="Manage your account"
  :custom-props="{
    root: { id: 'profile-item' },
    primary: { id: 'profile-primary' },
    interactive: { 'aria-labelledby': 'profile-primary' },
  }"
/>
```

## Props

| Prop          | Type                                 | Default    | Description                            |
| ------------- | ------------------------------------ | ---------- | -------------------------------------- |
| `disabled`    | `boolean`                            | `false`    | Disabled row                           |
| `divider`     | `boolean`                            | `false`    | Bottom divider                         |
| `interactive` | `boolean`                            | `false`    | Clickable row                          |
| `primary`     | `string`                             | —          | Main text                              |
| `role`        | `"button" \| "menuitem" \| "option"` | `"button"` | ARIA role                              |
| `secondary`   | `string`                             | —          | Secondary line                         |
| `selected`    | `boolean`                            | `false`    | Selected state                         |
| slots         | `ListItemSlots`                      | —          | `start`, `end`, `primary`, `secondary` |

## Related components

List, ListSection, Menu
