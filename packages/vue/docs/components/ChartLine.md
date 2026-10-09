# ChartLine

Line and area charts: trends, stacked areas, steps, reference lines, time axes, and sparklines. Compose with `ChartLineSeries`, `ChartAxis`, `ChartLegend`, and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartLine } from "@bridge-ui/vue/Components/ChartLine";
import { ChartLineSeries } from "@bridge-ui/vue/Components/ChartLineSeries";
```

## Examples

### Usage

```vue
<script setup lang="ts">
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
</script>

<template>
  <ChartLine :categories="months">
    <ChartLineSeries name="Revenue" :data="[120, 180, 150, 220, 260, 240]" />
    <ChartLegend />
    <ChartTooltip />
  </ChartLine>
</template>
```

### Area

`area` fills under the line. Set it on the root for every series, or per series.

```vue
<ChartLine area curve="smooth" :categories="months">
  <ChartLineSeries name="Visitors" :data="visitors" />
</ChartLine>
```

### Stacked area

Series with the same `stack` key stack on top of each other.

```vue
<ChartLine area stack="total" :area-opacity="0.6" :categories="months">
  <ChartLineSeries color="info" name="Organic" :data="organic" />
  <ChartLineSeries name="Paid" :data="paid" color="warning" />
  <ChartLegend />
</ChartLine>
```

`area-opacity` sets the fill opacity (`0.15` by default). Stacked bands read better with a stronger fill. Set it on the root for every series, or per series.

### Color by value

`color-ranges` recolors the line (and its area) piece by piece. A value in `[min, max)` takes the range color; values outside every range keep the series color. Range labels show in the tooltip, the data table, and the keyboard announcements.

```vue
<ChartLine :categories="days">
  <ChartLineSeries
    name="AQI"
    :data="aqi"
    :reference="[{ value: 50 }, { value: 100 }]"
    :color-ranges="[
      { max: 50, color: 'success', label: 'Good' },
      { min: 50, max: 100, color: 'warning', label: 'Moderate' },
      { min: 100, color: 'error', label: 'Unhealthy' },
    ]"
  />
  <ChartTooltip />
</ChartLine>
```

### Highlight categories

With `color-by="category"`, `min` and `max` are category indices (zero-based, both included): the line changes color over that stretch of the axis. On a time axis the indices still point at the categories.

```vue
<ChartLine area curve="smooth" :categories="months">
  <ChartLineSeries
    name="Visitors"
    :data="visitors"
    color-by="category"
    :color-ranges="[{ min: 2, max: 4, color: 'warning', label: 'Campaign' }]"
  />
</ChartLine>
```

### Step, dashed, and points

```vue
<ChartLine :categories="days">
  <ChartLineSeries step="end" name="Plan" :data="plan" />
  <ChartLineSeries dashed show-points name="Forecast" :data="forecast" />
</ChartLine>
```

### Reference lines

`reference` draws a dashed line for a statistic of the series (`average`, `min`, `max`) or a fixed `value`.

```vue
<ChartLine :categories="months">
  <ChartLineSeries
    name="Spending"
    :data="spending"
    :reference="[{ type: 'average' }, { value: 3000, label: 'Budget' }]"
  />
</ChartLine>
```

### Time axis

Pass dates as `categories` to get a time axis: points are spaced by elapsed time, and tick labels (days, months, years) follow the span and the Bridge locale. `format-date` formats the dates in the tooltip, data table, and summary.

```vue
<script setup lang="ts">
const days = [new Date(2026, 9, 1), new Date(2026, 9, 2), new Date(2026, 9, 6)];
</script>

<template>
  <ChartLine :categories="days" :format-date="(date) => format(date, 'dd/MM')">
    <ChartLineSeries area name="Spent" :data="[120, 260, 410]" />
    <ChartAxis position="x" :format-tick="(time) => format(time, 'dd')" />
  </ChartLine>
</template>
```

### Sparkline

`sparkline` drops axes, grid, and padding, and defaults the height to `48`. The summary and data table stay.

```vue
<ChartLine sparkline :categories="weeks">
  <ChartLineSeries area name="Balance" :data="balance" />
</ChartLine>
```

### Value labels

```vue
<ChartLine labels :categories="months" :format-label="(value) => `${value}k`">
  <ChartLineSeries name="Revenue" :data="revenue" />
</ChartLine>
```

### Gaps

`null` values leave a gap and are skipped in the tooltip.

```vue
<ChartLineSeries name="Costs" :data="[80, 90, null, 140, 150, 170]" />
```

## Props (`ChartLine`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop           | Type                                    | Default    | Description                                     |
| -------------- | --------------------------------------- | ---------- | ----------------------------------------------- |
| `categories`   | `string[] \| Date[]`                    | required   | Category labels, or dates for a time axis.      |
| `area`         | `boolean`                               | `false`    | Fill under every series.                        |
| `area-opacity` | `number`                                | `0.15`     | Area fill opacity (`0`–`1`) for every series.   |
| `curve`        | `"linear" \| "smooth"`                  | `"linear"` | Interpolation for every series.                 |
| `step`         | `false \| "start" \| "middle" \| "end"` | `false`    | Step line for every series.                     |
| `stack`        | `string`                                | —          | Stack every series under this key.              |
| `labels`       | `boolean`                               | `false`    | Value labels on every series.                   |
| `show-points`  | `boolean`                               | `false`    | Always draw point symbols.                      |
| `sparkline`    | `boolean`                               | `false`    | No axes, grid, or padding; 48px default height. |
| `format-date`  | `(date: Date) => string`                | —          | Date labels in the tooltip, table, and summary. |
| `format-label` | `(value: number) => string`             | —          | Value labels and reference line labels.         |

## Props (`ChartLineSeries`)

Unset options fall back to the `ChartLine` props.

| Prop           | Type                                    | Default   | Description                                                                                 |
| -------------- | --------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `name`         | `string`                                | required  | Legend, tooltip, and table name.                                                            |
| `data`         | `(number \| null)[]`                    | required  | One value per category; `null` leaves a gap.                                                |
| `color`        | `ChartColorValue`                       | palette   | Token key or CSS color.                                                                     |
| `area`         | `boolean`                               | root      | Fill under the line.                                                                        |
| `area-opacity` | `number`                                | root      | Area fill opacity (`0`–`1`).                                                                |
| `curve`        | `"linear" \| "smooth"`                  | root      | Interpolation.                                                                              |
| `step`         | `false \| "start" \| "middle" \| "end"` | root      | Step line.                                                                                  |
| `stack`        | `string`                                | root      | Stack key.                                                                                  |
| `dashed`       | `boolean`                               | `false`   | Dashed stroke.                                                                              |
| `labels`       | `boolean`                               | root      | Value labels.                                                                               |
| `show-points`  | `boolean`                               | root      | Point symbols.                                                                              |
| `reference`    | `ChartReference \| ChartReference[]`    | —         | `{ type: "average" \| "min" \| "max" }` or `{ value }`, each with an optional `label`.      |
| `color-ranges` | `ChartColorRangeOption[]`               | —         | `{ min?, max?, color, label? }`: the line takes `color` where the value is in `[min, max)`. |
| `color-by`     | `"value" \| "category"`                 | `"value"` | `category` matches `color-ranges` against category indices (both ends included).            |
