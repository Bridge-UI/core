# Chart

Charts for dashboards and reports. Pick the root for the shape of your data; every root shares the same legend, tooltip, tokens, dark mode, and a11y (summary, keyboard navigation, data table). The plot engine is ECharts.

| Root                                | Use for                                            | Data                                      |
| ----------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| [`ChartLine`](./ChartLine.md)       | Trends, areas, stacked areas, steps, sparklines    | `ChartLineSeries`, one value per category |
| [`ChartBar`](./ChartBar.md)         | Comparisons, rankings (horizontal), stacked totals | `ChartBarSeries`, one value per category  |
| [`ChartScatter`](./ChartScatter.md) | Correlation between two numbers, bubbles           | `ChartScatterSeries`, `[x, y]` points     |
| [`ChartPie`](./ChartPie.md)         | Share of a whole (pie, donut)                      | `data` on the root                        |
| [`ChartFunnel`](./ChartFunnel.md)   | Conversion through ordered stages                  | `data` on the root                        |

Shared parts:

| Part           | Line | Bar | Scatter | Pie | Funnel |
| -------------- | :--: | :-: | :-----: | :-: | :----: |
| `ChartLegend`  |  ✅  | ✅  |   ✅    | ✅  |   ✅   |
| `ChartTooltip` |  ✅  | ✅  |   ✅    | ✅  |   ✅   |
| `ChartAxis`    |  ✅  | ✅  |   ✅    |  —  |   —    |

## Import

```ts
import { ChartAxis } from "@bridge-ui/react/Components/ChartAxis";
import { ChartLegend } from "@bridge-ui/react/Components/ChartLegend";
import { ChartTooltip } from "@bridge-ui/react/Components/ChartTooltip";
```

Install `echarts` next to `@bridge-ui/react` when you use a chart. Each root imports only its own series (line, bar, scatter, pie, or funnel) and the SVG renderer. Charts stay off the `@bridge-ui/react` root so apps that never chart do not load `echarts`.

## Examples

### Axes

`position="x"` is the horizontal axis and `position="y"` the vertical one. On a horizontal `ChartBar` the categories sit on `y` and the values on `x`.

```tsx
<ChartLine categories={months}>
  <ChartLineSeries name="Revenue" data={revenue} />
  <ChartAxis position="x" label="Month" />
  <ChartAxis min={0} position="y" formatTick={(value) => `$${value}`} />
</ChartLine>
```

`formatTick` receives the category label, the timestamp (time axis), or the value. Grid lines are on for the value axis and off for the category axis by default.

### Legend

Legend entries are toggle buttons: click to hide or show a series or slice, hover or focus to emphasize it.

```tsx
<ChartLegend interactive={false} />
<ChartLegend align="end" position="top" />
```

`left` and `right` stack the entries beside the plot. With slices (pie, funnel), `showValue` and `showPercent` add value and share columns.

```tsx
<ChartPie data={tags} variant="donut">
  <ChartLegend showPercent position="right" />
</ChartPie>
```

### Tooltip

```tsx
<ChartTooltip formatValue={(value) => currency.format(value)} />
```

```tsx
<ChartTooltip
  slots={{
    content: ({ title, items }) => (
      <span>
        {title}: {items.length} series
      </span>
    ),
  }}
/>
```

The tooltip title is the category (line, bar) or the series name (scatter). Slices show one row with the value and the share; format the share with `formatPercent`.

### Colors

Series and slices take palette colors in order. Override the palette on the root, or pass a token key or any CSS color.

```tsx
<ChartLine categories={months} palette={["info", "warning"]}>
  <ChartLineSeries name="Plan" data={plan} />
  <ChartLineSeries name="Actual" data={actual} color="#8b5cf6" />
</ChartLine>
```

Token keys (`primary`, `info`, `success`, `warning`, `error`, `secondary`, `dark`, `black`) follow light and dark mode automatically.

### Loading and empty

While `loading` is true, the plot stays visible behind a translucent overlay with a spinner, and the root gets `aria-busy`. Use the `loading` slot to replace the spinner.

```tsx
<ChartBar loading={isLoading} categories={months}>
  <ChartBarSeries name="Orders" data={orders} />
</ChartBar>
```

```tsx
<ChartPie data={[]} slots={{ empty: "No outflows this month" }} />
```

### Summary

Each root generates a text summary for screen readers. Pass `summary` to describe the takeaway instead.

```tsx
<ChartLine categories={months} summary="Revenue doubled from January to June.">
  <ChartLineSeries name="Revenue" data={revenue} />
</ChartLine>
```

### Registry defaults

Each root has its own registry entry (`ChartLine`, `ChartBar`, `ChartScatter`, `ChartPie`, `ChartFunnel`).

```tsx
<BridgeUIProvider
  components={{
    ChartLegend: { defaultProps: { position: "top" } },
    ChartLine: { defaultProps: { curve: "smooth", height: 320 } },
    ChartBar: { defaultProps: { palette: ["primary", "success"] } },
  }}
>
  <App />
</BridgeUIProvider>
```

Theme tokens (`tokens.theme`) set the grid, axis, and label colors as Tailwind text-color classes:

```tsx
<BridgeUIProvider
  components={{
    ChartLine: {
      tokens: { theme: { grid: "text-dark-100 dark:text-dark-800" } },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

## Accessibility

- The root is a `figure`; the plot is a focusable `img` labelled by `summary` (or the generated summary).
- Arrow keys move between items (categories, points, slices, or stages), `Home` / `End` jump to the edges, `Escape` clears. The tooltip follows the keyboard, and the values are announced through a live region.
- A data table with every value is always rendered, visually hidden.
- The tooltip is decorative (`aria-hidden`); the same information is in the table and announcements.
- Engine animation is off under `prefers-reduced-motion`.

## Props (every root)

| Prop          | Type                   | Default                  | Description                                            |
| ------------- | ---------------------- | ------------------------ | ------------------------------------------------------ |
| `animation`   | `boolean`              | `true`                   | Engine transitions (always off for reduced motion).    |
| `children`    | `ReactNode`            | —                        | Series, `ChartAxis`, `ChartLegend`, `ChartTooltip`.    |
| `classes`     | `ChartClasses`         | —                        | `root`, `plot`, `center`, `loading`, `empty`, `table`. |
| `height`      | `number \| string`     | `280`                    | Plot height.                                           |
| `loading`     | `boolean`              | `false`                  | Shows the spinner overlay.                             |
| `palette`     | `ChartColorValue[]`    | primary, info, success … | Colors in order.                                       |
| `size`        | `ChartSize`            | `"md"`                   | Density of labels, legend, and tooltip.                |
| `slots`       | `{ empty?, loading? }` | —                        | Custom empty and loading content.                      |
| `summary`     | `string`               | generated                | Accessible description of the plot.                    |
| `width`       | `number \| string`     | `"100%"`                 | Root width.                                            |
| `customProps` | `ChartCustomProps`     | —                        | Extra props for `root` and `plot`.                     |

## Props (`ChartAxis`)

| Prop         | Type                                  | Default                     | Description                         |
| ------------ | ------------------------------------- | --------------------------- | ----------------------------------- |
| `position`   | `"x" \| "y"`                          | required                    | Horizontal (`x`) or vertical (`y`). |
| `label`      | `string`                              | —                           | Axis title.                         |
| `grid`       | `boolean`                             | value axis on, category off | Grid lines.                         |
| `hidden`     | `boolean`                             | `false`                     | Hides the axis line and labels.     |
| `min`        | `number`                              | —                           | Lower bound (value or time axis).   |
| `max`        | `number`                              | —                           | Upper bound (value or time axis).   |
| `tickCount`  | `number`                              | —                           | Preferred number of ticks.          |
| `formatTick` | `(value: number \| string) => string` | —                           | Tick label formatter.               |

## Props (`ChartLegend`)

| Prop            | Type                                     | Default    | Description                                            |
| --------------- | ---------------------------------------- | ---------- | ------------------------------------------------------ |
| `align`         | `"start" \| "center" \| "end"`           | `"center"` | Entry alignment.                                       |
| `position`      | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Where the legend sits.                                 |
| `interactive`   | `boolean`                                | `true`     | Entries toggle and emphasize items.                    |
| `showValue`     | `boolean`                                | `false`    | Value column (pie, funnel).                            |
| `showPercent`   | `boolean`                                | `false`    | Share column (pie, funnel).                            |
| `formatValue`   | `(value: number) => string`              | —          | Value column formatter.                                |
| `formatPercent` | `(percent: number) => string`            | —          | Share column formatter.                                |
| `classes`       | `ChartLegendClasses`                     | —          | `root`, `item`, `swatch`, `label`, `value`, `percent`. |
| `customProps`   | `ChartLegendCustomProps`                 | —          | Extra props for `root` and `item`.                     |

## Props (`ChartTooltip`)

| Prop            | Type                                   | Default | Description                                                     |
| --------------- | -------------------------------------- | ------- | --------------------------------------------------------------- |
| `formatValue`   | `(value, item) => string`              | —       | Value formatter.                                                |
| `formatPercent` | `(percent, item) => string`            | —       | Share formatter (pie, funnel).                                  |
| `slots`         | `{ content?: (context) => ReactNode }` | —       | Replaces the title and rows.                                    |
| `classes`       | `ChartTooltipClasses`                  | —       | `root`, `title`, `item`, `swatch`, `label`, `value`, `percent`. |
| `customProps`   | `ChartTooltipCustomProps`              | —       | Extra props for `root`.                                         |
