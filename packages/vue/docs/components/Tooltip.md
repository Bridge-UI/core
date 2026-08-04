# Tooltip

Anchored hint that appears on hover or focus. Put the opener in the `trigger` slot (or pass `anchorEl`). Use `content` for plain text, or the default slot for custom panel body (default slot wins when both are set). Visibility uses `v-model` (omit for uncontrolled hover/focus when using `trigger`).

## Import

```ts
import { Tooltip } from "@bridge-ui/vue/Components/Tooltip";
```

## Examples

### Usage

```vue
<Tooltip content="Save changes">
  <template #trigger>
    <Button>Save</Button>
  </template>
</Tooltip>
```

### Placement

```vue
<Tooltip content="Top end" placement="top-end">
  <template #trigger>
    <Button>Hover me</Button>
  </template>
</Tooltip>
```

### Without arrow

```vue
<Tooltip :arrow="false" content="No arrow">
  <template #trigger>
    <Button>Save</Button>
  </template>
</Tooltip>
```

### Controlled

```vue
<Tooltip v-model="open" content="Controlled">
  <template #trigger>
    <Button>Save</Button>
  </template>
</Tooltip>
```

### anchorEl

```vue
<button ref="anchorRef">External anchor</button>

<Tooltip v-model="open" content="From anchor" :anchor-el="anchorRef">
</Tooltip>
```

### Custom default slot

```vue
<Tooltip>
  <template #trigger>
    <Button>Save</Button>
  </template>
  <span class="font-bold">Custom body</span>
</Tooltip>
```

### Color and size

```vue
<Tooltip size="lg" color="primary" content="Primary tip">
  <template #trigger>
    <Button>Save</Button>
  </template>
</Tooltip>
```

## Props

| Prop          | Type                  | Default   | Description                                                                                          |
| ------------- | --------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `anchorEl`    | `HTMLElement \| null` | —         | Element that anchors the tooltip panel. When set, it is used for positioning instead of the trigger. |
| `arrow`       | `boolean`             | `true`    | Whether the tooltip shows an arrow pointing at the trigger.                                          |
| `classes`     | `TooltipClasses`      | —         | Classes for `root`, `trigger`, `content`, and `arrow`.                                               |
| `closeDelay`  | `number`              | `0`       | Delay in ms before closing after pointer leave / blur.                                               |
| `color`       | `TooltipColor`        | `"dark"`  | Semantic color of the tooltip panel.                                                                 |
| `content`     | `string`              | —         | Plain text for the tooltip panel. Prefer the default slot for custom markup.                         |
| `customProps` | `TooltipCustomProps`  | —         | Extra props for internal parts.                                                                      |
| `disabled`    | `boolean`             | `false`   | When true, the tooltip does not open on hover or focus.                                              |
| `offset`      | `number`              | `8`       | Gap between the trigger and the tooltip panel (px).                                                  |
| `openDelay`   | `number`              | `200`     | Delay in ms before opening after pointer enter / focus.                                              |
| `placement`   | `PositionPlacement`   | `"top"`   | Preferred placement of the tooltip relative to the anchor.                                           |
| `rounded`     | `TooltipRounded`      | `"md"`    | The roundedness of the tooltip panel.                                                                |
| `size`        | `TooltipSize`         | `"md"`    | Padding and typography of the tooltip panel.                                                         |
| `strategy`    | `PositionStrategy`    | `"fixed"` | CSS position strategy for the floating panel.                                                        |
| `teleportTo`  | `string \| false`     | `"body"`  | Where to portal the tooltip panel. Pass `false` to render in place.                                  |

### Binding

| Prop           | Type                      | Default | Description                                                                        |
| -------------- | ------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `v-model`      | `boolean`                 | `false` | Whether the tooltip is visible. Omit for uncontrolled hover/focus with `#trigger`. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when visibility should change (without relying on `v-model`).               |

## Events

| Event         | Payload   | Description                            |
| ------------- | --------- | -------------------------------------- |
| `show-change` | `boolean` | Emitted when visibility should change. |

## Slots

| Slot      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `default` | Custom panel body. Wins over the `content` prop when both are set. |
| `trigger` | The trigger element that opens the tooltip.                        |

## Related components

Menu, Spinner
