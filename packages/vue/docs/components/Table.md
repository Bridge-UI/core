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
} from "@bridge-ui/vue/Components/Table";
```

## Examples

### Usage

```vue
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

```vue
<Table variant="plain" />
<Pagination :count="12" v-model="page" variant="text" />

<Table variant="ghost" />
<Pagination :count="12" v-model="page" variant="ghost" />

<Table variant="bordered" />
<Pagination :count="12" v-model="page" variant="outlined" />
```

| Table `variant` | Pagination `variant` |
| --------------- | -------------------- |
| `plain`         | `text`               |
| `ghost`         | `ghost`              |
| `bordered`      | `outlined`           |

`striped` is independent of variant (same as `hoverable`):

```vue
<Table striped variant="bordered" />
```

### Rounded

Corner radius on the wrapper, header, and footer. Default `lg`.

```vue
<Table rounded="none" />
<Table rounded="xl" variant="ghost" />
```

### Dense + sticky header

`sticky-header` pins header cells to the nearest scrollport (usually the page). The wrapper skips overflow so the header can stick. For a boxed scroll area, set `overflow-auto` and a max height on `classes.root`.

```vue
<Table sticky-header size="sm" />
```

### Numeric cells

```vue
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

```vue
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
