# Pagination

Page controls for lists and tables: previous/next with labels, page numbers, and a simple cursor-friendly prev/next mode. `Previous` and `Next` resolve through the i18n adapter.

## Import

```ts
import { Pagination } from "@bridge-ui/react/Components/Pagination";
```

## Examples

### Usage

```tsx
const [page, setPage] = useState(1);

<Pagination
  count={12}
  page={page}
  onChange={setPage}
  aria-label="Pagination"
/>;
```

### Variants

`ghost` (default), `text`, `outlined`.

```tsx
<Pagination count={12} page={page} variant="ghost" onChange={setPage} />
<Pagination count={12} page={page} variant="text" onChange={setPage} />
<Pagination count={12} page={page} variant="outlined" onChange={setPage} />
```

### Rounded

Applies to `ghost` and `text` item corners and the `outlined` group / edge controls.

```tsx
<Pagination
  count={12}
  page={page}
  rounded="lg"
  variant="ghost"
  onChange={setPage}
/>
```

### With siblings and boundaries

```tsx
<Pagination
  count={20}
  page={page}
  siblingCount={1}
  boundaryCount={1}
  onChange={setPage}
/>
```

### Simple (cursor / prev–next only)

For APIs that do not expose a total page count:

```tsx
<Pagination
  mode="simple"
  aria-label="Pagination"
  hasNext={Boolean(nextCursor)}
  hasPrevious={Boolean(prevCursor)}
  onNext={() => fetchPage(nextCursor)}
  onPrevious={() => fetchPage(prevCursor)}
/>
```
