# Snackbar

Toast notification portaled to the viewport. Sets `role="status"` and `aria-live="polite"` by default.

## Import

```tsx
import { Snackbar } from "@bridge-ui/react/Components/Snackbar";
```

## Examples

### Usage

```tsx
<Button onClick={() => setOpen(true)}>Show snackbar</Button>

<Snackbar
  title="Saved"
  show={open}
  description="Your changes were saved successfully."
  onShowChange={setOpen}
/>
```

### Duration and progressbar

```tsx
<Snackbar
  show={open}
  title="Auto dismiss"
  duration={3000}
  progressbar
  onShowChange={setOpen}
/>
```

### Slots

```tsx
<Snackbar
  show={open}
  onShowChange={setOpen}
  slots={{
    icon: <Icon size="md" icon={InfoIcon} />,
    actions: (
      <Button size="sm" variant="flat" onClick={() => setOpen(false)}>
        Undo
      </Button>
    ),
  }}
>
  Custom children below the description.
</Snackbar>
```

### customProps

```tsx
<Snackbar
  show={open}
  title="customProps"
  onShowChange={setOpen}
  customProps={{
    root: { id: "snackbar-root" },
    title: { id: "snackbar-title" },
  }}
/>
```

## Props

| Prop          | Type                  | Default         | Description                                                                    |
| ------------- | --------------------- | --------------- | ------------------------------------------------------------------------------ |
| `children`    | `ReactNode`           | —               | The children to render below the title/description.                            |
| `classes`     | `SnackbarClasses`     | —               | The classes to apply to the snackbar.                                          |
| `closeButton` | `boolean`             | `true`          | Whether to show the close button.                                              |
| `color`       | `SnackbarColor`       | "primary"       | Tint color for the default icon.                                               |
| `customProps` | `SnackbarCustomProps` | —               | Extra props for internal parts (`icon`, `title`, `description`, etc.).         |
| `description` | `string`              | —               | Body text below the title.                                                     |
| `duration`    | `number \| false`     | 5000            | Auto-dismiss delay in ms. `false` disables the timer.                          |
| `icon`        | `LucideIcon \| null`  | —               | The icon to display. Use `null` to hide the icon.                              |
| `img`         | `string`              | —               | Avatar image URL (shown instead of icon when set).                             |
| `padding`     | `SnackbarPadding`     | "medium"        | Padding for the content area.                                                  |
| `position`    | `SnackbarPosition`    | "bottom-center" | Viewport anchor when portaled (standalone). Ignored when `teleportTo={false}`. |
| `progressbar` | `boolean`             | `true`          | Whether to show the countdown progress bar when `duration` is set.             |
| `slots`       | `SnackbarSlots`       | —               | The slots to apply to the snackbar.                                            |
| `stackId`     | `string`              | —               | Pre-assigned stack id (BridgeSnackbarHost).                                    |
| `teleportTo`  | `string \| false`     | "body"          | Portal target. `false` renders inline without layer stack.                     |
| `title`       | `string`              | —               | Headline text.                                                                 |
| `transition`  | `SnackbarTransition`  | "slide"         | Enter/leave animation preset.                                                  |

### Binding

| Prop           | Type                      | Default | Description                                                                    |
| -------------- | ------------------------- | ------- | ------------------------------------------------------------------------------ |
| `show`         | `boolean`                 | `false` | Whether the snackbar is visible. Use with `onShowChange` for controlled state. |
| `onShowChange` | `(show: boolean) => void` | —       | Called when `show` should change.                                              |

## Events

| Callback  | Payload | Description                                 |
| --------- | ------- | ------------------------------------------- |
| `onClose` | —       | Called when the snackbar requests to close. |

## Related components

SnackbarAction, Alert, Button
