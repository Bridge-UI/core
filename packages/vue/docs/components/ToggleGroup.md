# ToggleGroup

Segmented control for mutually exclusive options. Use `Switch` for on/off; use `ToggleGroup` to pick among labeled segments in a shared track. Compose with `ToggleItem`.

## Import

```ts
import { ToggleGroup } from "@bridge-ui/vue/Components/ToggleGroup";
import { ToggleItem } from "@bridge-ui/vue/Components/ToggleItem";
```

## Examples

### Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ToggleGroup } from "@bridge-ui/vue/Components/ToggleGroup";
import { ToggleItem } from "@bridge-ui/vue/Components/ToggleItem";

const lib = ref("vue");
</script>

<template>
  <ToggleGroup v-model="lib" color="success" aria-label="Library">
    <ToggleItem value="react">React</ToggleItem>
    <ToggleItem value="vue">Vue</ToggleItem>
  </ToggleGroup>
</template>
```

### With icons

```vue
<ToggleGroup v-model="view" aria-label="View">
  <ToggleItem value="list" aria-label="List" :start-icon="List" />
  <ToggleItem value="grid" aria-label="Grid" :start-icon="LayoutGrid" />
</ToggleGroup>
```

### Variants

`solid` uses a soft semantic fill on the selected segment. `outline` keeps a quieter ring accent.

```vue
<ToggleGroup v-model="lib" variant="solid" aria-label="Solid" />
<ToggleGroup v-model="lib" variant="outline" aria-label="Outline" />
```

### Size

```vue
<ToggleGroup size="sm" v-model="lib" aria-label="Small">
  <ToggleItem value="react">React</ToggleItem>
  <ToggleItem value="vue">Vue</ToggleItem>
</ToggleGroup>
```

### Full width

```vue
<ToggleGroup full v-model="lib" aria-label="Library">
  <ToggleItem value="react">React</ToggleItem>
  <ToggleItem value="vue">Vue</ToggleItem>
</ToggleGroup>
```
