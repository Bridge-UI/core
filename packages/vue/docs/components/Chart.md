# Chart

Composable line, bar, and area charts. Bridge owns the legend, tooltip, tokens, dark mode, and a11y (summary, keyboard navigation, data table). The plot engine is ECharts.

Compose `Chart` with `ChartSeries`, `ChartAxis`, `ChartLegend`, and `ChartTooltip`.

## Import

```ts
import { Chart } from "@bridge-ui/vue/Components/Chart";
import { ChartAxis } from "@bridge-ui/vue/Components/ChartAxis";
import { ChartLegend } from "@bridge-ui/vue/Components/ChartLegend";
import { ChartSeries } from "@bridge-ui/vue/Components/ChartSeries";
import { ChartTooltip } from "@bridge-ui/vue/Components/ChartTooltip";
```

Install `echarts` next to `@bridge-ui/vue` when you use `Chart`. The import is tree-shaken (line, bar, grid, SVG renderer). `Chart` stays off the `@bridge-ui/vue` root so apps that never import it do not load `echarts`.

## Examples

### Usage

```vue
<script setup lang="ts">
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
</script>

<template>
  <Chart :categories="months">
    <ChartSeries name="Revenue" :data="[120, 180, 150, 220, 260, 240]" />
    <ChartLegend />
    <ChartTooltip />
  </Chart>
</template>
```

### Bar

```vue
<Chart :height="320" :categories="months">
  <ChartSeries type="bar" name="Online" :data="online" />
  <ChartSeries type="bar" name="Retail" :data="retail" />
  <ChartLegend align="start" position="top" />
  <ChartTooltip />
</Chart>
```

### Area

```vue
<Chart :categories="months">
  <ChartSeries type="area" curve="smooth" name="Visitors" :data="visitors" />
  <ChartTooltip />
</Chart>
```

### Mixed series

Bars and lines share the value axis.

```vue
<Chart :categories="months">
  <ChartSeries type="bar" name="Orders" :data="orders" />
  <ChartSeries name="Returns" :data="returns" />
  <ChartLegend />
  <ChartTooltip />
</Chart>
```

### Gaps

`null` values leave a gap in lines and areas and are skipped in the tooltip.

```vue
<ChartSeries name="Costs" :data="[80, 90, null, 140, 150, 170]" />
```

### Axes

```vue
<Chart :categories="months">
  <ChartSeries name="Revenue" :data="revenue" />
  <ChartAxis position="x" label="Month" />
  <ChartAxis :min="0" position="y" :format-tick="(value) => `$${value}`" />
</Chart>
```

`format-tick` receives the category on `x` and the value on `y`. Grid lines are on for `y` and off for `x` by default.

### Colors

Series take palette colors in order. Override the palette on `Chart`, or pass a token key or any CSS color to `ChartSeries`.

```vue
<Chart :categories="months" :palette="['info', 'warning']">
  <ChartSeries name="Plan" :data="plan" />
  <ChartSeries name="Actual" :data="actual" color="#8b5cf6" />
</Chart>
```

Token keys (`primary`, `info`, `success`, `warning`, `error`, `secondary`, `dark`, `black`) follow light and dark mode automatically.

### Legend

Legend entries are toggle buttons: click to hide or show a series, hover or focus to emphasize it.

```vue
<ChartLegend :interactive="false" />
<ChartLegend align="end" position="top" />
```

### Tooltip

```vue
<ChartTooltip :format-value="(value) => currency.format(value)" />
```

```vue
<ChartTooltip>
  <template #content="{ category, items }">
    <span>{{ category }}: {{ items.length }} series</span>
  </template>
</ChartTooltip>
```

### Loading and empty

```vue
<Chart :loading="isLoading" :categories="months">
  <ChartSeries name="Revenue" :data="revenue" />
</Chart>
```

```vue
<Chart :categories="months">
  <template #empty>No sales in this period</template>
</Chart>
```

### Summary

`Chart` generates a text summary (series names and category range) for screen readers. Pass `summary` to describe the takeaway instead.

```vue
<Chart :categories="months" summary="Revenue doubled from January to June.">
  <ChartSeries name="Revenue" :data="revenue" />
</Chart>
```

### Registry defaults

```vue
<BridgeUIProvider
  :components="{
    ChartSeries: { defaultProps: { curve: 'smooth' } },
    ChartLegend: { defaultProps: { position: 'top' } },
    Chart: { defaultProps: { height: 320, palette: ['primary', 'success'] } },
  }"
>
  <App />
</BridgeUIProvider>
```

Theme tokens (`Chart.tokens.theme`) set the grid, axis, and label colors as Tailwind text-color classes:

```vue
<BridgeUIProvider
  :components="{
    Chart: { tokens: { theme: { grid: 'text-dark-100 dark:text-dark-800' } } },
  }"
>
  <App />
</BridgeUIProvider>
```

## Accessibility

- The root is a `figure`; the plot is a focusable `img` labelled by `summary` (or the generated summary).
- Arrow keys move between categories, `Home` / `End` jump to the edges, `Escape` clears. The tooltip follows the keyboard, and the values are announced through a live region.
- A data table with every value is always rendered, visually hidden.
- The tooltip is decorative (`aria-hidden`); the same information is in the table and announcements.
- Engine animation is off under `prefers-reduced-motion`.

## Props (`Chart`)

| Prop          | Type                 | Default                  | Description                                         |
| ------------- | -------------------- | ------------------------ | --------------------------------------------------- |
| `animation`   | `boolean`            | `true`                   | Engine transitions (always off for reduced motion). |
| `categories`  | `string[]`           | required                 | Category labels; one value per category per series. |
| `classes`     | `ChartClasses`       | —                        | `root`, `plot`, `loading`, `empty`, `table`.        |
| `height`      | `number \| string`   | `280`                    | Plot height.                                        |
| `loading`     | `boolean`            | `false`                  | Shows the loading overlay.                          |
| `palette`     | `ChartSeriesColor[]` | primary, info, success … | Series colors in order.                             |
| `size`        | `ChartSize`          | `"md"`                   | Density of labels, legend, and tooltip.             |
| `summary`     | `string`             | generated                | Accessible description of the plot.                 |
| `width`       | `number \| string`   | `"100%"`                 | Root width.                                         |
| `customProps` | `ChartCustomProps`   | —                        | Extra props for `root` and `plot`.                  |

### Slots (`Chart`)

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| `default` | `ChartSeries`, `ChartAxis`, `ChartLegend`, `ChartTooltip`. |
| `empty`   | Content shown when there is nothing to plot.               |
| `loading` | Content shown while `loading` is true.                     |

## Props (`ChartSeries`)

| Prop    | Type                        | Default    | Description                              |
| ------- | --------------------------- | ---------- | ---------------------------------------- |
| `color` | `ChartSeriesColor`          | palette    | Token key or CSS color.                  |
| `curve` | `"linear" \| "smooth"`      | `"linear"` | Line interpolation for `line` / `area`.  |
| `data`  | `(number \| null)[]`        | required   | One value per category; `null` is a gap. |
| `name`  | `string`                    | required   | Legend, tooltip, and table label.        |
| `type`  | `"line" \| "bar" \| "area"` | `"line"`   | Series family.                           |

## Props (`ChartAxis`)

| Prop         | Type                                  | Default                       | Description                       |
| ------------ | ------------------------------------- | ----------------------------- | --------------------------------- |
| `formatTick` | `(value: number \| string) => string` | —                             | Tick label formatter.             |
| `grid`       | `boolean`                             | `true` on `y`, `false` on `x` | Grid lines.                       |
| `hidden`     | `boolean`                             | `false`                       | Hides the axis line and labels.   |
| `label`      | `string`                              | —                             | Axis title.                       |
| `max`        | `number`                              | auto                          | Value axis upper bound.           |
| `min`        | `number`                              | auto                          | Value axis lower bound.           |
| `position`   | `"x" \| "y"`                          | required                      | Categories (`x`) or values (`y`). |
| `tickCount`  | `number`                              | auto                          | Preferred number of ticks.        |

## Props (`ChartLegend`)

| Prop          | Type                           | Default    | Description                                |
| ------------- | ------------------------------ | ---------- | ------------------------------------------ |
| `align`       | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment.                      |
| `classes`     | `ChartLegendClasses`           | —          | `root`, `item`, `swatch`, `label`.         |
| `interactive` | `boolean`                      | `true`     | Entries toggle and emphasize their series. |
| `position`    | `"top" \| "bottom"`            | `"bottom"` | Above or below the plot.                   |
| `customProps` | `ChartLegendCustomProps`       | —          | Extra props for `root` and `item`.         |

## Props (`ChartTooltip`)

| Prop          | Type                              | Default              | Description                                          |
| ------------- | --------------------------------- | -------------------- | ---------------------------------------------------- |
| `classes`     | `ChartTooltipClasses`             | —                    | `root`, `title`, `item`, `swatch`, `label`, `value`. |
| `formatValue` | `(value: number, item) => string` | locale number format | Value formatter.                                     |
| `customProps` | `ChartTooltipCustomProps`         | —                    | Extra props for `root`.                              |

### Slots (`ChartTooltip`)

| Slot      | Props                        | Description                  |
| --------- | ---------------------------- | ---------------------------- |
| `content` | `{ category, index, items }` | Replaces the title and rows. |
