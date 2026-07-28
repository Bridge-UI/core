# ListSection

Section heading inside a `List` (subheader).

## Import

```ts
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
<ListSection inset title="With icons below" />
```

### Sticky

With the default `as="li"`, sticky styles apply on the section root (with an opaque background) so the heading can stick while sibling items scroll. Use `as="div"` when you need sticky on the title element itself. The list (or a parent) needs a scroll container with a constrained height.

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

List, ListItem
