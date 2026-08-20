# DataTable

Opinionated data grid: columns, rows, sorting, selection, empty/loading, and pagination wiring. Layout is CSS grid (`div` + table ARIA roles) so cells can flex, stick, and resize. DataTable owns its chrome tokens (`plain` / `ghost` / `bordered`, `size`, `striped`, `hoverable`); defaults match `Table` but registry overrides are independent. Apps own the fetch; Bridge owns interaction and chrome.

## Import

```ts
import { DataTable } from "@bridge-ui/react/Components/DataTable";
```

## Examples

### Usage

```tsx
<DataTable
  rows={users}
  sorting={sorting}
  getRowId={(row) => row.id}
  onSortingChange={setSorting}
  columns={[
    { id: "name", header: "Name", cell: (row) => row.name },
    { id: "role", header: "Role", cell: (row) => row.role, sortable: true },
  ]}
/>
```

### Variants

DataTable chrome (`plain` / `ghost` / `bordered`). Built-in `Pagination` follows the matching variant unless `slots.pagination` overrides it:

```tsx
<DataTable rows={users} variant="plain" columns={columns} />
<DataTable rows={users} variant="ghost" columns={columns} />
<DataTable rows={users} variant="bordered" columns={columns} />
```

| DataTable `variant` | Pagination `variant` |
| ------------------- | -------------------- |
| `plain`             | `text`               |
| `ghost`             | `ghost`              |
| `bordered`          | `outlined`           |

`striped` is independent of variant:

```tsx
<DataTable striped rows={users} columns={columns} />
```

### Selection + pagination

Built-in Pagination when `page` / `pageCount` are set. `rows` is the current page (server fetch stays in the app):

```tsx
<DataTable
  page={page}
  rows={users}
  columns={columns}
  selection={selected}
  pageCount={pageCount}
  onPageChange={setPage}
  getRowId={(row) => row.id}
  onSelectionChange={setSelected}
/>
```

Slot replaces the built-in control (cursor / `mode="simple"`, custom chrome):

```tsx
<DataTable
  rows={users}
  columns={columns}
  getRowId={(row) => row.id}
  slots={{
    pagination: (
      <Pagination
        mode="simple"
        hasNext={Boolean(nextCursor)}
        onNext={() => fetchPage(nextCursor)}
        hasPrevious={Boolean(prevCursor)}
        onPrevious={() => fetchPage(prevCursor)}
      />
    ),
  }}
/>
```

### Empty and loading

```tsx
<DataTable
  rows={[]}
  columns={columns}
  loading={isLoading}
  slots={{
    empty: "No users",
  }}
/>
```

Install `@tanstack/react-table` next to `@bridge-ui/react` when you use `DataTable`. The public API stays `columns` / `rows` / `sorting` / `selection` / `filters` / `hiddenColumns` / `expanded` — the table engine is not exported.

### Columns

Cell content is the column accessor (`row[id]`, or `accessor`) unless you override it. `cell` on the column is for portable renderers. An `item` slot wins over `cell`.

```tsx
<DataTable
  rows={users}
  columns={[
    { id: "name", header: "Name" },
    { id: "role", header: "Role" },
  ]}
  slots={{
    item: {
      role: ({ row }) => <Badge>{row.role}</Badge>,
    },
  }}
/>
```

```tsx
{
  id: "role",
  header: "Role",
  cell: (row) => <Badge>{row.role}</Badge>,
}
```

Table-level `slots` are `empty`, `expanded`, `item`, `loading`, `pagination`, and `toolbar`.

### Selection

`selectionMode="multiple"` (default) uses checkboxes and select-all. `selectionMode="single"` uses radios and keeps at most one id. `selection` is always `string[]`.

```tsx
<DataTable
  rows={users}
  columns={columns}
  selection={selected}
  selectionMode="single"
  getRowId={(row) => row.id}
  onSelectionChange={setSelected}
/>
```

### Filters

Set `filters` on a column to show a funnel in that header. The panel uses checkboxes (`filterMultiple`, default) or radios (`filterMultiple={false}`). Nested `children` render as a group in the same panel. **OK** commits; **Reset** clears the draft (commit on **OK**); closing without **OK** discards it.

```tsx
<DataTable
  rows={users}
  filters={filters}
  onFiltersChange={setFilters}
  columns={[
    {
      id: "role",
      header: "Role",
      cell: (row) => row.role,
      filters: [
        { label: "Engineer", value: "Engineer" },
        { label: "Researcher", value: "Researcher" },
      ],
    },
  ]}
/>
```

Client-side filtering applies when the table is not server-paged (`page` + `pageCount`). With server paging, `filters` is still controlled — the app owns the fetch.

### Sticky columns

`sticky="start"` or `sticky="end"` pins a column while the grid scrolls horizontally. Selection and expand chrome pin to start when any data column uses `sticky="start"`.

```tsx
<DataTable
  rows={users}
  columns={[
    {
      id: "name",
      width: 160,
      header: "Name",
      sticky: "start",
      cell: (row) => row.name,
    },
    { id: "role", header: "Role", cell: (row) => row.role },
    {
      id: "actions",
      header: "Actions",
      sticky: "end",
      cell: (row) => row.id,
    },
  ]}
/>
```

### Ellipsis

`ellipsis` truncates overflowing cell text. The tooltip uses the column accessor (or `row[id]`).

```tsx
<DataTable
  rows={users}
  columns={[
    {
      id: "name",
      header: "Name",
      ellipsis: true,
      cell: (row) => row.name,
    },
  ]}
/>
```

### Column visibility

Pass `hiddenColumns` and/or `onHiddenColumnsChange` to show a **Columns** control in the toolbar. `hideable={false}` keeps a column out of the toggle (or disabled). At least one column stays visible.

```tsx
<DataTable
  rows={users}
  columns={columns}
  hiddenColumns={hidden}
  onHiddenColumnsChange={setHidden}
/>
```

### Expand

Controlled `expanded` row ids. `slots.expanded` renders in a spanning row under the data row.

```tsx
<DataTable
  rows={users}
  columns={columns}
  expanded={expanded}
  getRowId={(row) => row.id}
  onExpandedChange={setExpanded}
  slots={{
    expanded: (row) => row.bio,
  }}
/>
```

### Summary

Set `summary` on a column to render a footer row over the current (filtered) rows. Chrome cells stay empty.

```tsx
<DataTable
  rows={users}
  columns={[
    { id: "name", header: "Name", cell: (row) => row.name },
    {
      id: "role",
      header: "Role",
      cell: (row) => row.role,
      summary: (items) => `${items.length} roles`,
    },
  ]}
/>
```
