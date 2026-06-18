# ListSection

Section heading inside a `List` (subheader).

## Import

```tsx
import { ListSection } from "@bridge-ui/react/Components/ListSection";
```

## Examples

### Usage

```tsx
<List>
  <ListSection title="Folders" />
  <ListItem primary="Inbox" />
  <ListItem primary="Drafts" />
</List>
```

### Inset

```tsx
<ListSection title="With icons below" inset />
```

### Sticky

```tsx
<div className="max-h-48 overflow-y-auto">
  <List>
    <ListSection title="Section A" sticky />
    <ListItem primary="Item A1" />
    <ListSection title="Section B" sticky />
    <ListItem primary="Item B1" />
  </List>
</div>
```

### customProps

```tsx
<ListSection
  title="Account"
  customProps={{
    root: { id: "account-section" },
    title: { id: "account-section-title" },
  }}
/>
```

## Props

| Prop     | Type        | Default | Description      |
| -------- | ----------- | ------- | ---------------- |
| `inset`  | `boolean`   | `false` | Indented heading |
| `sticky` | `boolean`   | `false` | Sticky subheader |
| `title`  | `ReactNode` | —       | Section title    |

## Related components

List, ListItem
