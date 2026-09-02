# DataTable

Opinionated data grid: columns, rows, sorting, selection, empty/loading, and pagination wiring. DataTable composes `Table` (`<table>` / `thead` / `tbody`) for layout, sticky header, and column alignment. `size`, `variant`, `full`, `striped`, `hoverable`, and `rounded` are forwarded to `Table`. Chrome tokens (`size`, `variant`, `rounded`, column `align`) live on `Table`. Apps own the fetch; Bridge owns interaction and chrome.

## Import

```ts
import { DataTable } from "@bridge-ui/vue/Components/DataTable";
```

## Examples

### Usage

```vue
<DataTable
  :rows="users"
  v-model:sorting="sorting"
  :get-row-id="(row) => row.id"
  :columns="[
    { id: 'name', header: 'Name', cell: (row) => row.name },
    { id: 'role', header: 'Role', cell: (row) => row.role, sortable: true },
  ]"
/>
```

### Variants

DataTable chrome (`plain` / `ghost` / `bordered`). Built-in footer pager is `DataTablePagination` (first / previous / next / last). `paginationSlotProps.variant` still follows the table variant when the `pagination` slot renders numbered Pagination:

```vue
<DataTable :rows="users" variant="plain" :columns="columns" />
<DataTable :rows="users" variant="ghost" :columns="columns" />
<DataTable :rows="users" variant="bordered" :columns="columns" />
```

| DataTable `variant` | Pagination `variant` |
| ------------------- | -------------------- |
| `plain`             | `text`               |
| `ghost`             | `ghost`              |
| `bordered`          | `outlined`           |

`striped` is independent of variant:

```vue
<DataTable striped :rows="users" :columns="columns" />
```

`:full="false"` sizes columns to content instead of stretching the table. The bordered wrapper, per-page select, and pagination follow that width. Default `full` stretches the table to the wrapper width:

```vue
<DataTable :full="false" :rows="users" :columns="columns" />
```

`sticky-header` pins header cells to the page. `"boxed"` pins them inside the wrapper — set a max height on `classes.wrapper` or `classes.root`:

```vue
<DataTable sticky-header :rows="users" :columns="columns" />
<DataTable
  :rows="users"
  :columns="columns"
  sticky-header="boxed"
  :classes="{ wrapper: 'max-h-96' }"
/>
```

### Selection + pagination

The chrome footer shows a selection summary when `selection` is bound, a per-page Select when `per-page` is set (`per-page-options`, default 10 / 25 / 50 / 100), and DataTablePagination when `page` is set with `page-count` or `total-count` (server fetch stays in the app). `page` + `per-page` without those totals slices `rows` locally. `#selected`, `#pagination`, and `#perPage` replace each control:

```vue
<DataTable
  :rows="users"
  :columns="columns"
  v-model:page="page"
  :page-count="pageCount"
  v-model:selection="selected"
  :get-row-id="(row) => row.id"
/>
```

Client paging slices `rows`. Server paging with a total uses `total-count` instead of `page-count`:

```vue
<DataTable
  :rows="users"
  :columns="columns"
  v-model:page="page"
  v-model:per-page="perPage"
/>

<DataTable
  :rows="pageRows"
  :columns="columns"
  v-model:page="page"
  :total-count="total"
  v-model:per-page="perPage"
/>
```

Slot replaces the built-in footer controls (`#selected` / `#pagination` / `#perPage`; slot props match the built-ins):

```vue
<DataTable :rows="users" :columns="columns" :get-row-id="(row) => row.id">
  <template #pagination>
    <Pagination
      mode="simple"
      :has-next="Boolean(nextCursor)"
      v-on:next="fetchPage(nextCursor)"
      :has-previous="Boolean(prevCursor)"
      v-on:previous="fetchPage(prevCursor)"
    />
  </template>

  <template #per-page="{ perPage, options, onPerPageChange }">
    <select
      :value="perPage"
      aria-label="Rows per page"
      v-on:change="onPerPageChange(Number($event.target.value))"
    >
      <option v-for="value in options" :key="value" :value="value">
        {{ value }}
      </option>
    </select>
  </template>
</DataTable>
```

When `page` and `page-count` (or `total-count`) are set, DataTable does not sort or filter `rows` locally — bind `sorting` / `filters` / `page` / `per-page` and fetch the current page in the app:

```vue
<DataTable
  :rows="pageRows"
  :columns="columns"
  v-model:page="page"
  :page-count="pageCount"
  v-model:filters="filters"
  v-model:sorting="sorting"
/>
```

### Empty, loading, and footer

Empty rows render `EmptyState` at the table `size`, with the semantic `inbox` icon and the i18n title `"No data"`. `#empty` replaces it. `loading` keeps the table visible. `loadingVariant="overlay"` (default) dims the table with a spin; `loadingVariant="bar"` dims the table and draws a progress line under the header. `#loading` replaces the indicator. `#footer` renders below the table, above the chrome footer:

```vue
<DataTable :rows="[]" :columns="columns" :loading="isLoading">
  <template #empty>No users</template>
  <template #footer>Here is footer</template>
</DataTable>
```

```vue
<DataTable
  :rows="users"
  :columns="columns"
  :loading="isLoading"
  loading-variant="bar"
/>
```

Install `@tanstack/vue-table` next to `@bridge-ui/vue` when you use `DataTable`. The public API stays `columns` / `rows` / `sorting` / `selection` / `filters` / `columnSearch` / `hiddenColumns` / `search` / `expanded` — the table engine is not exported.

### Columns

Cell content is the column accessor (`row[id]`, or `accessor`) unless you override it. `cell` on the column is for portable renderers (`h(…)` or JSX). `#item.{id}` wins over `cell` and stays in the template:

```vue
<DataTable :rows="users" :columns="columns">
  <template #item.role="{ row }">
    <Badge>{{ row.role }}</Badge>
  </template>
</DataTable>
```

```ts
const columns = [
  { id: "name", header: "Name" },
  { id: "role", header: "Role" },
];
```

Table-level slots stay `empty` / `expanded` / `footer` / `item.{id}` / `item` / `loading` / `pagination` / `perPage` / `search` / `selected` / `toolbar` / `toolbarActions`. `#item` is a catch-all when `#item.{id}` is not set.

### Selection

`selectionMode="multiple"` (default) uses checkboxes and select-all. `selectionMode="single"` uses radios and keeps at most one id. `v-model:selection` is always `string[]`.

```vue
<DataTable
  :rows="users"
  :columns="columns"
  selection-mode="single"
  v-model:selection="selected"
  :get-row-id="(row) => row.id"
/>
```

### Sorting

Set `sortable` on a column to show a sort button in that header, matching the filter control. Clicks cycle unsorted → ascending → descending → unsorted. Bind `v-model:sorting`. The header cell keeps `aria-sort`.

### Filters

Set `filters` on a column to show a funnel in that header. The panel uses checkboxes (`filterMultiple`, default) or radios (`:filter-multiple="false"`), and **Select all items** for multiple filters. Nested `children` render as a group in the same panel. **OK** commits; **Reset** clears the draft (commit on **OK**); closing without **OK** discards it.

Set `searchable` on a column to add a text field in that same overlay. Queries are stored in `columnSearch` (column id → string), not used to filter the option list.

Column filters open in a `FieldOverlay`. Default `filter-overlay` is `auto` (`menu` on desktop, `drawer` on mobile). Pass `menu`, `modal`, or `drawer` to pin a shell:

```vue
<DataTable
  :rows="users"
  :columns="columns"
  filter-overlay="drawer"
  v-model:filters="filters"
/>
```

```vue
<DataTable
  :rows="users"
  :columns="columns"
  v-model:filters="filters"
  v-model:column-search="columnSearch"
/>
```

```ts
const columns = [
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
];
```

Client-side filtering applies when the table is not server-paged (`page` + `pageCount`). With server paging, `filters` and `columnSearch` are still controlled — the app owns the fetch.

### Sticky columns

`sticky="start"` or `sticky="end"` pins a column while the table scrolls horizontally. Selection and expand chrome pin to start when any data column uses `sticky="start"`.

```ts
const columns = [
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
];
```

### Ellipsis

`ellipsis` truncates overflowing cell text. The tooltip uses the column accessor (or `row[id]`).

```ts
const columns = [
  {
    id: "name",
    header: "Name",
    ellipsis: true,
    cell: (row) => row.name,
  },
];
```

### Column classes

`classes.header` and `classes.cell` merge onto that column’s `th` / `td`. Use width utilities for breakpoint-based sizing. Do not set `width` on the same column when the class should control width — inline `width` wins.

```ts
const columns = [
  {
    id: "name",
    header: "Name",
    cell: (row) => row.name,
    classes: {
      cell: "w-24 sm:w-40",
      header: "w-24 sm:w-40",
    },
  },
];
```

### Column visibility

Pass `hiddenColumns` and/or listen to `update:hiddenColumns` to show a **Columns** icon in the toolbar. `hideable: false` keeps a column out of the toggle (or disabled). At least one column stays visible.

The panel opens in a `FieldOverlay`. Default `columns-overlay` is `auto` (`menu` on desktop, `drawer` on mobile). Pass `menu`, `modal`, or `drawer` to pin a shell.

When unset, `columns-show-footer` is `true` for `modal` / `drawer` (`false` for `menu`). Reset restores hideable columns; OK commits and closes. Closing without OK discards.

```vue
<DataTable
  :rows="users"
  :columns="columns"
  columns-overlay="drawer"
  v-model:hidden-columns="hidden"
/>
```

### Search

Pass `search` and/or listen to `update:search` to show a search field in the toolbar. Client-side tables filter visible columns; server-paged tables emit the query only.

```vue
<DataTable :rows="users" :columns="columns" v-model:search="search" />
```

### Toolbar

`#toolbar` is the leading region (left). `#toolbar-actions` sits in the end cluster beside Columns and Search. The toolbar shows when either slot is set, or when Columns / Search are enabled.

```vue
<DataTable :rows="users" :columns="columns" v-model:search="search">
  <template #toolbar-actions>
    <Button v-on:click="onPrint">Print</Button>
  </template>
</DataTable>
```

### Expand

Controlled `expanded` row ids. `#expanded="{ row }"` renders in a spanning row under the data row.

```vue
<DataTable
  :rows="users"
  :columns="columns"
  v-model:expanded="expanded"
  :get-row-id="(row) => row.id"
>
  <template #expanded="{ row }">
    {{ row.bio }}
  </template>
</DataTable>
```

### Summary

Set `summary` on a column to render a footer row over the current (filtered) rows. Chrome cells stay empty.

```ts
const columns = [
  { id: "name", header: "Name", cell: (row) => row.name },
  {
    id: "role",
    header: "Role",
    cell: (row) => row.role,
    summary: (items) => `${items.length} roles`,
  },
];
```
