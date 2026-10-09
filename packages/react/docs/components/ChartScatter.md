# ChartScatter

Scatter and bubble charts: the relation between two numbers, with an optional third value as bubble size. Both axes are numeric. Compose with `ChartScatterSeries`, `ChartAxis`, `ChartLegend`, and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartScatter } from "@bridge-ui/react/Components/ChartScatter";
import { ChartScatterSeries } from "@bridge-ui/react/Components/ChartScatterSeries";
```

## Examples

### Usage

```tsx
<ChartScatter>
  <ChartScatterSeries
    name="Customers"
    data={[
      [24, 340],
      [31, 520],
      [45, 410],
    ]}
  />
  <ChartAxis label="Age" position="x" />
  <ChartAxis position="y" label="Ticket" />
  <ChartTooltip />
</ChartScatter>
```

The tooltip shows the series name and each value, labelled with the axis titles.

### Bubbles

A third value per point sets the bubble size. `bubbleSize` maps the smallest and largest values (across all series) to a diameter range, scaled by area: a value twice as big covers twice the area.

```tsx
<ChartScatter bubbleSize={[8, 48]}>
  <ChartScatterSeries
    name="Countries"
    sizeName="Population"
    data={[
      [12000, 76, 210],
      [45000, 82, 38],
    ]}
  />
</ChartScatter>
```

`sizeName` labels the third value in the tooltip and data table.

### Several groups

```tsx
<ChartScatter symbolSize={6}>
  <ChartScatterSeries name="Customers" data={customers} />
  <ChartScatterSeries name="Leads" data={leads} />
  <ChartLegend />
</ChartScatter>
```

### Color by range

`colorRanges` recolors single points by their `y`. A `y` in `[min, max)` takes the range color; other points keep the series color. Range labels show in the tooltip and the data table.

```tsx
<ChartScatter>
  <ChartScatterSeries
    name="Runs"
    data={runs}
    colorRanges={[
      { max: 5, color: "success", label: "Fast" },
      { min: 5, color: "warning", label: "Slow" },
    ]}
  />
</ChartScatter>
```

## Keyboard

Arrow keys move through the points ordered by `x`, then `y`. Each point is announced with its series and values.

## Props (`ChartScatter`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop         | Type               | Default   | Description                                        |
| ------------ | ------------------ | --------- | -------------------------------------------------- |
| `symbolSize` | `number`           | `8`       | Point diameter (px) for `[x, y]` points.           |
| `bubbleSize` | `[number, number]` | `[8, 40]` | Min / max bubble diameter (px) for `[x, y, size]`. |

## Props (`ChartScatterSeries`)

| Prop          | Type                                               | Default  | Description                                                                    |
| ------------- | -------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `name`        | `string`                                           | required | Legend, tooltip, and table name.                                               |
| `data`        | `[number, number][] \| [number, number, number][]` | required | Points; the third value makes a bubble.                                        |
| `color`       | `ChartColorValue`                                  | palette  | Token key or CSS color.                                                        |
| `sizeName`    | `string`                                           | `"Size"` | Label for the third value.                                                     |
| `symbolSize`  | `number`                                           | root     | Point size override (ignored for bubbles).                                     |
| `colorRanges` | `ChartColorRangeOption[]`                          | —        | `{ min?, max?, color, label? }`: points with `y` in `[min, max)` take `color`. |
