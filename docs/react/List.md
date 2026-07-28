# List

Vertical list container. Use with `ListItem` and `ListSection`.

## Import

```ts
import { List } from "@bridge-ui/react/Components/List";
import { ListItem } from "@bridge-ui/react/Components/ListItem";
import { ListSection } from "@bridge-ui/react/Components/ListSection";
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

### Start and end slots

```tsx
<ListItem
  interactive
  primary="Inbox"
  secondary="12 unread messages"
  slots={{
    end: <span className="text-secondary-400 text-xs">12</span>,
    start: <Mail className="text-secondary-500 size-5" />,
  }}
/>
```

### Selected icon

Selected rows show a check icon by default. Customize it with `selectedIcon` on `ListItem`, or pass `null` to hide it. Providing `slots.end` replaces the selected icon.

```tsx
<List>
  <ListItem selected interactive primary="Inbox" />
  <ListItem selected interactive primary="Starred" selectedIcon={Star} />
  <ListItem selected interactive primary="No icon" selectedIcon={null} />
</List>
```

### Disabled and divider

```tsx
<ListItem interactive primary="Available action" />
<ListItem disabled interactive primary="Disabled action" />
<ListItem divider primary="With divider" />
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

### Sticky section

With the default `as="li"`, sticky styles apply on the section root. The list (or a parent) needs a scroll container with a constrained height.

```tsx
<div className="max-h-48 overflow-y-auto">
  <List>
    <ListSection sticky title="Section A" />
    <ListItem primary="Item A1" />
    <ListSection sticky title="Section B" />
    <ListItem primary="Item B1" />
  </List>
</div>
```

### Inset section

```tsx
<ListSection inset title="With icons below" />
```

## Props (`List`)

| Prop          | Type                    | Default | Description                                                                        |
| ------------- | ----------------------- | ------- | ---------------------------------------------------------------------------------- |
| `as`          | `"nav" \| "ol" \| "ul"` | "ul"    | The element to render as.                                                          |
| `children`    | `ReactNode`             | —       | The children to render.                                                            |
| `classes`     | `ListClasses`           | —       | The classes to apply to the list.                                                  |
| `customProps` | `ListCustomProps`       | —       | Props forwarded to each list part.                                                 |
| `dense`       | `boolean`               | `false` | Compact vertical spacing on items (`ListItem` / `ListSection`), not the list root. |
| `nested`      | `boolean`               | `false` | When true, indents the list for nested navigation/submenus.                        |

## Props (`ListItem`)

| Prop           | Type                                 | Default  | Description                                                                           |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `as`           | `"div" \| "li"`                      | "li"     | The element to render as.                                                             |
| `children`     | `ReactNode`                          | —        | The children to render inside the content column when `primary` is not set.           |
| `classes`      | `ListItemClasses`                    | —        | The classes to apply to the item.                                                     |
| `customProps`  | `ListItemCustomProps`                | —        | Props forwarded to each item part.                                                    |
| `dense`        | `boolean`                            | —        | Compact vertical padding. Inherits `dense` from parent `List` when omitted.           |
| `disabled`     | `boolean`                            | `false`  | When true, the item is not interactive and appears muted.                             |
| `divider`      | `boolean`                            | `false`  | When true, renders a bottom divider on the item.                                      |
| `interactive`  | `boolean`                            | `false`  | When true, applies hover/focus styles and `tabIndex={0}` on the inner wrapper.        |
| `primary`      | `ReactNode`                          | —        | Primary label text. Use `children` or `slots.primary` for custom markup.              |
| `role`         | `"button" \| "menuitem" \| "option"` | "button" | ARIA role for the interactive wrapper. Common values: `menuitem`, `option`, `button`. |
| `secondary`    | `ReactNode`                          | —        | Secondary/description text below the primary line.                                    |
| `selected`     | `boolean`                            | `false`  | When true, highlights the item as selected.                                           |
| `selectedIcon` | `null \| LucideIcon`                 | `Check`  | Icon shown when `selected` is true. Use `null` to hide it. Replaced by `slots.end`.   |
| `slots`        | `ListItemSlots`                      | —        | The slots to apply to the item.                                                       |
| `value`        | `ListboxValue`                       | —        | When set inside a `Select` / `Listbox`, registers this row as a selectable option.    |

## Props (`ListSection`)

| Prop          | Type                     | Default | Description                                                                                                                                                  |
| ------------- | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `as`          | `"div" \| "li"`          | "li"    | The element to render as.                                                                                                                                    |
| `children`    | `ReactNode`              | —       | The children to render. Use `title` for plain text.                                                                                                          |
| `classes`     | `ListSectionClasses`     | —       | The classes to apply to the section.                                                                                                                         |
| `customProps` | `ListSectionCustomProps` | —       | Props forwarded to each section part.                                                                                                                        |
| `inset`       | `boolean`                | `false` | When true, adds left padding to align with items that have leading icons.                                                                                    |
| `sticky`      | `boolean`                | `false` | When true, sticks the heading while scrolling. On `as="li"` (default), sticky + opaque background apply to the root; on `as="div"`, they apply to the title. |
| `title`       | `ReactNode`              | —       | Section label text.                                                                                                                                          |

## Related components

Menu, Select
