# ListItem

List row with primary/secondary text and optional start/end slots.

## Import

```tsx
import { ListItem } from "@bridge-ui/react/Components/ListItem";
```

## Examples

### Usage

```tsx
<ListItem
  primary="Brunch this weekend?"
  secondary="I'll be in your neighborhood doing errands"
/>

<ListItem
  interactive
  primary="Settings"
  onClick={() => {}}
/>
```

### Start and end slots

```tsx
<ListItem
  interactive
  primary="Inbox"
  secondary="12 unread messages"
  slots={{
    start: <Mail className="text-secondary-500 size-5" />,
    end: <span className="text-secondary-400 text-xs">12</span>,
  }}
/>
```

### Disabled and divider

```tsx
<ListItem primary="Available action" interactive />
<ListItem primary="Disabled action" interactive disabled />
<ListItem primary="With divider" divider />
```

### customProps

```tsx
<ListItem
  interactive
  primary="Profile"
  secondary="Manage your account"
  customProps={{
    root: { id: "profile-item" },
    primary: { id: "profile-primary" },
    interactive: { "aria-labelledby": "profile-primary" },
  }}
/>
```

## Props

| Prop          | Type                                 | Default  | Description                                                                           |
| ------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `align`       | `ListItemAlign`                      | "center" | Vertical alignment of start/content/end slots.                                        |
| `as`          | `"div" \| "li"`                      | "li"     | The element to render as.                                                             |
| `children`    | `ReactNode`                          | —        | The children to render inside the content column when `primary` is not set.           |
| `classes`     | `ListItemClasses`                    | —        | The classes to apply to the item.                                                     |
| `customProps` | `ListItemCustomProps`                | —        | Props forwarded to each item part.                                                    |
| `dense`       | `boolean`                            | —        | Compact vertical padding. Inherits `dense` from parent `List` when omitted.           |
| `disabled`    | `boolean`                            | `false`  | When true, the item is not interactive and appears muted.                             |
| `divider`     | `boolean`                            | `false`  | When true, renders a bottom divider on the item.                                      |
| `interactive` | `boolean`                            | `false`  | When true, applies hover/focus styles and `tabIndex={0}` on the inner wrapper.        |
| `primary`     | `ReactNode`                          | —        | Primary label text. Use `children` or `slots.primary` for custom markup.              |
| `role`        | `"button" \| "menuitem" \| "option"` | "button" | ARIA role for the interactive wrapper. Common values: `menuitem`, `option`, `button`. |
| `secondary`   | `ReactNode`                          | —        | Secondary/description text below the primary line.                                    |
| `selected`    | `boolean`                            | `false`  | When true, highlights the item as selected.                                           |
| `slots`       | `ListItemSlots`                      | —        | The slots to apply to the item.                                                       |

## Related components

List, ListSection, Menu
