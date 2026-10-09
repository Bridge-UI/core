# Chart

Charts for dashboards and reports. Pick the root for the shape of your data; every root shares the same legend, tooltip, tokens, dark mode, and a11y (summary, keyboard navigation, data table). The plot engine is ECharts.

| Root                                | Use for                                                        | Data                                      |
| ----------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| [`ChartLine`](./ChartLine.md)       | Trends, areas, stacked areas, steps, sparklines                | `ChartLineSeries`, one value per category |
| [`ChartBar`](./ChartBar.md)         | Comparisons, rankings (horizontal), stacked totals, bar + line | `ChartBarSeries` (+ `ChartLineSeries`)    |
| [`ChartScatter`](./ChartScatter.md) | Correlation between two numbers, bubbles                       | `ChartScatterSeries`, `[x, y]` points     |
| [`ChartPie`](./ChartPie.md)         | Share of a whole (pie, donut)                                  | `data` on the root                        |
| [`ChartFunnel`](./ChartFunnel.md)   | Conversion through ordered stages                              | `data` on the root                        |

Shared parts:

| Part           | Line | Bar | Scatter | Pie | Funnel |
| -------------- | ---- | --- | ------- | --- | ------ |
| `ChartLegend`  | ✅   | ✅  | ✅      | ✅  | ✅     |
| `ChartTooltip` | ✅   | ✅  | ✅      | ✅  | ✅     |
| `ChartAxis`    | ✅   | ✅  | ✅      | —   | —      |

## Import

```ts
import { ChartAxis } from "@bridge-ui/vue/Components/ChartAxis";
import { ChartLegend } from "@bridge-ui/vue/Components/ChartLegend";
import { ChartTooltip } from "@bridge-ui/vue/Components/ChartTooltip";
```

Install `echarts` next to `@bridge-ui/vue` when you use a chart. Each root imports only its own series (line, bar, scatter, pie, or funnel) and the SVG renderer. Charts stay off the `@bridge-ui/vue` root so apps that never chart do not load `echarts`.

## Examples

### Axes

`position="x"` is the horizontal axis and `position="y"` the vertical one. On a horizontal `ChartBar` the categories sit on `y` and the values on `x`.

```vue
<ChartLine :categories="months">
  <ChartLineSeries name="Revenue" :data="revenue" />
  <ChartAxis
    position="x"
    label="Month"
    :format-category="(month) => month.toUpperCase()"
  />
  <ChartAxis :min="0" position="y" :format-tick="(value) => `$${value}`" />
</ChartLine>
```

`format-category` formats category labels (`string`). `format-tick` formats numbers: the value on a value axis, or the timestamp (ms) on a time axis. Grid lines are on for the value axis and off for the category axis by default.

### Legend

Legend entries are toggle buttons: click to hide or show a series or slice, hover or focus to emphasize it.

```vue
<ChartLegend :interactive="false" />
<ChartLegend align="end" position="top" />
```

`left` and `right` stack the entries beside the plot. With slices (pie, funnel), `show-value` and `show-percent` add value and share columns.

```vue
<ChartPie :data="tags" variant="donut">
  <ChartLegend show-percent position="right" />
</ChartPie>
```

### Tooltip

```vue
<ChartTooltip :format-value="(value) => currency.format(value)" />
```

```vue
<ChartTooltip>
  <template #content="{ title, items }">
    <span>{{ title }}: {{ items.length }} series</span>
  </template>
</ChartTooltip>
```

The tooltip title is the category (line, bar) or the series name (scatter). Slices show one row with the value and the share; format the share with `format-percent`.

### Colors

Series and slices take palette colors in order. Override the palette on the root, or pass a token key or any CSS color.

```vue
<ChartLine :categories="months" :palette="['info', 'warning']">
  <ChartLineSeries name="Plan" :data="plan" />
  <ChartLineSeries name="Actual" :data="actual" color="#8b5cf6" />
</ChartLine>
```

Token keys (`primary`, `info`, `success`, `warning`, `error`, `secondary`, `dark`, `black`) follow light and dark mode automatically.

Colors can also follow the data:

- `color-ranges` on `ChartLineSeries`, `ChartBarSeries`, and `ChartScatterSeries` recolors points, bars, or stretches of a line by value ([ChartLine](./ChartLine.md#color-by-value), [ChartBar](./ChartBar.md#color-by-value), [ChartScatter](./ChartScatter.md#color-by-range)).
- `category-colors` on `ChartBar` gives each category its own color, and `tone="muted"` lightens a series ([ChartBar](./ChartBar.md#category-colors)).

Color is never the only cue: range labels show in the tooltip, the data table, and the keyboard announcements.

### Loading and empty

While `loading` is true, the plot stays visible behind a translucent overlay with a spinner, and the root gets `aria-busy`. Use the `loading` slot to replace the spinner.

```vue
<ChartBar :loading="isLoading" :categories="months">
  <ChartBarSeries name="Orders" :data="orders" />
</ChartBar>
```

```vue
<ChartPie :data="[]">
  <template #empty>No outflows this month</template>
</ChartPie>
```

### Summary

Each root generates a text summary for screen readers. Pass `summary` to describe the takeaway instead.

```vue
<ChartLine :categories="months" summary="Revenue doubled from January to June.">
  <ChartLineSeries name="Revenue" :data="revenue" />
</ChartLine>
```

### Registry defaults

Each root has its own registry entry (`ChartLine`, `ChartBar`, `ChartScatter`, `ChartPie`, `ChartFunnel`).

```vue
<BridgeUIProvider
  :components="{
    ChartLegend: { defaultProps: { position: 'top' } },
    ChartLine: { defaultProps: { curve: 'smooth', height: 320 } },
    ChartBar: { defaultProps: { palette: ['primary', 'success'] } },
  }"
>
  <App />
</BridgeUIProvider>
```

Theme tokens (`tokens.theme`) set the grid, axis, and label colors as Tailwind text-color classes:

```vue
<BridgeUIProvider
  :components="{
    ChartLine: {
      tokens: { theme: { grid: 'text-dark-100 dark:text-dark-800' } },
    },
  }"
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

| Prop           | Type                | Default                  | Description                                            |
| -------------- | ------------------- | ------------------------ | ------------------------------------------------------ |
| `animation`    | `boolean`           | `true`                   | Engine transitions (always off for reduced motion).    |
| `classes`      | `ChartClasses`      | —                        | `root`, `plot`, `center`, `loading`, `empty`, `table`. |
| `height`       | `number \| string`  | `280`                    | Plot height.                                           |
| `loading`      | `boolean`           | `false`                  | Shows the spinner overlay.                             |
| `palette`      | `ChartColorValue[]` | primary, info, success … | Colors in order.                                       |
| `size`         | `ChartSize`         | `"md"`                   | Density of labels, legend, and tooltip.                |
| `summary`      | `string`            | generated                | Accessible description of the plot.                    |
| `width`        | `number \| string`  | `"100%"`                 | Root width.                                            |
| `custom-props` | `ChartCustomProps`  | —                        | Extra props for `root` and `plot`.                     |

Slots: `default` (series, `ChartAxis`, `ChartLegend`, `ChartTooltip`), `empty`, `loading`.

## Props (`ChartAxis`)

| Prop              | Type                           | Default                     | Description                         |
| ----------------- | ------------------------------ | --------------------------- | ----------------------------------- |
| `position`        | `"x" \| "y"`                   | required                    | Horizontal (`x`) or vertical (`y`). |
| `label`           | `string`                       | —                           | Axis title.                         |
| `grid`            | `boolean`                      | value axis on, category off | Grid lines.                         |
| `hidden`          | `boolean`                      | `false`                     | Hides the axis line and labels.     |
| `min`             | `number`                       | —                           | Lower bound (value or time axis).   |
| `max`             | `number`                       | —                           | Upper bound (value or time axis).   |
| `tick-count`      | `number`                       | —                           | Preferred number of ticks.          |
| `format-tick`     | `(value: number) => string`    | —                           | Value or time (ms) tick formatter.  |
| `format-category` | `(category: string) => string` | —                           | Category tick formatter.            |

## Props (`ChartLegend`)

| Prop             | Type                                     | Default    | Description                                            |
| ---------------- | ---------------------------------------- | ---------- | ------------------------------------------------------ |
| `align`          | `"start" \| "center" \| "end"`           | `"center"` | Entry alignment.                                       |
| `position`       | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Where the legend sits.                                 |
| `interactive`    | `boolean`                                | `true`     | Entries toggle and emphasize items.                    |
| `show-value`     | `boolean`                                | `false`    | Value column (pie, funnel).                            |
| `show-percent`   | `boolean`                                | `false`    | Share column (pie, funnel).                            |
| `format-value`   | `(value: number) => string`              | —          | Value column formatter.                                |
| `format-percent` | `(percent: number) => string`            | —          | Share column formatter.                                |
| `classes`        | `ChartLegendClasses`                     | —          | `root`, `item`, `swatch`, `label`, `value`, `percent`. |
| `custom-props`   | `ChartLegendCustomProps`                 | —          | Extra props for `root` and `item`.                     |

## Props (`ChartTooltip`)

| Prop             | Type                        | Default | Description                                                             |
| ---------------- | --------------------------- | ------- | ----------------------------------------------------------------------- |
| `format-value`   | `(value, item) => string`   | —       | Value formatter.                                                        |
| `format-percent` | `(percent, item) => string` | —       | Share formatter (pie, funnel).                                          |
| `classes`        | `ChartTooltipClasses`       | —       | `root`, `title`, `item`, `swatch`, `label`, `value`, `percent`, `note`. |
| `custom-props`   | `ChartTooltipCustomProps`   | —       | Extra props for `root`.                                                 |

Slot: `content` (`{ index, title, color, items }`) replaces the title and rows.
