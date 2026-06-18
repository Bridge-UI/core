# Menu

Anchored floating panel for actions and dropdowns. Control with `show` / `onShowChange`.

## Import

```tsx
import { Menu } from "@bridge-ui/react/Components/Menu";
```

## Examples

### Usage

```tsx
<Menu
  show={open}
  onShowChange={setOpen}
  slots={{
    trigger: <Button onClick={() => setOpen(true)}>Open menu</Button>,
  }}
>
  <MenuContent onAction={(label) => setOpen(false)} />
</Menu>
```

### Placement

```tsx
<Menu
  show={open}
  placement="bottom-end"
  onShowChange={setOpen}
  slots={{
    trigger: <Button onClick={() => setOpen(true)}>Open menu</Button>,
  }}
>
  <MenuContent />
</Menu>
```

### Persistent

```tsx
<Menu
  persistent
  show={open}
  onShowChange={setOpen}
  slots={{
    trigger: <Button onClick={() => setOpen(true)}>Open persistent</Button>,
  }}
>
  <MenuContent />
</Menu>
```

### anchorEl

```tsx
<div ref={anchorRef}>
  <Button onClick={() => setOpen(true)}>External anchor</Button>
</div>

<Menu show={open} anchorEl={anchorRef} onShowChange={setOpen}>
  <MenuContent />
</Menu>
```

## Props

| Prop                | Type                                                    | Default        | Description                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchorEl`          | `HTMLElement \| RefObject<HTMLElement \| null> \| null` | —              | Element that anchors the menu panel (MUI `anchorEl`). When set, it is used for positioning and click-away instead of the `trigger` slot wrapper. Prefer this when the opener lives outside the `Menu` or is controlled manually. Not merged into Bridge defaults (DOM nodes must not be deep-merged). |
| `children`          | `ReactNode`                                             | —              | The children to render inside the menu panel.                                                                                                                                                                                                                                                         |
| `classes`           | `MenuClasses`                                           | —              | The classes to apply to the menu.                                                                                                                                                                                                                                                                     |
| `closeOnClickAway`  | `boolean`                                               | `true`         | Whether the menu closes when clicking outside the trigger and panel.                                                                                                                                                                                                                                  |
| `closeOnEscape`     | `boolean`                                               | `true`         | Whether the menu closes on escape key press.                                                                                                                                                                                                                                                          |
| `customProps`       | `MenuCustomProps`                                       | —              | Props forwarded to each menu part.                                                                                                                                                                                                                                                                    |
| `disableAutoFocus`  | `boolean`                                               | `false`        | When true, the menu does not auto-focus the first focusable item on open.                                                                                                                                                                                                                             |
| `disableScrollLock` | `boolean`                                               | `true`         | When true, body scroll is not locked while the menu is open.                                                                                                                                                                                                                                          |
| `keepMounted`       | `boolean`                                               | `false`        | When true, the menu stays mounted in the DOM after closing (hidden).                                                                                                                                                                                                                                  |
| `offset`            | `number`                                                | 4              | Gap between the trigger and the menu panel (px).                                                                                                                                                                                                                                                      |
| `persistent`        | `boolean`                                               | `false`        | When true, escape and click-away do not close the menu.                                                                                                                                                                                                                                               |
| `placement`         | `PositionPlacement`                                     | "bottom-start" | Preferred placement of the menu relative to the anchor (Floating UI).                                                                                                                                                                                                                                 |
| `rounded`           | `MenuRounded`                                           | "md"           | The roundedness of the menu panel.                                                                                                                                                                                                                                                                    |
| `shadow`            | `MenuShadow`                                            | "md"           | The shadow to apply to the menu panel.                                                                                                                                                                                                                                                                |
| `slots`             | `MenuSlots`                                             | —              | The slots to apply to the menu.                                                                                                                                                                                                                                                                       |
| `strategy`          | `PositionStrategy`                                      | "fixed"        | CSS position strategy for the floating panel.                                                                                                                                                                                                                                                         |
| `teleportTo`        | `string \| false`                                       | "body"         | Where to portal the menu panel. Pass `false` to render in place.                                                                                                                                                                                                                                      |

### Binding

| Prop           | Type                      | Default | Description                                                             |
| -------------- | ------------------------- | ------- | ----------------------------------------------------------------------- |
| `show`         | `boolean`                 | `false` | Whether the menu is open. Use with `onShowChange` for controlled state. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when `show` should change.                                       |

## Events

| Callback  | Payload | Description                                                                                                                                                                                            |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onClose` | —       | Called when the user dismisses the menu (Escape or click-away). Not fired when the parent sets `show={false}` directly — use `onShowChange` for that. Sugar for `onShowChange(false)` on user dismiss. |

## Related components

List, ListItem, Select, Button
