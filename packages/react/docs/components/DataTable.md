# DataTable

Opinionated data grid: columns, rows, sorting, selection, empty/loading, and pagination wiring. DataTable composes `Table` (`<table>` / `thead` / `tbody`) for layout, sticky header, and column alignment. `size`, `variant`, `full`, `striped`, `hoverable`, and `rounded` are forwarded to `Table`. Chrome tokens (`size`, `variant`, `rounded`, column `align`) live on `Table`. Apps own the fetch; Bridge owns interaction and chrome.

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
<DataTable rows={users} columns={columns} variant="bordered" />
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

`full={false}` sizes columns to content instead of stretching the table:

```tsx
<DataTable full={false} rows={users} columns={columns} />
```

`stickyHeader` pins header cells to the page. `"boxed"` pins them inside the wrapper — set a max height on `classes.wrapper` or `classes.root`:

```tsx
<DataTable stickyHeader rows={users} columns={columns} />
<DataTable
  rows={users}
  columns={columns}
  stickyHeader="boxed"
  classes={{ wrapper: "max-h-96" }}
/>
```

### Selection + pagination

Built-in Pagination when `page` is set with `pageCount` or `totalCount` (server fetch stays in the app). `page` + `perPage` without those totals slices `rows` locally. `perPage` also renders a Select (`perPageOptions`, default 10 / 25 / 50 / 100). `slots.pagination` and `slots.perPage` replace each control:

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

Client paging slices `rows`. Server paging with a total uses `totalCount` instead of `pageCount`:

```tsx
<DataTable
  page={page}
  rows={users}
  columns={columns}
  perPage={perPage}
  onPageChange={setPage}
  onPerPageChange={setPerPage}
/>

<DataTable
  page={page}
  rows={pageRows}
  columns={columns}
  perPage={perPage}
  totalCount={total}
  onPageChange={setPage}
  onPerPageChange={setPerPage}
/>
```

Slot replaces the built-in Pagination and/or per-page Select (`slots.pagination` / `slots.perPage`; functions receive the same props as the built-ins):

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
        hasPrevious={Boolean(prevCursor)}
        onNext={() => fetchPage(nextCursor)}
        onPrevious={() => fetchPage(prevCursor)}
      />
    ),
    perPage: ({ perPage, options, onPerPageChange }) => (
      <select
        value={perPage}
        aria-label="Rows per page"
        onChange={(event) => {
          onPerPageChange(Number(event.target.value));
        }}
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    ),
  }}
/>
```

Align the built-in Pagination with `paginationAlign` (`start` / `center` / `end`, default `end`):

```tsx
<DataTable
  page={page}
  rows={users}
  columns={columns}
  pageCount={pageCount}
  onPageChange={setPage}
  paginationAlign="start"
/>
```

When `page` and `pageCount` (or `totalCount`) are set, DataTable does not sort or filter `rows` locally — bind `sorting` / `filters` / `page` / `perPage` and fetch the current page in the app:

```tsx
<DataTable
  page={page}
  rows={pageRows}
  columns={columns}
  filters={filters}
  sorting={sorting}
  pageCount={pageCount}
  onPageChange={setPage}
  onFiltersChange={setFilters}
  onSortingChange={setSorting}
/>
```

### Empty, loading, and footer

Empty rows show a default empty state; `slots.empty` replaces it. `loading` keeps the table visible. `loadingVariant="overlay"` (default) dims the table with a spin; `loadingVariant="bar"` dims the table and draws a progress line under the header. `slots.loading` replaces the indicator. `slots.footer` renders below the table, above pagination:

```tsx
<DataTable
  rows={[]}
  columns={columns}
  loading={isLoading}
  slots={{
    empty: "No users",
    footer: "Here is footer",
  }}
/>
```

```tsx
<DataTable
  rows={users}
  columns={columns}
  loading={isLoading}
  loadingVariant="bar"
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

Table-level `slots` are `empty`, `expanded`, `item`, `loading`, `pagination`, and `toolbar`. `slots.item[id]` overrides `columns[].cell` for that column.

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

Set `filters` on a column to show a funnel in that header. The panel can search options, uses checkboxes (`filterMultiple`, default) or radios (`filterMultiple={false}`), and **Select all items** for multiple filters. Nested `children` render as a group in the same panel. **OK** commits; **Reset** clears the draft (commit on **OK**); closing without **OK** discards it.

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

`sticky="start"` or `sticky="end"` pins a column while the table scrolls horizontally. Selection and expand chrome pin to start when any data column uses `sticky="start"`.

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
