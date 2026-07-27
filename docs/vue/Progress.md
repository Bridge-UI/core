# Progress

Linear progress indicator for determinate, indeterminate, buffer, and query loading states.

## Import

```ts
import { Progress } from "@bridge-ui/vue/Components/Progress";
```

## Examples

### Indeterminate

```vue
<Progress aria-label="Loading…" />
```

### Determinate

```vue
<Progress variant="determinate" :value="40" aria-label="Export data" />
```

### Buffer

```vue
<Progress
  variant="buffer"
  :value="30"
  :value-buffer="60"
  aria-label="Loading…"
/>
```

### Query

```vue
<Progress variant="query" aria-label="Loading…" />
```

### Color and size

```vue
<Progress color="success" size="lg" aria-label="Saving…" />
```

## Props

| Prop          | Type                                                      | Default           | Description                                       |
| ------------- | --------------------------------------------------------- | ----------------- | ------------------------------------------------- |
| `classes`     | `ProgressClasses`                                         | —                 | Classes for `root`, `track`, `bar`, and `buffer`. |
| `color`       | `ProgressColor`                                           | `"primary"`       | Semantic color of the bar and track.              |
| `customProps` | `ProgressCustomProps`                                     | —                 | Extra props for internal parts.                   |
| `rounded`     | `ProgressRounded`                                         | `"full"`          | Border radius of the bar.                         |
| `size`        | `ProgressSize`                                            | `"md"`            | Height of the progress bar.                       |
| `value`       | `number`                                                  | —                 | Progress 0–100 (`determinate` / `buffer`).        |
| `valueBuffer` | `number`                                                  | —                 | Buffer 0–100 (`buffer` variant).                  |
| `variant`     | `"indeterminate" \| "determinate" \| "buffer" \| "query"` | `"indeterminate"` | Visual mode of the indicator.                     |

Pass `aria-label` or `aria-labelledby` for an accessible name.

## Related components

Spinner, Skeleton, Snackbar
