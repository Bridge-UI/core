# Popover

Anchored, non-modal floating panel for free-form content: filters, short forms, profile cards. Control with `v-model`.

Use `Menu` for a list of actions (arrow keys move between items) and `Tooltip` for short hover text. Popover keeps the keyboard for its fields: Tab moves through them and arrow / Home / End stay inside inputs.

## Import

```ts
import { Popover } from "@bridge-ui/vue/Components/Popover";
```

## Examples

### Usage

```vue
<Popover v-model="open" title="Filters">
  <template #trigger>
    <Button>Filters</Button>
  </template>

  <Checkbox end-label="Only active" />
</Popover>
```

### Form with ActionFooter

The default slot receives `close`.

```vue
<Popover v-model="open" title="Edit name">
  <template #trigger>
    <Button>Edit name</Button>
  </template>

  <template #default="{ close }">
    <div class="flex flex-col gap-3">
      <TextField v-model="name" label="Name" />

      <div class="flex justify-end gap-2">
        <ActionFooter
          v-on:cancel="close"
          v-on:apply="
            save(name);
            close();
          "
        />
      </div>
    </div>
  </template>
</Popover>
```

### Arrow and placement

```vue
<Popover arrow v-model="open" placement="top">
  <template #trigger>
    <Button>Details</Button>
  </template>

  <Text>Last synced 5 minutes ago.</Text>
</Popover>
```

### Custom title

The `title` slot labels the dialog.

```vue
<Popover v-model="open">
  <template #trigger>
    <Button>Account</Button>
  </template>

  <template #title>
    <span class="text-primary-600 dark:text-primary-400">Account</span>
  </template>

  <Text>Signed in as jane@example.com</Text>
</Popover>
```

### Without a title

Label the dialog with `aria-label` on the content.

```vue
<Popover
  v-model="open"
  :custom-props="{ content: { 'aria-label': 'Profile' } }"
>
  <template #trigger>
    <Avatar alt="Jane Doe" />
  </template>

  <ProfileCard />
</Popover>
```

### Persistent

Escape, click-away and focus leaving do not close it; close from the content.

```vue
<Popover persistent v-model="open">
  <template #trigger>
    <Button>Open</Button>
  </template>

  <template #default="{ close }">
    <Button v-on:click="close">Done</Button>
  </template>
</Popover>
```

### anchorEl

```vue
<div ref="anchorRef">
  <Button v-on:click="open = true">External anchor</Button>
</div>

<Popover v-model="open" :anchor-el="anchorRef">
  <Text>Anchored to an element outside the Popover.</Text>
</Popover>
```

### Classes

```vue
<Popover
  arrow
  v-model="open"
  title="Styled"
  :classes="{
    content: 'w-80',
    title: 'uppercase tracking-wide',
    arrow: 'bg-primary-50 dark:bg-primary-950',
  }"
>
  <template #trigger>
    <Button>Open</Button>
  </template>

  <Text>Custom part classes.</Text>
</Popover>
```

## Props

| Prop                | Type                      | Default        | Description                                                                                                                                                        |
| ------------------- | ------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `anchorEl`          | `HTMLElement \| null`     | —              | Element that anchors the popover. When set, it is used for positioning and click-away instead of the `trigger` slot wrapper. Not merged into Bridge defaults.      |
| `arrow`             | `boolean`                 | `false`        | Whether to show an arrow pointing at the anchor.                                                                                                                   |
| `classes`           | `PopoverClasses`          | —              | Part classes: `root`, `trigger`, `content`, `title`, `arrow`.                                                                                                      |
| `closeOnClickAway`  | `boolean`                 | `true`         | Whether the popover closes when clicking outside the trigger and content, or when focus moves outside them.                                                        |
| `closeOnEscape`     | `boolean`                 | `true`         | Whether the popover closes on escape key press.                                                                                                                    |
| `customProps`       | `PopoverCustomProps`      | —              | Props forwarded to each part (`root`, `trigger`, `content`, `title`, `arrow`).                                                                                     |
| `disableAutoFocus`  | `boolean`                 | `false`        | When true, the popover does not move focus into the content on open.                                                                                               |
| `disableScrollLock` | `boolean`                 | `true`         | When true, body scroll is not locked while the popover is open.                                                                                                    |
| `keepMounted`       | `boolean`                 | `false`        | When true, the popover stays mounted in the DOM after closing (hidden).                                                                                            |
| `matchWidth`        | `boolean`                 | `false`        | When true, the content width matches the trigger / anchor.                                                                                                         |
| `offset`            | `number`                  | 8              | Gap between the anchor and the content (px).                                                                                                                       |
| `onShowChange`      | `(show: boolean) => void` | —              | Called when `show` should change (controlled state without `v-model`).                                                                                             |
| `persistent`        | `boolean`                 | `false`        | When true, escape, click-away and focus leaving do not close the popover.                                                                                          |
| `placement`         | `PositionPlacement`       | "bottom-start" | Preferred placement of the content relative to the anchor.                                                                                                         |
| `rounded`           | `PopoverRounded`          | "md"           | The roundedness of the content.                                                                                                                                    |
| `shadow`            | `PopoverShadow`           | "md"           | The shadow to apply to the content.                                                                                                                                |
| `strategy`          | `PositionStrategy`        | "fixed"        | CSS position strategy for the content.                                                                                                                             |
| `teleportTo`        | `string \| false`         | "body"         | Where to portal the content. Pass `false` to render in place (keeps the natural Tab order after the trigger).                                                      |
| `title`             | `string`                  | —              | Heading rendered at the top of the content. Labels the dialog (`aria-labelledby`); without it, pass `aria-label` via `customProps.content`. The `title` slot wins. |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | `false` | Whether the popover is open. Bound with `v-model`.                           |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Slots

| Slot      | Props                   | Description                                 |
| --------- | ----------------------- | ------------------------------------------- |
| `default` | `{ close: () => void }` | The popover content.                        |
| `title`   | —                       | Custom heading content (labels the dialog). |
| `trigger` | —                       | The element that opens the popover.         |

## Events

| Event        | Payload | Description                                                                                                                                                                       |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-on:close` | —       | Emitted when the user dismisses the popover (Escape, click-away or focus leaving), or when content calls `close`. Not emitted when the parent sets `v-model` to `false` directly. |

## Accessibility

- Content is `role="dialog"` (non-modal: no focus trap, no scroll lock by default). The trigger wrapper has `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.
- Opening moves focus to the first focusable element (or the content itself). Escape closes the top-most layer and returns focus to the trigger.
- Clicks inside layers opened from the content (a `Select` list, a nested `Menu`) do not close the popover.
- Opening a popover closes any open `Menu`.

## Related components

Menu, Tooltip, Modal, ActionFooter, Button
