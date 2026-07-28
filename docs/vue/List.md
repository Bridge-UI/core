# List

Vertical list container. Use with `ListItem` and `ListSection`.

## Import

```ts
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
    v-on:click="selected = 'profile'"
    :selected="selected === 'profile'"
  />
  <ListItem
    interactive
    role="menuitem"
    primary="Settings"
    v-on:click="selected = 'settings'"
    :selected="selected === 'settings'"
  />
</List>
```

### Selected icon

Selected rows show a check icon by default. Customize it with `selectedIcon` on `ListItem`, or pass `null` to hide it.

```vue
<List>
  <ListItem selected interactive primary="Inbox" />
  <ListItem selected interactive primary="Starred" :selected-icon="Star" />
  <ListItem selected interactive primary="No icon" :selected-icon="null" />
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

| Prop          | Type                    | Default | Description                                                                        |
| ------------- | ----------------------- | ------- | ---------------------------------------------------------------------------------- |
| `as`          | `"nav" \| "ol" \| "ul"` | "ul"    | The element to render as.                                                          |
| `classes`     | `ListClasses`           | —       | The classes to apply to the list.                                                  |
| `customProps` | `ListCustomProps`       | —       | Props forwarded to each list part.                                                 |
| `dense`       | `boolean`               | `false` | Compact vertical spacing on items (`ListItem` / `ListSection`), not the list root. |
| `nested`      | `boolean`               | `false` | When true, indents the list for nested navigation/submenus.                        |

## Related components

ListItem, ListSection, Menu, Select
