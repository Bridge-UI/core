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

| Prop          | Type                 | Default           | Description       |
| ------------- | -------------------- | ----------------- | ----------------- |
| `closeButton` | `boolean`            | `true`            | Dismiss button    |
| `color`       | `Color`              | `"primary"`       | Color preset      |
| `description` | `string`             | —                 | Body text         |
| `duration`    | `number \| false`    | `5000`            | Auto-dismiss ms   |
| `icon`        | `LucideIcon \| null` | —                 | Leading icon      |
| `img`         | `string`             | —                 | Avatar image URL  |
| `position`    | `SnackbarPosition`   | `"bottom-center"` | Viewport position |
| `progressbar` | `boolean`            | `true`            | Countdown bar     |
| `teleportTo`  | `string \| false`    | `"body"`          | Portal target     |
| `title`       | `string`             | —                 | Toast title       |
| `transition`  | `SnackbarTransition` | `"slide"`         | Animation         |
| `show`        | `boolean`            | `false`           | Visible state     |

## Related components

SnackbarAction, Alert, Button
