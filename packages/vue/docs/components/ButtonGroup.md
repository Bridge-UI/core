# ButtonGroup

Groups related action controls in a single attached strip, with a divider between each child. Size, color, and variant stay on each `Button`. Use `ToggleGroup` when the controls select a value.

## Import

```ts
import {
  ButtonGroup,
  ButtonGroupText,
} from "@bridge-ui/vue/Components/ButtonGroup";
```

## Examples

### Usage

```vue
<ButtonGroup aria-label="Export">
  <Button variant="outline">Copy</Button>
  <Button variant="outline">Paste</Button>
</ButtonGroup>
```

### Orientation

```vue
<ButtonGroup aria-label="Zoom" orientation="vertical">
  <Button variant="outline">+</Button>
  <Button variant="outline">-</Button>
</ButtonGroup>
```

### Size

Size is set on each `Button`, not on the group.

```vue
<ButtonGroup aria-label="Small">
  <Button size="sm" variant="outline">One</Button>
  <Button size="sm" variant="outline">Two</Button>
</ButtonGroup>
```

### Nested

Nest groups to space clusters of actions. Dividers stay inside each inner group.

```vue
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

```vue
<ButtonGroup aria-label="Save">
  <Button>Save</Button>
  <Button density="mini" :icon="ChevronDown" aria-label="More save options" />
</ButtonGroup>
```

### Text

```vue
<ButtonGroup aria-label="Amount">
  <ButtonGroupText>USD</ButtonGroupText>
  <Button variant="outline">Pay</Button>
</ButtonGroup>
```

### Full width

```vue
<ButtonGroup full aria-label="Export">
  <Button variant="outline">Copy</Button>
  <Button variant="outline">Paste</Button>
</ButtonGroup>
```

## Props

### ButtonGroup

| Prop          | Type                     | Default        | Description                                 |
| ------------- | ------------------------ | -------------- | ------------------------------------------- |
| `classes`     | `ButtonGroupClasses`     | —              | Classes for button group parts.             |
| `color`       | `ButtonGroupColor`       | `"dark"`       | Fill color of the divider between children. |
| `customProps` | `ButtonGroupCustomProps` | —              | Extra props for internal parts.             |
| `full`        | `boolean`                | `false`        | Stretch the group to the container width.   |
| `orientation` | `ButtonGroupOrientation` | `"horizontal"` | Layout orientation of the group.            |

Pass `aria-label` or `aria-labelledby` on the group.

### ButtonGroupText

| Prop          | Type                         | Default  | Description                     |
| ------------- | ---------------------------- | -------- | ------------------------------- |
| `as`          | `"span" \| "label"`          | `"span"` | The element to render as.       |
| `classes`     | `ButtonGroupTextClasses`     | —        | Classes for text parts.         |
| `customProps` | `ButtonGroupTextCustomProps` | —        | Extra props for internal parts. |

## Related components

Button, ToggleGroup
