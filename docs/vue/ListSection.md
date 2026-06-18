# ListSection

Section heading inside a `List` (subheader).

## Import

```vue
import { ListSection } from "@bridge-ui/vue/Components/ListSection";
```

## Examples

### Usage

```vue
<List>
  <ListSection title="Folders" />
  <ListItem primary="Inbox" />
  <ListItem primary="Drafts" />
</List>
```

### Inset

```vue
<ListSection title="With icons below" inset />
```

### Sticky

```vue
<div class="max-h-48 overflow-y-auto">
  <List>
    <ListSection title="Section A" sticky />
    <ListItem primary="Item A1" />
    <ListSection title="Section B" sticky />
    <ListItem primary="Item B1" />
  </List>
</div>
```

### customProps

```vue
<ListSection
  title="Account"
  :custom-props="{
    root: { id: 'account-section' },
    title: { id: 'account-section-title' },
  }"
/>
```

## Props

| Prop     | Type      | Default | Description      |
| -------- | --------- | ------- | ---------------- |
| `inset`  | `boolean` | `false` | Indented heading |
| `sticky` | `boolean` | `false` | Sticky subheader |
| `title`  | `string`  | —       | Section title    |

## Related components

List, ListItem
