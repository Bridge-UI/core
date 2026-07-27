# Spinner

Circular progress indicator for determinate and indeterminate loading states.

## Import

```ts
import { Spinner } from "@bridge-ui/react/Components/Spinner";
```

## Examples

### Indeterminate

```tsx
<Spinner aria-label="Loading…" />
```

### Determinate

```tsx
<Spinner variant="determinate" value={40} aria-label="Export data" />
```

### With track

```tsx
<Spinner enableTrack aria-label="Loading…" />
```

### Disable shrink

```tsx
<Spinner disableShrink aria-label="Loading…" />
```

### Color and size

```tsx
<Spinner color="success" size="lg" aria-label="Saving…" />
```

## Props

| Prop            | Type                               | Default           | Description                                       |
| --------------- | ---------------------------------- | ----------------- | ------------------------------------------------- |
| `classes`       | `SpinnerClasses`                   | —                 | Classes for `root`, `svg`, `circle`, and `track`. |
| `color`         | `SpinnerColor`                     | `"primary"`       | Semantic color of the circle (and track).         |
| `customProps`   | `SpinnerCustomProps`               | —                 | Extra props for internal parts.                   |
| `disableShrink` | `boolean`                          | `false`           | Disables indeterminate circle shrink animation.   |
| `enableTrack`   | `boolean`                          | `false`           | Shows a subtle track circle behind the progress.  |
| `size`          | `SpinnerSize`                      | `"md"`            | Width/height of the spinner.                      |
| `thickness`     | `number`                           | `3.6`             | Stroke thickness of the circle.                   |
| `value`         | `number`                           | —                 | Progress 0–100 (`determinate` variant).           |
| `variant`       | `"indeterminate" \| "determinate"` | `"indeterminate"` | Visual mode of the indicator.                     |

Pass `aria-label` or `aria-labelledby` for an accessible name.

## Related components

Progress, Skeleton
