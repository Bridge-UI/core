# EmptyState

Placeholder when a list, table, or view has no data. Title, description, optional media, and actions. Pass illustration through `slots.media` or `icon` — Bridge does not ship a stock set.

Does not set `role` by default. Pass `role="status"` when the empty state is a live update.

## Import

```ts
import { EmptyState } from "@bridge-ui/react/Components/EmptyState";
```

## Examples

### Usage

```tsx
<EmptyState
  icon="search"
  title="No projects yet"
  description="Create your first project to get started."
  slots={{
    action: <Button color="primary">New project</Button>,
  }}
/>
```

### Compact

```tsx
<EmptyState size="sm" title="No results" description="Try another filter." />
```

### Alignment

```tsx
<EmptyState
  align="start"
  title="No files"
  description="Drop a file here to get started."
/>
```

### Heading

Use `titleAs` when the page outline needs a heading. The default is `p` so the block is safe inside tables and lists.

```tsx
<EmptyState titleAs="h2" title="No projects yet" />
```

### Media slot

```tsx
<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  slots={{
    media: <Icon icon="search" />,
    action: (
      <>
        <Button color="primary">New project</Button>
        <Button variant="flat">Learn more</Button>
      </>
    ),
  }}
/>
```

### DataTable

Override the DataTable default with a richer `EmptyState` via `slots.empty`.

```tsx
<DataTable
  rows={[]}
  columns={columns}
  slots={{
    empty: (
      <EmptyState
        size="sm"
        title="No users"
        description="Invite a teammate to get started."
        slots={{
          action: <Button size="sm">Invite</Button>,
        }}
      />
    ),
  }}
/>
```

### customProps

```tsx
<EmptyState
  title="No results"
  description="Try another filter."
  customProps={{
    title: { id: "empty-title" },
    media: { "aria-hidden": true },
    root: { id: "empty-root", role: "status" },
    description: { "aria-describedby": "empty-title" },
  }}
/>
```

## Props

| Prop              | Type                    | Default    | Description                                                                                                                   |
| ----------------- | ----------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `align`           | `EmptyStateAlign`       | `"center"` | Horizontal alignment of the stack (`start`, `center`, `end`).                                                                 |
| `classes`         | `EmptyStateClasses`     | —          | Part classes (`root`, `media`, `title`, `description`, `actions`, `icon`).                                                    |
| `customProps`     | `EmptyStateCustomProps` | —          | Extra props for internal parts (`media`, `title`, `description`, etc.). Root HTML attributes stay on the component top level. |
| `description`     | `ReactNode`             | —          | Supporting copy below the title.                                                                                              |
| `icon`            | `IconSource`            | —          | Default media icon. Use `slots.media` to replace it.                                                                          |
| `mediaDecorative` | `boolean`               | `true`     | When true, the media wrapper is hidden from assistive tech.                                                                   |
| `size`            | `EmptyStateSize`        | `"md"`     | Spacing and typography scale (`sm`, `md`, `lg`).                                                                              |
| `slots`           | `EmptyStateSlots`       | —          | `media`, `title`, `description`, `action`.                                                                                    |
| `title`           | `ReactNode`             | —          | Primary heading copy.                                                                                                         |
| `titleAs`         | `"p" \| "h1"` … `"h6"`  | `"p"`      | Element used to render `title`.                                                                                               |

## Accessibility

Keep default media decorative (`mediaDecorative`). Set `mediaDecorative={false}` when the illustration conveys meaning that is not in the title or description. Use `titleAs` with a heading level when the empty state is the main content of the view. For live updates after a filter or fetch, pass `role="status"`.

## Related components

Alert, Card, DataTable, Icon, List, Skeleton, Table
