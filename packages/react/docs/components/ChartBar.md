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

### Category colors

`categoryColors` gives each category its own bar color. Every bar series in a category shares that color; `tone="muted"` tells a comparison series apart with a lighter shade of the same color.

```tsx
const tagColors = {
  housing: "primary",
  groceries: "success",
  transport: "warning",
  delivery: "#8b5cf6",
};

<ChartBar categories={tags} categoryColors={tagColors}>
  <ChartBarSeries name="October" data={october} />
  <ChartBarSeries tone="muted" data={average} name="6-month average" />
  <ChartLegend />
  <ChartTooltip />
</ChartBar>;
```

`categoryColors` takes a record keyed by category label, an array in category order, or `true` to use the palette in category order. Categories without a color take the palette entry at their index.

With category colors the legend shows each series in a neutral color (muted series in a lighter shade), and the tooltip shows the bar colors. `ChartLineSeries` inside keep their own color.

`tone="muted"` also works without `categoryColors`: it lightens the series color (a previous period next to the current one). Muted shades mix toward the background behind the chart, so they follow light and dark mode.

### Color by value

`colorRanges` recolors single bars by value. A value in `[min, max)` takes the range color; bars outside every range keep the series color. Range labels show in the tooltip, the data table, and the keyboard announcements.

```tsx
<ChartBar categories={months}>
  <ChartBarSeries
    name="Spent"
    data={spent}
    colorRanges={[
      { max: 1000, color: "success", label: "On budget" },
      { min: 1000, color: "error", label: "Over budget" },
    ]}
  />
</ChartBar>
```

With `colorBy="category"`, `min` and `max` are category indices (both included) instead of values. Ranges win over `categoryColors`.

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

| Prop             | Type                                                              | Default      | Description                                                                          |
| ---------------- | ----------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `categories`     | `string[] \| Date[]`                                              | required     | Category labels, or dates for a time axis.                                           |
| `categoryColors` | `boolean \| ChartColorValue[] \| Record<string, ChartColorValue>` | —            | Bar color per category (record by label, array by index, or `true` for the palette). |
| `orientation`    | `"vertical" \| "horizontal"`                                      | `"vertical"` | `horizontal` puts categories on `y`.                                                 |
| `stack`          | `string`                                                          | —            | Stack every bar series under this key.                                               |
| `labels`         | `boolean`                                                         | `false`      | Value labels on every series.                                                        |
| `radius`         | `number`                                                          | `4`          | Corner radius (px) on the value end.                                                 |
| `formatDate`     | `(date: Date) => string`                                          | —            | Date labels in the tooltip, table, and summary.                                      |
| `formatLabel`    | `(value: number) => string`                                       | —            | Value labels and reference line labels.                                              |

## Props (`ChartBarSeries`)

Unset options fall back to the `ChartBar` props.

| Prop          | Type                                 | Default   | Description                                                                            |
| ------------- | ------------------------------------ | --------- | -------------------------------------------------------------------------------------- |
| `name`        | `string`                             | required  | Legend, tooltip, and table name.                                                       |
| `data`        | `(number \| null)[]`                 | required  | One value per category.                                                                |
| `color`       | `ChartColorValue`                    | palette   | Token key or CSS color.                                                                |
| `stack`       | `string`                             | root      | Stack key.                                                                             |
| `labels`      | `boolean`                            | root      | Value labels.                                                                          |
| `reference`   | `ChartReference \| ChartReference[]` | —         | `{ type: "average" \| "min" \| "max" }` or `{ value }`, each with an optional `label`. |
| `tone`        | `"solid" \| "muted"`                 | `"solid"` | `muted` mixes the bar colors toward the background.                                    |
| `colorRanges` | `ChartColorRangeOption[]`            | —         | `{ min?, max?, color, label? }`: bars with a value in `[min, max)` take `color`.       |
| `colorBy`     | `"value" \| "category"`              | `"value"` | `category` matches `colorRanges` against category indices (both ends included).        |
