# ChartFunnel

Funnel charts: conversion through ordered stages. Stages come from `data`; compose with `ChartLegend` and `ChartTooltip`. Shared parts, colors, and a11y are in [Chart](./Chart.md).

## Import

```ts
import { ChartFunnel } from "@bridge-ui/react/Components/ChartFunnel";
```

## Examples

### Usage

```tsx
<ChartFunnel
  data={[
    { label: "Visited", value: 1200 },
    { label: "Signed up", value: 420 },
    { label: "Paid", value: 96 },
  ]}
>
  <ChartTooltip />
</ChartFunnel>
```

Stages are sorted from the largest by default. Shares compare each stage to the largest one, whatever the order: with `sort="none"`, a stage after a smaller one can show a higher share.

### Order

```tsx
<ChartFunnel sort="none" data={steps} />
```

### Labels and legend

Stage labels sit inside the shape by default. `outside` moves them next to it; `labelContent` picks the text.

```tsx
<ChartFunnel data={steps} labels="outside" labelContent="percent">
  <ChartLegend showValue showPercent />
</ChartFunnel>
```

### Alignment

```tsx
<ChartFunnel align="left" data={steps} />
```

## Props (`ChartFunnel`)

Shared root props (`height`, `palette`, `loading`, `summary`, …) are listed in [Chart](./Chart.md#props-every-root).

| Prop           | Type                                                   | Default        | Description                 |
| -------------- | ------------------------------------------------------ | -------------- | --------------------------- |
| `data`         | `{ label, value, color? }[]`                           | required       | Stages.                     |
| `sort`         | `"descending" \| "ascending" \| "none"`                | `"descending"` | Stage order, top to bottom. |
| `align`        | `"center" \| "left" \| "right"`                        | `"center"`     | Shape alignment.            |
| `labels`       | `false \| "inside" \| "outside"`                       | `"inside"`     | Stage labels on the plot.   |
| `labelContent` | `"label" \| "value" \| "percent" \| (stage) => string` | `"label"`      | What plot labels show.      |
