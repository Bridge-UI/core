# DataTable

Opinionated data grid: columns, rows, sorting, selection, empty/loading, and pagination wiring. Layout is CSS grid (`div` + table ARIA roles) so cells can flex, stick, and resize. DataTable owns its chrome tokens (`plain` / `ghost` / `bordered`, `size`, `striped`, `hoverable`); defaults match `Table` but registry overrides are independent. Apps own the fetch; Bridge owns interaction and chrome.

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

DataTable chrome (`plain` / `ghost` / `bordered`). Built-in `Pagination` follows the matching variant unless the `pagination` slot overrides it:

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

### Selection + pagination

Built-in Pagination when `page` / `pageCount` are set. `rows` is the current page (server fetch stays in the app):

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

Slot replaces the built-in control (cursor / `mode="simple"`, custom chrome):

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
</DataTable>
```

### Empty and loading

```vue
<DataTable :rows="[]" :columns="columns" :loading="isLoading">
  <template #empty>No users</template>
</DataTable>
```

Install `@tanstack/vue-table` next to `@bridge-ui/vue` when you use `DataTable`. The public API stays `columns` / `rows` / `sorting` / `selection` / `filters` / `hiddenColumns` / `expanded` — the table engine is not exported.

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

Table-level slots stay `empty` / `expanded` / `item.{id}` / `loading` / `pagination` / `toolbar`.

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

### Filters

Set `filters` on a column to show a funnel in that header. The panel uses checkboxes (`filterMultiple`, default) or radios (`:filter-multiple="false"`). Nested `children` render as a group in the same panel. **OK** commits; **Reset** clears the draft (commit on **OK**); closing without **OK** discards it.

```vue
<DataTable :rows="users" :columns="columns" v-model:filters="filters" />
```

```ts
const columns = [
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

Client-side filtering applies when the table is not server-paged (`page` + `pageCount`). With server paging, `filters` is still controlled — the app owns the fetch.

### Sticky columns

`sticky="start"` or `sticky="end"` pins a column while the grid scrolls horizontally. Selection and expand chrome pin to start when any data column uses `sticky="start"`.

```ts
const columns = [
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

### Column visibility

Pass `hiddenColumns` and/or listen to `update:hiddenColumns` to show a **Columns** control in the toolbar. `hideable: false` keeps a column out of the toggle (or disabled). At least one column stays visible.

```vue
<DataTable :rows="users" :columns="columns" v-model:hidden-columns="hidden" />
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
