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

DataTable chrome (`plain` / `ghost` / `bordered`). Built-in footer pager is `DataTablePagination` (first / previous / next / last). `paginationSlotProps.variant` still follows the table variant when `slots.pagination` renders numbered Pagination:

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

`full={false}` sizes columns to content instead of stretching the table. The bordered wrapper, per-page select, and pagination follow that width. Default `full` stretches the table to the wrapper width:

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

The chrome footer shows a selection summary when `selection` is bound, a per-page Select when `perPage` is set (`perPageOptions`, default 10 / 25 / 50 / 100), and DataTablePagination when `page` is set with `pageCount` or `totalCount` (server fetch stays in the app). `page` + `perPage` without those totals slices `rows` locally. `slots.selected`, `slots.pagination`, and `slots.perPage` replace each control:

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

Slot replaces the built-in footer controls (`slots.selected` / `slots.pagination` / `slots.perPage`; functions receive the same props as the built-ins):

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

Empty rows render `EmptyState` at the table `size`, with the semantic `inbox` icon and the i18n title `"No data"`. `slots.empty` replaces it. `loading` keeps the table visible. `loadingVariant="overlay"` (default) dims the table with a spin; `loadingVariant="bar"` dims the table and draws a progress line under the header. `slots.loading` replaces the indicator. `slots.footer` renders below the table, above the chrome footer:

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

Install `@tanstack/react-table` next to `@bridge-ui/react` when you use `DataTable`. The public API stays `columns` / `rows` / `sorting` / `selection` / `filters` / `columnSearch` / `hiddenColumns` / `search` / `expanded` — the table engine is not exported.

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

Table-level `slots` are `empty`, `expanded`, `footer`, `item`, `loading`, `pagination`, `perPage`, `search`, `selected`, `toolbar`, and `toolbarActions`. `slots.item[id]` overrides `columns[].cell` for that column.

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

### Sorting

Set `sortable` on a column to show a sort button in that header, matching the filter control. Clicks cycle unsorted → ascending → descending → unsorted. Bind `sorting` and `onSortingChange`. The header cell keeps `aria-sort`.

### Filters

Set `filters` on a column to show a funnel in that header. The panel uses checkboxes (`filterMultiple`, default) or radios (`filterMultiple={false}`), and **Select all items** for multiple filters. Nested `children` render as a group in the same panel. **OK** commits; **Reset** clears the draft (commit on **OK**); closing without **OK** discards it.

Set `searchable` on a column to add a text field in that same overlay. Queries are stored in `columnSearch` (column id → string), not used to filter the option list.

Column filters open in a `FieldOverlay`. Default `filterOverlay` is `auto` (`menu` on desktop, `drawer` on mobile). Pass `menu`, `modal`, or `drawer` to pin a shell:

```tsx
<DataTable
  rows={users}
  filters={filters}
  columns={columns}
  filterOverlay="drawer"
  onFiltersChange={setFilters}
/>
```

```tsx
<DataTable
  rows={users}
  filters={filters}
  columnSearch={columnSearch}
  onFiltersChange={setFilters}
  onColumnSearchChange={setColumnSearch}
  columns={[
    {
      id: "name",
      header: "Name",
      searchable: true,
      cell: (row) => row.name,
    },
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

Client-side filtering applies when the table is not server-paged (`page` + `pageCount`). With server paging, `filters` and `columnSearch` are still controlled — the app owns the fetch.

### Sticky columns

`sticky="start"` or `sticky="end"` pins a column while the table scrolls horizontally. Selection and expand chrome pin to start when any data column uses `sticky="start"`.

```tsx
<DataTable
  rows={users}
  columns={[
    {
      id: "name",
      width: 120,
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

### Column classes

`classes.header` and `classes.cell` merge onto that column’s `th` / `td`. Use width utilities for breakpoint-based sizing. Do not set `width` on the same column when the class should control width — inline `width` wins.

```tsx
<DataTable
  rows={users}
  columns={[
    {
      id: "name",
      header: "Name",
      cell: (row) => row.name,
      classes: {
        cell: "w-24 sm:w-40",
        header: "w-24 sm:w-40",
      },
    },
  ]}
/>
```

### Column visibility

Pass `hiddenColumns` and/or `onHiddenColumnsChange` to show a **Columns** icon in the toolbar. `hideable={false}` keeps a column out of the toggle (or disabled). At least one column stays visible.

The panel opens in a `FieldOverlay`. Default `columnsOverlay` is `auto` (`menu` on desktop, `drawer` on mobile). Pass `menu`, `modal`, or `drawer` to pin a shell.

When unset, `columnsShowFooter` is `true` for `modal` / `drawer` (`false` for `menu`). Reset restores hideable columns; OK commits and closes. Closing without OK discards.

```tsx
<DataTable
  rows={users}
  columns={columns}
  hiddenColumns={hidden}
  columnsOverlay="drawer"
  onHiddenColumnsChange={setHidden}
/>
```

### Search

Pass `search` and/or `onSearchChange` to show a search field in the toolbar. Client-side tables filter visible columns; server-paged tables emit the query only.

```tsx
<DataTable
  rows={users}
  search={search}
  columns={columns}
  onSearchChange={setSearch}
/>
```

### Toolbar

`slots.toolbar` is the leading region (left). `slots.toolbarActions` sits in the end cluster beside Columns and Search. The toolbar shows when either slot is set, or when Columns / Search are enabled.

```tsx
<DataTable
  rows={users}
  search={search}
  columns={columns}
  onSearchChange={setSearch}
  slots={{
    toolbarActions: <Button onClick={onPrint}>Print</Button>,
  }}
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
