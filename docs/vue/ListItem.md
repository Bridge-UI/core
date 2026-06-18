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

<ListItem interactive primary="Settings" v-on:click="onSettings" />
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

| Prop          | Type                                 | Default  | Description                                                                    |
| ------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| `align`       | `ListItemAlign`                      | "center" | Vertical alignment of start/content/end slots.                                 |
| `as`          | `"div" \| "li"`                      | "li"     | The element to render as.                                                      |
| `classes`     | `ListItemClasses`                    | —        | The classes to apply to the item.                                              |
| `customProps` | `ListItemCustomProps`                | —        | Props forwarded to each item part.                                             |
| `dense`       | `boolean`                            | —        | Compact vertical padding. Inherits `dense` from parent `List` when omitted.    |
| `disabled`    | `boolean`                            | `false`  | When true, the item is not interactive and appears muted.                      |
| `divider`     | `boolean`                            | `false`  | When true, renders a bottom divider on the item.                               |
| `interactive` | `boolean`                            | `false`  | When true, applies hover/focus styles and `tabIndex={0}` on the inner wrapper. |
| `primary`     | `string`                             | —        | Primary label text.                                                            |
| `role`        | `"button" \| "menuitem" \| "option"` | "button" | ARIA role for the interactive wrapper.                                         |
| `secondary`   | `string`                             | —        | Secondary/description text below the primary line.                             |
| `selected`    | `boolean`                            | `false`  | When true, highlights the item as selected.                                    |

## Related components

List, ListSection, Menu
