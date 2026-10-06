# Pagination

Page controls for lists and tables: previous/next with labels, page numbers, and a simple cursor-friendly prev/next mode. `Previous` and `Next` resolve through the i18n adapter.

## Import

```ts
import { Pagination } from "@bridge-ui/vue/Components/Pagination";
```

## Examples

### Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Pagination } from "@bridge-ui/vue/Components/Pagination";

const page = ref(1);
</script>

<template>
  <Pagination :count="12" v-model="page" aria-label="Pagination" />
</template>
```

### Variants

`ghost` (default), `text`, `outlined`.

```vue
<Pagination :count="12" v-model="page" variant="ghost" />
<Pagination :count="12" v-model="page" variant="text" />
<Pagination :count="12" v-model="page" variant="outlined" />
```

### Rounded

Applies to `ghost` and `text` item corners and the `outlined` group / edge controls.

```vue
<Pagination :count="12" rounded="lg" v-model="page" variant="ghost" />
```

### With siblings and boundaries

```vue
<Pagination :count="20" v-model="page" :sibling-count="1" :boundary-count="1" />
```

### Simple (cursor / prev–next only)

For APIs that return `next_cursor` / `prev_cursor` instead of a page total. `v-model:cursor` is set to `next-cursor` or `prev-cursor` when the user navigates, and a `null` cursor disables its control:

```vue
<Pagination
  mode="simple"
  v-model:cursor="cursor"
  aria-label="Pagination"
  :next-cursor="pagination.next_cursor"
  :prev-cursor="pagination.prev_cursor"
/>
```

`has-next` / `has-previous` override the cursor defaults. `next` / `previous` still fire (after `update:cursor`), so prev/next without cursors keeps working:

```vue
<Pagination
  mode="simple"
  :has-next="hasMore"
  v-on:next="loadNext"
  aria-label="Pagination"
  :has-previous="page > 1"
  v-on:previous="loadPrevious"
/>
```
