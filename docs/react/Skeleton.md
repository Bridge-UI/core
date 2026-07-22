# Skeleton

Placeholder block for loading states. Size it with Tailwind height/width classes.

## Import

```ts
import { Skeleton } from "@bridge-ui/react/Components/Skeleton";
```

## Examples

### Usage

```tsx
<Skeleton className="h-4 w-32" />

<Skeleton className="h-10 w-10" rounded="full" />

<Skeleton className="h-24 w-full" rounded="lg" />
```

### Custom classes

```tsx
<Skeleton className="h-4 w-48 bg-primary-200 dark:bg-primary-800" />
```

## Props

| Prop      | Type              | Default | Description                           |
| --------- | ----------------- | ------- | ------------------------------------- |
| `classes` | `SkeletonClasses` | —       | The classes to apply to the skeleton. |
| `rounded` | `SkeletonRounded` | `"md"`  | The roundedness of the skeleton.      |

## Related components

Avatar, Card
