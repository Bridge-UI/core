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

`labels` turns slice labels on the plot on, and `label-position` places them (`"outside"` by default, or `"inside"`). The legend comes from `ChartLegend`.

Plot only:

```vue
<ChartPie labels :data="tags" />
```

Legend only:

```vue
<ChartPie :data="tags">
  <ChartLegend show-percent />
</ChartPie>
```

Both:

```vue
<ChartPie labels :data="tags" label-position="inside" label-content="percent">
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

### Gaps and rounded corners

`pad-angle` sets the gap between slices (deg) and `corner-radius` rounds the slice corners (px). A pie is solid by default; a donut gets `:pad-angle="1"` and `:corner-radius="2"`.

```vue
<ChartPie :data="tags" :pad-angle="3" variant="donut" :corner-radius="8" />
```

### Nightingale (rose)

`rose` draws each slice with a radius that shows its value. With `"radius"` the angle still shows the share; with `"area"` every slice gets the same angle and only the radius changes.

```vue
<ChartPie :data="tags" rose="radius">
  <ChartLegend show-percent />
</ChartPie>
```

`rose` works with `variant="donut"`. The tooltip, legend, and data table still show each slice's share of the total.

### Group small slices

`max-slices` keeps the largest slices and groups the rest into "Other".

```vue
<ChartPie :data="tags" :max-slices="5" />
```

### Hiding slices

Legend entries hide and show slices; shares are recomputed for the visible slices. The data table keeps the shares of all data.

## Props (`ChartPie`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop             | Type                                                   | Default               | Description                                    |
| ---------------- | ------------------------------------------------------ | --------------------- | ---------------------------------------------- |
| `data`           | `{ label, value, color? }[]`                           | required              | Slices in order.                               |
| `variant`        | `"pie" \| "donut"`                                     | `"pie"`               | `donut` leaves a hole for the `center` slot.   |
| `thickness`      | `number`                                               | `0.3`                 | Donut ring thickness (fraction of the radius). |
| `labels`         | `boolean`                                              | `false`               | Slice labels on the plot.                      |
| `label-position` | `"inside" \| "outside"`                                | `"outside"`           | Where plot labels sit.                         |
| `label-content`  | `"label" \| "value" \| "percent" \| (slice) => string` | `"label"`             | What plot labels show.                         |
| `min-angle`      | `number`                                               | `2`                   | Minimum slice angle (deg).                     |
| `pad-angle`      | `number`                                               | `0` (`1` for `donut`) | Gap between slices (deg).                      |
| `corner-radius`  | `number`                                               | `0` (`2` for `donut`) | Slice corner radius (px).                      |
| `rose`           | `"radius" \| "area"`                                   | —                     | Nightingale pie: slice radius shows the value. |
| `max-slices`     | `number`                                               | —                     | Group the rest into "Other".                   |

Slots: `center` (inside the donut hole), `empty`, `loading`, `default`.
