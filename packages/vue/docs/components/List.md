# List

Vertical list container. Use with `ListItem` and `ListSection`.

## Import

```ts
import { List } from "@bridge-ui/vue/Components/List";
import { ListItem } from "@bridge-ui/vue/Components/ListItem";
import { ListSection } from "@bridge-ui/vue/Components/ListSection";
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

### Selected icon

Selected rows show a check icon by default. Customize it with `selectedIcon` on `ListItem`, or pass `null` to hide it. Providing the `#end` slot replaces the selected icon.

```vue
<List>
  <ListItem selected interactive primary="Inbox" />
  <ListItem selected interactive primary="Starred" :selected-icon="Star" />
  <ListItem selected interactive primary="No icon" :selected-icon="null" />
</List>
```

### Disabled and divider

```vue
<ListItem interactive primary="Available action" />
<ListItem disabled interactive primary="Disabled action" />
<ListItem divider primary="With divider" />
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

### Sticky section

With the default `as="li"`, sticky styles apply on the section root. The list (or a parent) needs a scroll container with a constrained height.

```vue
<div class="max-h-48 overflow-y-auto">
  <List>
    <ListSection sticky title="Section A" />
    <ListItem primary="Item A1" />
    <ListSection sticky title="Section B" />
    <ListItem primary="Item B1" />
  </List>
</div>
```

### Inset section

```vue
<ListSection inset title="With icons below" />
```

### Icon only

Hide section labels and item text so only the `start` slot remains. Nested `List` inherits `icon-only`. Use with `Sidebar` `collapsible="icon"`.

```vue
<List icon-only>
  <ListSection title="Application" />
  <ListItem interactive primary="Home">
    <template #start>
      <Icon icon="user" />
    </template>
  </ListItem>
</List>
```

## Props (`List`)

| Prop          | Type                    | Default | Description                                                                                  |
| ------------- | ----------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `as`          | `"nav" \| "ol" \| "ul"` | "ul"    | The element to render as.                                                                    |
| `classes`     | `ListClasses`           | —       | The classes to apply to the list.                                                            |
| `customProps` | `ListCustomProps`       | —       | Props forwarded to each list part.                                                           |
| `dense`       | `boolean`               | `false` | Compact vertical spacing on items (`ListItem` / `ListSection`), not the list root.           |
| `iconOnly`    | `boolean`               | `false` | Hide section labels and item text so only leading icons remain. Nested `List` inherits this. |
| `nested`      | `boolean`               | `false` | When true, indents the list for nested navigation/submenus.                                  |

## Props (`ListItem`)

| Prop           | Type                                 | Default  | Description                                                                        |
| -------------- | ------------------------------------ | -------- | ---------------------------------------------------------------------------------- |
| `as`           | `"div" \| "li"`                      | "li"     | The element to render as.                                                          |
| `classes`      | `ListItemClasses`                    | —        | The classes to apply to the item.                                                  |
| `customProps`  | `ListItemCustomProps`                | —        | Props forwarded to each item part.                                                 |
| `dense`        | `boolean`                            | —        | Compact vertical padding. Inherits `dense` from parent `List` when omitted.        |
| `disabled`     | `boolean`                            | `false`  | When true, the item is not interactive and appears muted.                          |
| `divider`      | `boolean`                            | `false`  | When true, renders a bottom divider on the item.                                   |
| `interactive`  | `boolean`                            | `false`  | When true, applies hover/focus styles and `tabIndex={0}` on the inner wrapper.     |
| `primary`      | `string`                             | —        | Primary label text.                                                                |
| `role`         | `"button" \| "menuitem" \| "option"` | "button" | ARIA role for the interactive wrapper.                                             |
| `secondary`    | `string`                             | —        | Secondary/description text below the primary line.                                 |
| `selected`     | `boolean`                            | `false`  | When true, highlights the item as selected.                                        |
| `selectedIcon` | `null \| LucideIcon`                 | `Check`  | Icon shown when `selected` is true. Use `null` to hide it. Replaced by `#end`.     |
| `value`        | `ListboxValue`                       | —        | When set inside a `Select` / `Listbox`, registers this row as a selectable option. |

## Props (`ListSection`)

| Prop          | Type                     | Default | Description                                                                                                                                                  |
| ------------- | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `as`          | `"div" \| "li"`          | "li"    | The element to render as.                                                                                                                                    |
| `classes`     | `ListSectionClasses`     | —       | The classes to apply to the section.                                                                                                                         |
| `customProps` | `ListSectionCustomProps` | —       | Props forwarded to each section part.                                                                                                                        |
| `inset`       | `boolean`                | `false` | When true, adds left padding to align with items that have leading icons.                                                                                    |
| `sticky`      | `boolean`                | `false` | When true, sticks the heading while scrolling. On `as="li"` (default), sticky + opaque background apply to the root; on `as="div"`, they apply to the title. |
| `title`       | `string`                 | —       | Section label text.                                                                                                                                          |

## Related components

Menu, Select, Sidebar
