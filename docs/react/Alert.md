# Alert

Alert banner for feedback messages. Does not set `role` or `aria-live` by default — pass them when the message is urgent or dynamic.

## Import

```tsx
import { Alert } from "@bridge-ui/react/Components/Alert";
```

## Examples

### Colors & variants

```tsx
<Alert color="primary" title="Alert Message!" />

<Alert color="error" title="Alert Message!">
  This is a description of the alert message.
</Alert>

<Alert color="warning" variant="flat" title="Alert Message!">
  This is a description of the alert message.
</Alert>

<Alert color="success" variant="outline" title="Alert Message!">
  This is a description of the alert message.
</Alert>

<Alert
  color="info"
  rounded="2xl"
  variant="solid"
  title="Alert Message!"
>
  This is a description of the alert message.
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
  color="dark"
  shadow="2xl"
  rounded="2xl"
  padding="large"
  title="Alert Message!"
>
  This is a description of the alert message.
</Alert>

<Alert
  color="dark"
  variant="outline"
  title="Alert Message!"
  slots={{
    icon: <Icon size="md" icon={InfoIcon} />,
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

| Prop          | Type                             | Default     | Description                                   |
| ------------- | -------------------------------- | ----------- | --------------------------------------------- |
| `children`    | `ReactNode`                      | —           | Alert body content                            |
| `classes`     | `AlertClasses`                   | —           | Per-part classes                              |
| `color`       | `Color`                          | `"primary"` | Color preset                                  |
| `customProps` | `AlertCustomProps`               | —           | Props for `root`, `title`, `body`, `icon`     |
| `icon`        | `LucideIcon \| null`             | —           | Lucide icon component                         |
| `padding`     | `Padding`                        | `"medium"`  | Inner padding                                 |
| `rounded`     | `Rounded`                        | `"sm"`      | Border radius                                 |
| `shadow`      | `Shadow`                         | `"sm"`      | Box shadow                                    |
| `slots`       | `AlertSlots`                     | —           | `icon`, `title`, `action`, `footer`, `header` |
| `title`       | `string`                         | —           | Alert title                                   |
| `variant`     | `"flat" \| "outline" \| "solid"` | `"flat"`    | Visual variant                                |

## Accessibility

For urgent dynamic messages use `role="alert"` and optionally `aria-live="assertive"`. For non-interrupting updates use `role="status"` and `aria-live="polite"`.

## Related components

Button, Icon, Snackbar
