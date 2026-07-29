# Spinner

Circular progress indicator for determinate and indeterminate loading states.

## Import

```ts
import { Spinner } from "@bridge-ui/vue/Components/Spinner";
```

## Examples

### Indeterminate

```vue
<Spinner aria-label="Loading…" />
```

### Determinate

```vue
<Spinner :value="40" variant="determinate" aria-label="Export data" />
```

### With track

```vue
<Spinner enable-track aria-label="Loading…" />
```

### Disable shrink

```vue
<Spinner disable-shrink aria-label="Loading…" />
```

### Color and size

```vue
<Spinner size="lg" color="success" aria-label="Saving…" />
```

## Props

| Prop            | Type                 | Default           | Description                                       |
| --------------- | -------------------- | ----------------- | ------------------------------------------------- |
| `classes`       | `SpinnerClasses`     | —                 | Classes for `root`, `svg`, `circle`, and `track`. |
| `color`         | `SpinnerColor`       | `"primary"`       | Semantic color of the circle (and track).         |
| `customProps`   | `SpinnerCustomProps` | —                 | Extra props for internal parts.                   |
| `disableShrink` | `boolean`            | `false`           | Disables indeterminate circle shrink animation.   |
| `enableTrack`   | `boolean`            | `false`           | Shows a subtle track circle behind the progress.  |
| `size`          | `SpinnerSize`        | `"md"`            | Width/height of the spinner.                      |
| `thickness`     | `number`             | `3.6`             | Stroke thickness of the circle.                   |
| `value`         | `number`             | —                 | Progress 0–100 (`determinate` variant).           |
| `variant`       | `SpinnerVariant`     | `"indeterminate"` | Visual mode of the indicator.                     |

Pass `aria-label` or `aria-labelledby` for an accessible name.

## Related components

Progress, Skeleton
