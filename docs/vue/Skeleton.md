# Skeleton

Placeholder block for loading states. Size it with Tailwind height/width classes.

## Import

```ts
import { Skeleton } from "@bridge-ui/vue/Components/Skeleton";
```

## Examples

### Usage

```vue
<Skeleton class="h-4 w-32" />

<Skeleton rounded="full" class="h-10 w-10" />

<Skeleton rounded="lg" class="h-24 w-full" />
```

### Custom classes

```vue
<Skeleton class="h-4 w-48 bg-primary-200 dark:bg-primary-800" />
```

## Props

| Prop      | Type              | Default | Description                           |
| --------- | ----------------- | ------- | ------------------------------------- |
| `classes` | `SkeletonClasses` | —       | The classes to apply to the skeleton. |
| `rounded` | `SkeletonRounded` | `"md"`  | The roundedness of the skeleton.      |

## Related components

Avatar, Card
