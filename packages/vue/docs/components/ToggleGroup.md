# ToggleGroup

Segmented control for mutually exclusive options. Use `Switch` for on/off; use `ToggleGroup` to pick among labeled segments in a shared track. Compose with `Toggle`.

## Import

```ts
import { ToggleGroup } from "@bridge-ui/vue/Components/ToggleGroup";
import { Toggle } from "@bridge-ui/vue/Components/Toggle";
```

## Examples

### Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Toggle } from "@bridge-ui/vue/Components/Toggle";
import { ToggleGroup } from "@bridge-ui/vue/Components/ToggleGroup";

const lib = ref("vue");
</script>

<template>
  <ToggleGroup v-model="lib" color="success" aria-label="Library">
    <Toggle value="react">React</Toggle>
    <Toggle value="vue">Vue</Toggle>
  </ToggleGroup>
</template>
```

### With icons

```vue
<ToggleGroup v-model="view" aria-label="View">
  <Toggle value="list" :start-icon="List" aria-label="List" />
  <Toggle value="grid" :start-icon="LayoutGrid" aria-label="Grid" />
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
  <Toggle value="react">React</Toggle>
  <Toggle value="vue">Vue</Toggle>
</ToggleGroup>
```

### Full width

```vue
<ToggleGroup full v-model="lib" aria-label="Library">
  <Toggle value="react">React</Toggle>
  <Toggle value="vue">Vue</Toggle>
</ToggleGroup>
```
