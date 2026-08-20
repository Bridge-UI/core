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

Install `@tanstack/vue-table` next to `@bridge-ui/vue` when you use `DataTable`. The public API stays `columns` / `rows` / `sorting` / `selection` — the table engine is not exported.
