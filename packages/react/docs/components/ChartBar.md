# ChartBar

Bar charts: comparisons, rankings, stacked totals, negative values, and time axes. Compose with `ChartBarSeries`, `ChartAxis`, `ChartLegend`, and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartBar } from "@bridge-ui/react/Components/ChartBar";
import { ChartBarSeries } from "@bridge-ui/react/Components/ChartBarSeries";
import { ChartLineSeries } from "@bridge-ui/react/Components/ChartLineSeries";
```

## Examples

### Usage

```tsx
<ChartBar height={320} categories={months}>
  <ChartBarSeries name="Online" data={online} />
  <ChartBarSeries name="Retail" data={retail} />
  <ChartLegend align="start" position="top" />
  <ChartTooltip />
</ChartBar>
```

### Horizontal

`orientation="horizontal"` lists the categories top to bottom on the `y` axis. Value formatting moves to `x`.

```tsx
<ChartBar categories={tags} orientation="horizontal">
  <ChartBarSeries data={spent} name="October" />
  <ChartAxis position="x" formatTick={(value) => currency.format(value)} />
</ChartBar>
```

### Stacked

Series with the same `stack` key stack. Only the outermost bar of each stack is rounded.

```tsx
<ChartBar labels stack="total" categories={months}>
  <ChartBarSeries name="Online" data={online} />
  <ChartBarSeries name="Retail" data={retail} />
  <ChartLegend />
</ChartBar>
```

Inside labels that do not fit their segment are hidden.

### Bar + line

`ChartLineSeries` inside `ChartBar` draws a line over the bars on the same value axis, with the points centered on each category. Line options (`dashed`, `showPoints`, `curve`, `area`, `reference`) work as in `ChartLine`.

```tsx
<ChartBar categories={months}>
  <ChartBarSeries name="Orders" data={orders} />
  <ChartLineSeries dashed name="Returns" data={returns} />
  <ChartLegend />
  <ChartTooltip />
</ChartBar>
```

The `ChartBar` `stack` applies to bars only: a line stays on its own values (a target, an average) unless you give it a `stack`.

`ChartBar` loads the ECharts line series too, so bar + line charts need no extra import.

### Negative values

Bars round the end that points away from zero.

```tsx
<ChartBar categories={months}>
  <ChartBarSeries name="Balance" data={[1200, -400, 800, -150]} />
</ChartBar>
```

### Reference lines

```tsx
<ChartBar categories={months}>
  <ChartBarSeries name="Orders" data={orders} reference={{ type: "average" }} />
</ChartBar>
```

### Value labels

```tsx
<ChartBar labels categories={months} formatLabel={(value) => `${value}%`}>
  <ChartBarSeries name="Share" data={share} />
</ChartBar>
```

### Time axis

Dates as `categories` place bars by time. See [ChartLine](./ChartLine.md#time-axis).

```tsx
<ChartBar categories={days}>
  <ChartBarSeries name="Spent" data={spentPerDay} />
</ChartBar>
```

### Square corners

```tsx
<ChartBar radius={0} categories={months}>
  <ChartBarSeries name="Orders" data={orders} />
</ChartBar>
```

## Props (`ChartBar`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop          | Type                         | Default      | Description                                     |
| ------------- | ---------------------------- | ------------ | ----------------------------------------------- |
| `categories`  | `string[] \| Date[]`         | required     | Category labels, or dates for a time axis.      |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | `horizontal` puts categories on `y`.            |
| `stack`       | `string`                     | —            | Stack every bar series under this key.          |
| `labels`      | `boolean`                    | `false`      | Value labels on every series.                   |
| `radius`      | `number`                     | `4`          | Corner radius (px) on the value end.            |
| `formatDate`  | `(date: Date) => string`     | —            | Date labels in the tooltip, table, and summary. |
| `formatLabel` | `(value: number) => string`  | —            | Value labels and reference line labels.         |

## Props (`ChartBarSeries`)

Unset options fall back to the `ChartBar` props.

| Prop        | Type                                 | Default  | Description                                                                            |
| ----------- | ------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| `name`      | `string`                             | required | Legend, tooltip, and table name.                                                       |
| `data`      | `(number \| null)[]`                 | required | One value per category.                                                                |
| `color`     | `ChartColorValue`                    | palette  | Token key or CSS color.                                                                |
| `stack`     | `string`                             | root     | Stack key.                                                                             |
| `labels`    | `boolean`                            | root     | Value labels.                                                                          |
| `reference` | `ChartReference \| ChartReference[]` | —        | `{ type: "average" \| "min" \| "max" }` or `{ value }`, each with an optional `label`. |
