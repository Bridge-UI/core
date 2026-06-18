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

<ListItem primary="Settings" interactive onClick={() => {}} />
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

| Prop          | Type                                 | Default    | Description                            |
| ------------- | ------------------------------------ | ---------- | -------------------------------------- |
| `disabled`    | `boolean`                            | `false`    | Disabled row                           |
| `divider`     | `boolean`                            | `false`    | Bottom divider                         |
| `interactive` | `boolean`                            | `false`    | Clickable row                          |
| `primary`     | `ReactNode`                          | —          | Main text                              |
| `role`        | `"button" \| "menuitem" \| "option"` | `"button"` | ARIA role                              |
| `secondary`   | `ReactNode`                          | —          | Secondary line                         |
| `selected`    | `boolean`                            | `false`    | Selected state                         |
| `slots`       | `ListItemSlots`                      | —          | `start`, `end`, `primary`, `secondary` |

## Related components

List, ListSection, Menu
