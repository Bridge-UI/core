# ButtonGroup

Groups related action buttons in a single attached strip, with a divider between each child. Size, color, and variant stay on each `Button`. Use `ToggleGroup` when the controls select a value.

## Import

```ts
import { ButtonGroup } from "@bridge-ui/react/Components/ButtonGroup";
```

## Examples

### Usage

```tsx
<ButtonGroup aria-label="Export">
  <Button variant="outline">Copy</Button>
  <Button variant="outline">Paste</Button>
</ButtonGroup>
```

### Orientation

```tsx
<ButtonGroup aria-label="Zoom" orientation="vertical">
  <Button variant="outline">+</Button>
  <Button variant="outline">-</Button>
</ButtonGroup>
```

### Size

Size is set on each `Button`, not on the group.

```tsx
<ButtonGroup aria-label="Small">
  <Button size="sm" variant="outline">
    One
  </Button>
  <Button size="sm" variant="outline">
    Two
  </Button>
</ButtonGroup>
```

### Nested

Nest groups to space clusters of actions. Dividers stay inside each inner group. Keep inner groups as the only direct children of the outer group — mixing loose `Button` children with nested groups removes the hairline divider between all children.

```tsx
<ButtonGroup aria-label="Editor">
  <ButtonGroup>
    <Button variant="outline">Bold</Button>
    <Button variant="outline">Italic</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Undo</Button>
    <Button variant="outline">Redo</Button>
  </ButtonGroup>
</ButtonGroup>
```

### Split

```tsx
<ButtonGroup aria-label="Save">
  <Button>Save</Button>
  <Button density="mini" icon={ChevronDown} aria-label="More save options" />
</ButtonGroup>
```

### Full width

```tsx
<ButtonGroup full aria-label="Export">
  <Button variant="outline">Copy</Button>
  <Button variant="outline">Paste</Button>
</ButtonGroup>
```

## Props

| Prop          | Type                     | Default        | Description                               |
| ------------- | ------------------------ | -------------- | ----------------------------------------- |
| `classes`     | `ButtonGroupClasses`     | —              | Classes for button group parts.           |
| `customProps` | `ButtonGroupCustomProps` | —              | Extra props for internal parts.           |
| `full`        | `boolean`                | `false`        | Stretch the group to the container width. |
| `orientation` | `ButtonGroupOrientation` | `"horizontal"` | Layout orientation of the group.          |

Pass `aria-label` or `aria-labelledby` on the group.

## Related components

Button, ToggleGroup
