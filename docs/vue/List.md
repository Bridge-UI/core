# List

Vertical list container. Use with `ListItem` and `ListSection`.

## Import

```vue
import { List } from "@bridge-ui/vue/Components/List";
```

## Examples

### Usage

```vue
<List>
  <ListItem primary="Inbox" secondary="12 messages" />
  <ListItem primary="Drafts" secondary="3 items" />
  <ListItem primary="Sent" />
</List>
```

### Sections

```vue
<List>
  <ListSection title="Folders" />
  <ListItem primary="Inbox" />
  <ListItem primary="Drafts" />
  <ListSection title="Labels" />
  <ListItem primary="Important" />
</List>
```

### Interactive

```vue
<List role="menu">
  <ListItem
    interactive
    role="menuitem"
    primary="Profile"
    :selected="selected === 'profile'"
    @click="selected = 'profile'"
  />
  <ListItem
    interactive
    role="menuitem"
    primary="Settings"
    :selected="selected === 'settings'"
    @click="selected = 'settings'"
  />
</List>
```

### Nested

```vue
<List>
  <ListItem primary="Documents" />
  <List nested>
    <ListItem primary="Reports" />
    <ListItem primary="Invoices" />
  </List>
  <ListItem primary="Settings" />
</List>
```

## Props

| Prop      | Type                    | Default    | Description         |
| --------- | ----------------------- | ---------- | ------------------- |
| `as`      | `"ul" \| "ol" \| "nav"` | `"ul"`     | Root element        |
| `dense`   | `boolean`               | `false`    | Compact rows        |
| `nested`  | `boolean`               | `false`    | Nested list styling |
| `padding` | `"normal" \| "none"`    | `"normal"` | List padding        |

## Related components

ListItem, ListSection, Menu, Select
