# Tooltip

Anchored hint that appears on hover or focus. Put the opener in `slots.trigger` (or pass `anchorEl`). Use `content` for plain text, or `children` for custom panel body (`children` wins when both are set).

## Import

```ts
import { Tooltip } from "@bridge-ui/react/Components/Tooltip";
```

## Examples

### Usage

```tsx
<Tooltip
  content="Save changes"
  slots={{
    trigger: <Button>Save</Button>,
  }}
/>
```

### Placement

```tsx
<Tooltip
  content="Top end"
  placement="top-end"
  slots={{
    trigger: <Button>Hover me</Button>,
  }}
/>
```

### Without arrow

```tsx
<Tooltip
  arrow={false}
  content="No arrow"
  slots={{
    trigger: <Button>Save</Button>,
  }}
/>
```

### Controlled

```tsx
<Tooltip
  show={open}
  content="Controlled"
  onShowChange={setOpen}
  slots={{
    trigger: <Button>Save</Button>,
  }}
/>
```

### anchorEl

```tsx
<button ref={anchorRef}>External anchor</button>

<Tooltip
  show={open}
  content="From anchor"
  anchorEl={anchorRef}
  onShowChange={setOpen}
/>
```

### Custom children

```tsx
<Tooltip
  slots={{
    trigger: <Button>Save</Button>,
  }}
>
  <span className="font-bold">Custom body</span>
</Tooltip>
```

### Color and size

```tsx
<Tooltip
  size="lg"
  color="primary"
  content="Primary tip"
  slots={{
    trigger: <Button>Save</Button>,
  }}
/>
```

## Props

| Prop          | Type                                                    | Default   | Description                                                                                          |
| ------------- | ------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `anchorEl`    | `HTMLElement \| RefObject<HTMLElement \| null> \| null` | —         | Element that anchors the tooltip panel. When set, it is used for positioning instead of the trigger. |
| `arrow`       | `boolean`                                               | `true`    | Whether the tooltip shows an arrow pointing at the trigger.                                          |
| `children`    | `ReactNode`                                             | —         | Custom panel body. Wins over `content` when both are set.                                            |
| `classes`     | `TooltipClasses`                                        | —         | Classes for `root`, `trigger`, `content`, and `arrow`.                                               |
| `closeDelay`  | `number`                                                | `0`       | Delay in ms before closing after pointer leave / blur.                                               |
| `color`       | `TooltipColor`                                          | `"dark"`  | Semantic color of the tooltip panel.                                                                 |
| `content`     | `string`                                                | —         | Plain text for the tooltip panel. Prefer `children` for custom markup.                               |
| `customProps` | `TooltipCustomProps`                                    | —         | Extra props for internal parts.                                                                      |
| `disabled`    | `boolean`                                               | `false`   | When true, the tooltip does not open on hover or focus.                                              |
| `offset`      | `number`                                                | `8`       | Gap between the trigger and the tooltip panel (px).                                                  |
| `openDelay`   | `number`                                                | `200`     | Delay in ms before opening after pointer enter / focus.                                              |
| `placement`   | `PositionPlacement`                                     | `"top"`   | Preferred placement of the tooltip relative to the anchor.                                           |
| `rounded`     | `TooltipRounded`                                        | `"md"`    | The roundedness of the tooltip panel.                                                                |
| `size`        | `TooltipSize`                                           | `"md"`    | Padding and typography of the tooltip panel.                                                         |
| `slots`       | `TooltipSlots`                                          | —         | Optional `trigger` slot for the opener.                                                              |
| `strategy`    | `PositionStrategy`                                      | `"fixed"` | CSS position strategy for the floating panel.                                                        |
| `teleportTo`  | `string \| false`                                       | `"body"`  | Where to portal the tooltip panel. Pass `false` to render in place.                                  |

### Binding

| Prop           | Type                      | Default | Description                                                                                   |
| -------------- | ------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `show`         | `boolean`                 | —       | Whether the tooltip is visible. Omit for uncontrolled hover/focus when using `slots.trigger`. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when `show` should change.                                                             |

## Related components

Menu, Spinner
