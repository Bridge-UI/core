# Divider

Horizontal or vertical separator for grouping content.

## Import

```ts
import { Divider } from "@bridge-ui/vue/Components/Divider";
```

## Examples

### Usage

```vue
<div class="space-y-4">
  <p>Section one</p>
  <Divider />
  <p>Section two</p>
</div>
```

### Vertical

```vue
<div class="flex h-8 items-center gap-4">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>
```

### Color

```vue
<Divider color="primary" />
<Divider color="error" />
```

### Custom classes

```vue
<Divider class="my-6" />
```

## Props

| Prop          | Type                 | Default        | Description                          |
| ------------- | -------------------- | -------------- | ------------------------------------ |
| `classes`     | `DividerClasses`     | —              | The classes to apply to the divider. |
| `color`       | `DividerColor`       | `"dark"`       | The color of the divider.            |
| `orientation` | `DividerOrientation` | `"horizontal"` | The orientation of the divider.      |

## Related components

Card, ListItem, Menu
