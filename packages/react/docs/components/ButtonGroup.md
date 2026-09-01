# ButtonGroup

Groups related action buttons in a joined strip with a full-height divider between children. The divider fill matches the button text color. Set `size`, `variant`, `color`, `density`, or `rounded` on the group to apply them to nested `Button` children. A `Button` can still override any of those props. Set `selected` on a `Button` to show a pressed state. Use `ToggleGroup` when the controls select a value.

## Import

```ts
import { ButtonGroup } from "@bridge-ui/react/Components/ButtonGroup";
```

## Examples

### Usage

```tsx
<ButtonGroup variant="outline" aria-label="Export">
  <Button>Copy</Button>
  <Button>Paste</Button>
</ButtonGroup>
```

### Orientation

```tsx
<ButtonGroup variant="outline" aria-label="Zoom" orientation="vertical">
  <Button>+</Button>
  <Button>-</Button>
</ButtonGroup>
```

### Size

```tsx
<ButtonGroup size="sm" variant="outline" aria-label="Small">
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>
```

### Selected

Set `selected` on a `Button` for a pressed action. Use `ToggleGroup` when the controls select a value.

```tsx
<ButtonGroup variant="outline" aria-label="Format">
  <Button selected>Bold</Button>
  <Button>Italic</Button>
  <Button>Underline</Button>
</ButtonGroup>
```

### Color

```tsx
<ButtonGroup color="primary" variant="outline" aria-label="Export">
  <Button>Copy</Button>
  <Button>Paste</Button>
</ButtonGroup>
```

### Nested

Nest groups to space clusters of actions. Joined edges and dividers stay inside each inner group. Appearance props cascade through nested groups. Keep inner groups as the only direct children of the outer group — mixing loose `Button` children with nested groups removes the hairline divider between all children.

```tsx
<ButtonGroup variant="outline" aria-label="Editor">
  <ButtonGroup>
    <Button>Bold</Button>
    <Button>Italic</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button>Undo</Button>
    <Button>Redo</Button>
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
<ButtonGroup full variant="outline" aria-label="Export">
  <Button>Copy</Button>
  <Button>Paste</Button>
</ButtonGroup>
```

### No separator

```tsx
<ButtonGroup variant="outline" separator={false} aria-label="Export">
  <Button>Copy</Button>
  <Button>Paste</Button>
</ButtonGroup>
```

## Props

| Prop          | Type                     | Default        | Description                                                                                   |
| ------------- | ------------------------ | -------------- | --------------------------------------------------------------------------------------------- |
| `classes`     | `ButtonGroupClasses`     | —              | Classes for button group parts.                                                               |
| `color`       | `ButtonColor`            | `"primary"`    | Color applied to nested buttons when set. The divider follows the button text color.          |
| `customProps` | `ButtonGroupCustomProps` | —              | Extra props for internal parts.                                                               |
| `density`     | `ButtonDensity`          | —              | Density applied to nested buttons unless they set `density`.                                  |
| `full`        | `boolean`                | `false`        | Stretch the group to the container width.                                                     |
| `orientation` | `ButtonGroupOrientation` | `"horizontal"` | Layout orientation of the group.                                                              |
| `rounded`     | `ButtonRounded`          | —              | Roundness applied to nested buttons unless they set `rounded`.                                |
| `separator`   | `boolean`                | `true`         | Draw a full-height divider between adjacent children. The fill matches the button text color. |
| `size`        | `ButtonSize`             | —              | Size applied to nested buttons unless they set `size`.                                        |
| `variant`     | `ButtonVariant`          | —              | Variant applied to nested buttons unless they set `variant`.                                  |

Pass `aria-label` or `aria-labelledby` on the group.

## Related components

Button, ToggleGroup
