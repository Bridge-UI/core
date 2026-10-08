# ChartPie

Pie and donut charts: the share of each part in a whole. Slices come from `data`; compose with `ChartLegend` and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartPie } from "@bridge-ui/vue/Components/ChartPie";
```

## Examples

### Usage

```vue
<script setup lang="ts">
const tags = [
  { label: "Housing", value: 3450 },
  { label: "Kids", value: 1310 },
  { label: "Groceries", value: 1240 },
];
</script>

<template>
  <ChartPie :data="tags">
    <ChartLegend />
    <ChartTooltip />
  </ChartPie>
</template>
```

Non-positive values are skipped. Shares are whole percents that always sum to 100.

### Donut with center content

```vue
<ChartPie :data="tags" variant="donut">
  <template #center>
    <strong>R$ 6,9 mil</strong>
    <span>in outflows</span>
  </template>

  <ChartLegend show-percent position="right" />
</ChartPie>
```

`thickness` sets the ring width as a fraction of the radius (default `0.3`).

### Labels: plot, legend, or both

`labels` puts slice labels on the plot; the legend comes from `ChartLegend`.

Plot only:

```vue
<ChartPie :data="tags" labels="outside" />
```

Legend only:

```vue
<ChartPie :data="tags">
  <ChartLegend show-percent />
</ChartPie>
```

Both:

```vue
<ChartPie :data="tags" labels="inside" label-content="percent">
  <ChartLegend />
</ChartPie>
```

`label-content` is `"label"`, `"value"`, `"percent"`, or a function that receives `{ label, value, percent }`.

### Slice colors

```vue
<ChartPie
  :data="[
    { label: 'Paid', value: 32, color: 'success' },
    { label: 'Late', value: 4, color: 'error' },
  ]"
/>
```

### Group small slices

`max-slices` keeps the largest slices and groups the rest into "Other".

```vue
<ChartPie :data="tags" :max-slices="5" />
```

### Hiding slices

Legend entries hide and show slices; shares are recomputed for the visible slices. The data table keeps the shares of all data.

## Props (`ChartPie`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop            | Type                                                   | Default   | Description                                    |
| --------------- | ------------------------------------------------------ | --------- | ---------------------------------------------- |
| `data`          | `{ label, value, color? }[]`                           | required  | Slices in order.                               |
| `variant`       | `"pie" \| "donut"`                                     | `"pie"`   | `donut` leaves a hole for the `center` slot.   |
| `thickness`     | `number`                                               | `0.3`     | Donut ring thickness (fraction of the radius). |
| `labels`        | `false \| "inside" \| "outside"`                       | `false`   | Slice labels on the plot.                      |
| `label-content` | `"label" \| "value" \| "percent" \| (slice) => string` | `"label"` | What plot labels show.                         |
| `min-angle`     | `number`                                               | `2`       | Minimum slice angle (deg).                     |
| `max-slices`    | `number`                                               | —         | Group the rest into "Other".                   |

Slots: `center` (inside the donut hole), `empty`, `loading`, `default`.
