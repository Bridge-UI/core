# Table

Presentational table primitives for static or lightly interactive tabular data. Compose with `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`. Sorting, selection, and pagination live on `DataTable`.

## Import

```ts
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@bridge-ui/react/Components/Table";
```

## Examples

### Usage

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>Engineer</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Variants

Same three chrome treatments as `DataTable`. Pair with `Pagination` under the table (Table does not render pagination itself):

```tsx
<Table variant="plain">{/* … */}</Table>
<Pagination count={12} page={page} variant="text" onChange={setPage} />

<Table variant="ghost">{/* … */}</Table>
<Pagination count={12} page={page} variant="ghost" onChange={setPage} />

<Table variant="bordered">{/* … */}</Table>
<Pagination
  count={12}
  page={page}
  variant="outlined"
  onChange={setPage}
/>
```

| Table `variant` | Pagination `variant` |
| --------------- | -------------------- |
| `plain`         | `text`               |
| `ghost`         | `ghost`              |
| `bordered`      | `outlined`           |

`striped` is independent of variant (same as `hoverable`):

```tsx
<Table striped variant="bordered">
  {/* … */}
</Table>
```

### Dense + sticky header

```tsx
<Table size="sm" stickyHeader>
  {/* … */}
</Table>
```

### Numeric cells

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead numeric>Score</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada</TableCell>
      <TableCell numeric>12</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Caption

```tsx
<Table>
  <TableCaption>Team roster</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
