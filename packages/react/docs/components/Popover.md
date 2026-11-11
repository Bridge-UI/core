# Popover

Anchored, non-modal floating panel for free-form content: filters, short forms, profile cards. Control with `show` / `onShowChange`.

Use `Menu` for a list of actions (arrow keys move between items) and `Tooltip` for short hover text. Popover keeps the keyboard for its fields: Tab moves through them and arrow / Home / End stay inside inputs.

## Import

```ts
import { Popover } from "@bridge-ui/react/Components/Popover";
```

## Examples

### Usage

```tsx
<Popover
  show={open}
  title="Filters"
  onShowChange={setOpen}
  slots={{ trigger: <Button>Filters</Button> }}
>
  <Checkbox endLabel="Only active" />
</Popover>
```

### Form with ActionFooter

Pass a function as `children` to receive `close`.

```tsx
<Popover
  show={open}
  title="Edit name"
  onShowChange={setOpen}
  slots={{ trigger: <Button>Edit name</Button> }}
>
  {({ close }) => (
    <div className="flex flex-col gap-3">
      <TextField
        value={name}
        label="Name"
        onChange={(event) => setName(event.target.value)}
      />

      <div className="flex justify-end gap-2">
        <ActionFooter
          onCancel={close}
          onApply={() => {
            save(name);
            close();
          }}
        />
      </div>
    </div>
  )}
</Popover>
```

### Arrow and placement

```tsx
<Popover
  arrow
  show={open}
  placement="top"
  onShowChange={setOpen}
  slots={{ trigger: <Button>Details</Button> }}
>
  <Text>Last synced 5 minutes ago.</Text>
</Popover>
```

### Without a title

Label the dialog with `aria-label` on the content.

```tsx
<Popover
  show={open}
  onShowChange={setOpen}
  slots={{ trigger: <Avatar alt="Jane Doe" /> }}
  customProps={{ content: { "aria-label": "Profile" } }}
>
  <ProfileCard />
</Popover>
```

### Persistent

Escape, click-away and focus leaving do not close it; close from the content.

```tsx
<Popover
  persistent
  show={open}
  onShowChange={setOpen}
  slots={{ trigger: <Button>Open</Button> }}
>
  {({ close }) => <Button onClick={close}>Done</Button>}
</Popover>
```

### anchorEl

```tsx
<div ref={anchorRef}>
  <Button onClick={() => setOpen(true)}>External anchor</Button>
</div>

<Popover show={open} anchorEl={anchorRef} onShowChange={setOpen}>
  <Text>Anchored to an element outside the Popover.</Text>
</Popover>
```

### Classes

```tsx
<Popover
  arrow
  show={open}
  title="Styled"
  onShowChange={setOpen}
  slots={{ trigger: <Button>Open</Button> }}
  classes={{
    content: "w-80",
    title: "uppercase tracking-wide",
    arrow: "bg-primary-50 dark:bg-primary-950",
  }}
>
  <Text>Custom part classes.</Text>
</Popover>
```

## Props

| Prop                | Type                                                      | Default        | Description                                                                                                                                                   |
| ------------------- | --------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchorEl`          | `HTMLElement \| RefObject<HTMLElement \| null> \| null`   | —              | Element that anchors the popover. When set, it is used for positioning and click-away instead of the `trigger` slot wrapper. Not merged into Bridge defaults. |
| `arrow`             | `boolean`                                                 | `false`        | Whether to show an arrow pointing at the anchor.                                                                                                              |
| `children`          | `ReactNode \| ((props: PopoverRenderProps) => ReactNode)` | —              | The popover content. Pass a function to receive `close`.                                                                                                      |
| `classes`           | `PopoverClasses`                                          | —              | Part classes: `root`, `trigger`, `content`, `title`, `arrow`.                                                                                                 |
| `closeOnClickAway`  | `boolean`                                                 | `true`         | Whether the popover closes when clicking outside the trigger and content.                                                                                     |
| `closeOnEscape`     | `boolean`                                                 | `true`         | Whether the popover closes on escape key press.                                                                                                               |
| `closeOnFocusOut`   | `boolean`                                                 | `true`         | Whether the popover closes when focus moves outside the trigger and content.                                                                                  |
| `customProps`       | `PopoverCustomProps`                                      | —              | Props forwarded to each part (`root`, `trigger`, `content`, `title`, `arrow`).                                                                                |
| `disableAutoFocus`  | `boolean`                                                 | `false`        | When true, the popover does not move focus into the content on open.                                                                                          |
| `disableScrollLock` | `boolean`                                                 | `true`         | When true, body scroll is not locked while the popover is open.                                                                                               |
| `keepMounted`       | `boolean`                                                 | `false`        | When true, the popover stays mounted in the DOM after closing (hidden).                                                                                       |
| `matchWidth`        | `boolean`                                                 | `false`        | When true, the content width matches the trigger / anchor.                                                                                                    |
| `offset`            | `number`                                                  | 8              | Gap between the anchor and the content (px).                                                                                                                  |
| `persistent`        | `boolean`                                                 | `false`        | When true, escape, click-away and focus leaving do not close the popover.                                                                                     |
| `placement`         | `PositionPlacement`                                       | "bottom-start" | Preferred placement of the content relative to the anchor.                                                                                                    |
| `rounded`           | `PopoverRounded`                                          | "md"           | The roundedness of the content.                                                                                                                               |
| `shadow`            | `PopoverShadow`                                           | "md"           | The shadow to apply to the content.                                                                                                                           |
| `slots`             | `PopoverSlots`                                            | —              | `trigger`: the element that opens the popover.                                                                                                                |
| `strategy`          | `PositionStrategy`                                        | "fixed"        | CSS position strategy for the content.                                                                                                                        |
| `teleportTo`        | `string \| false`                                         | "body"         | Where to portal the content. Pass `false` to render in place (keeps the natural Tab order after the trigger).                                                 |
| `title`             | `ReactNode`                                               | —              | Heading rendered at the top of the content. Labels the dialog (`aria-labelledby`); without it, pass `aria-label` via `customProps.content`.                   |

### Binding

| Prop           | Type                      | Default | Description                                                                |
| -------------- | ------------------------- | ------- | -------------------------------------------------------------------------- |
| `show`         | `boolean`                 | `false` | Whether the popover is open. Use with `onShowChange` for controlled state. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when `show` should change.                                          |

## Events

| Callback  | Payload | Description                                                                                                                                                              |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onClose` | —       | Called when the user dismisses the popover (Escape, click-away or focus leaving), or when content calls `close`. Not fired when the parent sets `show={false}` directly. |

## Accessibility

- Content is `role="dialog"` (non-modal: no focus trap, no scroll lock by default). The trigger wrapper has `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.
- Opening moves focus to the first focusable element (or the content itself). Escape closes the top-most layer. Closing while focus is inside the content (Escape, `close`, click-away) returns focus to the trigger.
- Clicks inside layers opened from the content (a `Select` list, a nested `Menu`) do not close the popover.
- Opening a popover closes any open `Menu`.

## Related components

Menu, Tooltip, Modal, ActionFooter, Button
