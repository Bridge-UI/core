# ChartPie

Pie and donut charts: the share of each part in a whole. Slices come from `data`; compose with `ChartLegend` and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartPie } from "@bridge-ui/react/Components/ChartPie";
```

## Examples

### Usage

```tsx
const tags = [
  { label: "Housing", value: 3450 },
  { label: "Kids", value: 1310 },
  { label: "Groceries", value: 1240 },
];

<ChartPie data={tags}>
  <ChartLegend />
  <ChartTooltip />
</ChartPie>;
```

Non-positive values are skipped. Shares are whole percents that always sum to 100.

### Donut with center content

```tsx
<ChartPie
  data={tags}
  variant="donut"
  slots={{
    center: (
      <>
        <strong>R$ 6,9 mil</strong>
        <span>in outflows</span>
      </>
    ),
  }}
>
  <ChartLegend showPercent position="right" />
</ChartPie>
```

`thickness` sets the ring width as a fraction of the radius (default `0.3`).

### Labels: plot, legend, or both

`labels` puts slice labels on the plot; the legend comes from `ChartLegend`.

Plot only:

```tsx
<ChartPie data={tags} labels="outside" />
```

Legend only:

```tsx
<ChartPie data={tags}>
  <ChartLegend showPercent />
</ChartPie>
```

Both:

```tsx
<ChartPie data={tags} labels="inside" labelContent="percent">
  <ChartLegend />
</ChartPie>
```

`labelContent` is `"label"`, `"value"`, `"percent"`, or a function that receives `{ label, value, percent }`.

### Slice colors

```tsx
<ChartPie
  data={[
    { label: "Paid", value: 32, color: "success" },
    { label: "Late", value: 4, color: "error" },
  ]}
/>
```

### Group small slices

`maxSlices` keeps the largest slices and groups the rest into "Other".

```tsx
<ChartPie data={tags} maxSlices={5} />
```

### Hiding slices

Legend entries hide and show slices; shares are recomputed for the visible slices. The data table keeps the shares of all data.

## Props (`ChartPie`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop           | Type                                                   | Default   | Description                                    |
| -------------- | ------------------------------------------------------ | --------- | ---------------------------------------------- |
| `data`         | `{ label, value, color? }[]`                           | required  | Slices in order.                               |
| `variant`      | `"pie" \| "donut"`                                     | `"pie"`   | `donut` leaves a hole for the `center` slot.   |
| `thickness`    | `number`                                               | `0.3`     | Donut ring thickness (fraction of the radius). |
| `labels`       | `false \| "inside" \| "outside"`                       | `false`   | Slice labels on the plot.                      |
| `labelContent` | `"label" \| "value" \| "percent" \| (slice) => string` | `"label"` | What plot labels show.                         |
| `minAngle`     | `number`                                               | `2`       | Minimum slice angle (deg).                     |
| `maxSlices`    | `number`                                               | —         | Group the rest into "Other".                   |
| `slots`        | `{ center?, empty?, loading? }`                        | —         | `center` renders inside the donut hole.        |
