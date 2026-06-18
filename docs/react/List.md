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

| Prop          | Type                    | Default  | Description                                                                        |
| ------------- | ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| `as`          | `"nav" \| "ol" \| "ul"` | "ul"     | The element to render as.                                                          |
| `children`    | `ReactNode`             | —        | The children to render.                                                            |
| `classes`     | `ListClasses`           | —        | The classes to apply to the list.                                                  |
| `customProps` | `ListCustomProps`       | —        | Props forwarded to each list part.                                                 |
| `dense`       | `boolean`               | `false`  | Compact vertical spacing on items (`ListItem` / `ListSection`), not the list root. |
| `nested`      | `boolean`               | `false`  | When true, indents the list for nested navigation/submenus.                        |
| `padding`     | `ListPadding`           | "normal" | Root padding preset. Use `"none"` inside menus/cards (MUI `disablePadding`).       |

## Related components

ListItem, ListSection, Menu, Select
