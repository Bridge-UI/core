# List

Vertical list container. Use with `ListItem` and `ListSection`.

## Import

```tsx
import { List } from "@bridge-ui/react/Components/List";
```

## Examples

### Usage

```tsx
<List>
  <ListItem primary="Inbox" secondary="12 messages" />
  <ListItem primary="Drafts" secondary="3 items" />
  <ListItem primary="Sent" />
</List>
```

### Sections

```tsx
<List>
  <ListSection title="Folders" />
  <ListItem primary="Inbox" />
  <ListItem primary="Drafts" />
  <ListSection title="Labels" />
  <ListItem primary="Important" />
</List>
```

### Interactive

```tsx
<List role="menu">
  <ListItem
    interactive
    role="menuitem"
    primary="Profile"
    selected={selected === "profile"}
    customProps={{
      interactive: { onClick: () => setSelected("profile") },
    }}
  />
  <ListItem
    interactive
    role="menuitem"
    primary="Settings"
    selected={selected === "settings"}
    customProps={{
      interactive: { onClick: () => setSelected("settings") },
    }}
  />
</List>
```

### Nested

```tsx
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
