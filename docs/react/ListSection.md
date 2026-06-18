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

| Prop          | Type                     | Default | Description                                                               |
| ------------- | ------------------------ | ------- | ------------------------------------------------------------------------- |
| `as`          | `"div" \| "li"`          | "li"    | The element to render as.                                                 |
| `children`    | `ReactNode`              | —       | The children to render. Use `title` for plain text.                       |
| `classes`     | `ListSectionClasses`     | —       | The classes to apply to the section.                                      |
| `customProps` | `ListSectionCustomProps` | —       | Props forwarded to each section part.                                     |
| `inset`       | `boolean`                | `false` | When true, adds left padding to align with items that have leading icons. |
| `sticky`      | `boolean`                | `false` | When true, sticks the heading while scrolling long lists.                 |
| `title`       | `ReactNode`              | —       | Section label text.                                                       |

## Related components

List, ListItem
