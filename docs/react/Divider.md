# Divider

Horizontal or vertical separator for grouping content.

## Import

```ts
import { Divider } from "@bridge-ui/react/Components/Divider";
```

## Examples

### Usage

```tsx
<div className="space-y-4">
  <p>Section one</p>
  <Divider />
  <p>Section two</p>
</div>
```

### Vertical

```tsx
<div className="flex h-8 items-center gap-4">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>
```

### Color

```tsx
<Divider color="primary" />
<Divider color="error" />
```

### Custom classes

```tsx
<Divider className="my-6" />
```

## Props

| Prop          | Type                 | Default        | Description                          |
| ------------- | -------------------- | -------------- | ------------------------------------ |
| `classes`     | `DividerClasses`     | —              | The classes to apply to the divider. |
| `color`       | `DividerColor`       | `"dark"`       | The color of the divider.            |
| `orientation` | `DividerOrientation` | `"horizontal"` | The orientation of the divider.      |

## Related components

Card, ListItem, Menu
