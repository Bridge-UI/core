# Progress

Linear progress indicator for determinate, indeterminate, buffer, and query loading states.

## Import

```ts
import { Progress } from "@bridge-ui/react/Components/Progress";
```

## Examples

### Indeterminate

```tsx
<Progress aria-label="Loading…" />
```

### Determinate

```tsx
<Progress value={40} variant="determinate" aria-label="Export data" />
```

### Buffer

```tsx
<Progress value={30} valueBuffer={60} variant="buffer" aria-label="Loading…" />
```

### Query

```tsx
<Progress variant="query" aria-label="Loading…" />
```

### Color and size

```tsx
<Progress size="lg" color="success" aria-label="Saving…" />
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
