# DataTable

Opinionated data grid on top of `Table`: columns, rows, sorting, selection, empty/loading, and pagination wiring. Apps own the fetch; Bridge owns interaction and chrome.

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

Same chrome as `Table`. Built-in `Pagination` follows the matching variant unless the `pagination` slot overrides it:

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
      :has-previous="Boolean(prevCursor)"
      @next="fetchPage(nextCursor)"
      @previous="fetchPage(prevCursor)"
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
