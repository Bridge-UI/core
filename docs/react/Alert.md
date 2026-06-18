# Alert

Alert banner for feedback messages. Does not set `role` or `aria-live` by default — pass them when the message is urgent or dynamic.

## Import

```tsx
import { Alert } from "@bridge-ui/react/Components/Alert";
```

## Examples

### Usage

```tsx
<Alert color="primary" title="Heads up" />

<Alert color="error" title="Something went wrong">
  Please try again in a few minutes.
</Alert>

<Alert color="success" variant="outline" title="Saved">
  Your changes were saved successfully.
</Alert>
```

### Customization

```tsx
<Alert
  rounded="2xl"
  variant="flat"
  color="primary"
  title="Alert Message!"
  classes={{
    title: "text-2xl italic font-extrabold",
  }}
/>

<Alert
  color="primary"
  title="Alert Message!"
  slots={{
    action: (
      <Button size="sm" color="primary" variant="flat">
        Dismiss
      </Button>
    ),
  }}
/>
```

### Footer slot

```tsx
<Alert
  variant="solid"
  color="secondary"
  title="Alert Message!"
  slots={{
    footer: (
      <div className="mt-2 flex justify-between">
        <Button size="sm" color="secondary">
          Cancel
        </Button>

        <Button size="sm" color="secondary">
          Confirm
        </Button>
      </div>
    ),
  }}
/>
```

### customProps

```tsx
<Alert
  color="info"
  title="Forwarded part attributes"
  customProps={{
    title: { id: "alert-title" },
    icon: { "aria-hidden": true },
    body: { "aria-labelledby": "alert-title" },
    root: { id: "alert-root", role: "status" },
  }}
>
  Inspect the DOM for ids on each part.
</Alert>
```

## Props

| Prop          | Type                 | Default   | Description                                                                                                           |
| ------------- | -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `children`    | `ReactNode`          | —         | The children to render.                                                                                               |
| `classes`     | `AlertClasses`       | —         | The classes to apply to the alert.                                                                                    |
| `color`       | `AlertColor`         | "primary" | The color to apply to the alert.                                                                                      |
| `customProps` | `AlertCustomProps`   | —         | Extra props for internal parts (`icon`, `title`, `body`, etc.). Root HTML attributes stay on the component top level. |
| `icon`        | `LucideIcon \| null` | —         | The icon to apply to the alert. Use `null` to omit the prop icon.                                                     |
| `padding`     | `AlertPadding`       | "medium"  | The padding to apply to the alert.                                                                                    |
| `rounded`     | `AlertRounded`       | "sm"      | The roundedness of the alert.                                                                                         |
| `shadow`      | `AlertShadow`        | "sm"      | The shadow to apply to the alert.                                                                                     |
| `slots`       | `AlertSlots`         | —         | The slots to apply to the alert.                                                                                      |
| `title`       | `string`             | —         | The title to apply to the alert.                                                                                      |
| `variant`     | `AlertVariant`       | "flat"    | The variant of the alert.                                                                                             |

## Accessibility

For urgent dynamic messages use `role="alert"` and optionally `aria-live="assertive"`. For non-interrupting updates use `role="status"` and `aria-live="polite"`.

## Related components

Button, Icon, Snackbar
