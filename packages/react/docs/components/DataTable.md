# DataTable

Opinionated data grid on top of `Table`: columns, rows, sorting, selection, empty/loading, and pagination wiring. Apps own the fetch; Bridge owns interaction and chrome.

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

Same chrome as `Table`. Built-in `Pagination` follows the matching variant unless `slots.pagination` overrides it:

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

Install `@tanstack/react-table` next to `@bridge-ui/react` when you use `DataTable`. The public API stays `columns` / `rows` / `sorting` / `selection` — the table engine is not exported.
