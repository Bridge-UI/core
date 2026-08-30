# EmptyState

Placeholder when a list, table, or view has no data. Title, description, optional media, and actions. Pass illustration through the `media` slot or `icon` — Bridge does not ship a stock set.

Does not set `role` by default. Pass `role="status"` when the empty state is a live update.

## Import

```ts
import { EmptyState } from "@bridge-ui/vue/Components/EmptyState";
```

## Examples

### Usage

```vue
<EmptyState
  icon="search"
  title="No projects yet"
  description="Create your first project to get started."
>
  <template #action>
    <Button color="primary">New project</Button>
  </template>
</EmptyState>
```

### Compact

```vue
<EmptyState size="sm" title="No results" description="Try another filter." />
```

### Alignment

```vue
<EmptyState
  align="start"
  title="No files"
  description="Drop a file here to get started."
/>
```

### Heading

Use `title-as` when the page outline needs a heading. The default is `p` so the block is safe inside tables and lists.

```vue
<EmptyState title-as="h2" title="No projects yet" />
```

### Media slot

```vue
<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
>
  <template #media>
    <Icon icon="search" />
  </template>
  <template #action>
    <Button color="primary">New project</Button>
  </template>
  <template #secondary-action>
    <Button variant="flat">Learn more</Button>
  </template>
</EmptyState>
```

### DataTable

Replace the default empty copy with `EmptyState` via `#empty`.

```vue
<DataTable :rows="[]" :columns="columns">
  <template #empty>
    <EmptyState
      size="sm"
      title="No users"
      description="Invite a teammate to get started."
    >
      <template #action>
        <Button size="sm">Invite</Button>
      </template>
    </EmptyState>
  </template>
</DataTable>
```

### customProps

```vue
<EmptyState
  title="No results"
  description="Try another filter."
  :custom-props="{
    title: { id: 'empty-title' },
    media: { 'aria-hidden': true },
    root: { id: 'empty-root', role: 'status' },
    description: { 'aria-describedby': 'empty-title' },
  }"
/>
```

## Props

| Prop              | Type                    | Default    | Description                                                                                                                   |
| ----------------- | ----------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `align`           | `EmptyStateAlign`       | `"center"` | Horizontal alignment of the stack (`start`, `center`, `end`).                                                                 |
| `classes`         | `EmptyStateClasses`     | —          | Part classes (`root`, `media`, `title`, `description`, `actions`, `icon`).                                                    |
| `customProps`     | `EmptyStateCustomProps` | —          | Extra props for internal parts (`media`, `title`, `description`, etc.). Root HTML attributes stay on the component top level. |
| `description`     | `string`                | —          | Supporting copy below the title.                                                                                              |
| `icon`            | `IconSource`            | —          | Default media icon. Use the `media` slot to replace it.                                                                       |
| `mediaDecorative` | `boolean`               | `true`     | When true, the media wrapper is hidden from assistive tech.                                                                   |
| `size`            | `EmptyStateSize`        | `"md"`     | Spacing and typography scale (`sm`, `md`, `lg`).                                                                              |
| `title`           | `string`                | —          | Primary heading copy.                                                                                                         |
| `titleAs`         | `"p" \| "h1"` … `"h6"`  | `"p"`      | Element used to render `title`.                                                                                               |

## Accessibility

Keep default media decorative (`media-decorative`). Set `media-decorative` to `false` when the illustration conveys meaning that is not in the title or description. Use `title-as` with a heading level when the empty state is the main content of the view. For live updates after a filter or fetch, pass `role="status"`.

## Related components

Alert, Card, DataTable, Icon, List, Skeleton, Table
