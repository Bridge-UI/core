# ChartLine

Line and area charts: trends, stacked areas, steps, reference lines, time axes, and sparklines. Compose with `ChartLineSeries`, `ChartAxis`, `ChartLegend`, and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartLine } from "@bridge-ui/react/Components/ChartLine";
import { ChartLineSeries } from "@bridge-ui/react/Components/ChartLineSeries";
```

## Examples

### Usage

```tsx
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

<ChartLine categories={months}>
  <ChartLineSeries name="Revenue" data={[120, 180, 150, 220, 260, 240]} />
  <ChartLegend />
  <ChartTooltip />
</ChartLine>;
```

### Area

`area` fills under the line. Set it on the root for every series, or per series.

```tsx
<ChartLine area curve="smooth" categories={months}>
  <ChartLineSeries name="Visitors" data={visitors} />
</ChartLine>
```

### Stacked area

Series with the same `stack` key stack on top of each other.

```tsx
<ChartLine area stack="total" categories={months}>
  <ChartLineSeries name="Organic" data={organic} />
  <ChartLineSeries name="Paid" data={paid} />
  <ChartLegend />
</ChartLine>
```

### Step, dashed, and points

```tsx
<ChartLine categories={days}>
  <ChartLineSeries step="end" name="Plan" data={plan} />
  <ChartLineSeries dashed showPoints name="Forecast" data={forecast} />
</ChartLine>
```

### Reference lines

`reference` draws a dashed line for a statistic of the series (`average`, `min`, `max`) or a fixed `value`.

```tsx
<ChartLine categories={months}>
  <ChartLineSeries
    name="Spending"
    data={spending}
    reference={[{ type: "average" }, { value: 3000, label: "Budget" }]}
  />
</ChartLine>
```

### Time axis

Pass dates as `categories` to get a time axis: points are spaced by elapsed time, and tick labels (days, months, years) follow the span and the Bridge locale. `formatDate` formats the dates in the tooltip, data table, and summary.

```tsx
const days = [new Date(2026, 9, 1), new Date(2026, 9, 2), new Date(2026, 9, 6)];

<ChartLine categories={days} formatDate={(date) => format(date, "dd/MM")}>
  <ChartLineSeries area name="Spent" data={[120, 260, 410]} />
  <ChartAxis position="x" formatTick={(time) => format(time, "dd")} />
</ChartLine>;
```

### Sparkline

`sparkline` drops axes, grid, and padding, and defaults the height to `48`. The summary and data table stay.

```tsx
<ChartLine sparkline categories={weeks}>
  <ChartLineSeries area name="Balance" data={balance} />
</ChartLine>
```

### Value labels

```tsx
<ChartLine labels categories={months} formatLabel={(value) => `${value}k`}>
  <ChartLineSeries name="Revenue" data={revenue} />
</ChartLine>
```

### Gaps

`null` values leave a gap and are skipped in the tooltip.

```tsx
<ChartLineSeries name="Costs" data={[80, 90, null, 140, 150, 170]} />
```

## Props (`ChartLine`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop          | Type                                    | Default    | Description                                     |
| ------------- | --------------------------------------- | ---------- | ----------------------------------------------- |
| `categories`  | `string[] \| Date[]`                    | required   | Category labels, or dates for a time axis.      |
| `area`        | `boolean`                               | `false`    | Fill under every series.                        |
| `curve`       | `"linear" \| "smooth"`                  | `"linear"` | Interpolation for every series.                 |
| `step`        | `false \| "start" \| "middle" \| "end"` | `false`    | Step line for every series.                     |
| `stack`       | `string`                                | —          | Stack every series under this key.              |
| `labels`      | `boolean`                               | `false`    | Value labels on every series.                   |
| `showPoints`  | `boolean`                               | `false`    | Always draw point symbols.                      |
| `sparkline`   | `boolean`                               | `false`    | No axes, grid, or padding; 48px default height. |
| `formatDate`  | `(date: Date) => string`                | —          | Date labels in the tooltip, table, and summary. |
| `formatLabel` | `(value: number) => string`             | —          | Value labels and reference line labels.         |

## Props (`ChartLineSeries`)

Unset options fall back to the `ChartLine` props.

| Prop         | Type                                    | Default  | Description                                                                            |
| ------------ | --------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `name`       | `string`                                | required | Legend, tooltip, and table name.                                                       |
| `data`       | `(number \| null)[]`                    | required | One value per category; `null` leaves a gap.                                           |
| `color`      | `ChartColorValue`                       | palette  | Token key or CSS color.                                                                |
| `area`       | `boolean`                               | root     | Fill under the line.                                                                   |
| `curve`      | `"linear" \| "smooth"`                  | root     | Interpolation.                                                                         |
| `step`       | `false \| "start" \| "middle" \| "end"` | root     | Step line.                                                                             |
| `stack`      | `string`                                | root     | Stack key.                                                                             |
| `dashed`     | `boolean`                               | `false`  | Dashed stroke.                                                                         |
| `labels`     | `boolean`                               | root     | Value labels.                                                                          |
| `showPoints` | `boolean`                               | root     | Point symbols.                                                                         |
| `reference`  | `ChartReference \| ChartReference[]`    | —        | `{ type: "average" \| "min" \| "max" }` or `{ value }`, each with an optional `label`. |
