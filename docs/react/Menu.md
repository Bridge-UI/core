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
  placement="bottom-end"
  show={open}
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

| Prop               | Type                      | Default          | Description             |
| ------------------ | ------------------------- | ---------------- | ----------------------- |
| `anchorEl`         | `RefObject \| Element`    | —                | External anchor element |
| `closeOnClickAway` | `boolean`                 | `true`           | Close on outside click  |
| `closeOnEscape`    | `boolean`                 | `true`           | Close on Escape         |
| `offset`           | `number`                  | `8`              | Gap from anchor         |
| `onShowChange`     | `(show: boolean) => void` | —                | Visibility callback     |
| `persistent`       | `boolean`                 | `false`          | Block dismiss           |
| `placement`        | `MenuPlacement`           | `"bottom-start"` | Panel position          |
| `shadow`           | `Shadow`                  | `"md"`           | Panel shadow            |
| `show`             | `boolean`                 | `false`          | Open state              |
| `teleportTo`       | `string \| false`         | `"body"`         | Portal target           |

## Related components

List, ListItem, Select, Button
