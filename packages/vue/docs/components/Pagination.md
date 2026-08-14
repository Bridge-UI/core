# Pagination

Page controls for lists and tables: previous/next, page numbers, and a simple cursor-friendly prev/next mode.

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

```vue
<Pagination :count="12" v-model="page" variant="text" />
<Pagination :count="12" v-model="page" variant="ghost" />
<Pagination :count="12" v-model="page" variant="outlined" />
```

### With siblings and boundaries

```vue
<Pagination :count="20" v-model="page" :sibling-count="1" :boundary-count="1" />
```

### Simple (cursor / prev–next only)

For APIs that do not expose a total page count:

```vue
<Pagination
  mode="simple"
  :has-next="Boolean(nextCursor)"
  :has-previous="Boolean(prevCursor)"
  aria-label="Pagination"
  @next="fetchPage(nextCursor)"
  @previous="fetchPage(prevCursor)"
/>
```
