# Alert

Alert banner for feedback messages. Does not set `role` or `aria-live` by default — pass them when the message is urgent or dynamic.

## Import

```vue
import { Alert } from "@bridge-ui/vue/Components/Alert";
```

## Examples

### Usage

```vue
<Alert color="primary" title="Heads up" />

<Alert color="error" title="Something went wrong">
  Please try again in a few minutes.
</Alert>

<Alert color="success" variant="outline" title="Saved">
  Your changes were saved successfully.
</Alert>
```

### Customization

```vue
<Alert
  rounded="2xl"
  variant="flat"
  color="primary"
  title="Alert Message!"
  :classes="{
    title: 'text-2xl italic font-extrabold',
  }"
/>

<Alert color="primary" title="Alert Message!">
  <template #action>
    <Button size="sm" color="primary" variant="flat">Dismiss</Button>
  </template>
</Alert>
```

### Footer slot

```vue
<Alert variant="solid" color="secondary" title="Alert Message!">
  <template #footer>
    <Button size="sm" color="secondary">Cancel</Button>

    <Button size="sm" color="secondary">Confirm</Button>
  </template>
</Alert>
```

### customProps

```vue
<Alert
  color="info"
  title="Forwarded part attributes"
  :custom-props="{
    title: { id: 'alert-title' },
    icon: { 'aria-hidden': true },
    body: { 'aria-labelledby': 'alert-title' },
    root: { id: 'alert-root', role: 'status' },
  }"
>
  Inspect the DOM for ids on each part.
</Alert>
```

## Props

| Prop          | Type                 | Default   | Description                                                                                                           |
| ------------- | -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `classes`     | `AlertClasses`       | —         | The classes to apply to the alert.                                                                                    |
| `color`       | `AlertColor`         | "primary" | The color to apply to the alert.                                                                                      |
| `customProps` | `AlertCustomProps`   | —         | Extra props for internal parts (`icon`, `title`, `body`, etc.). Root HTML attributes stay on the component top level. |
| `icon`        | `LucideIcon \| null` | —         | The icon to apply to the alert. Use `null` to omit the prop icon.                                                     |
| `padding`     | `AlertPadding`       | "medium"  | The padding to apply to the alert.                                                                                    |
| `rounded`     | `AlertRounded`       | "sm"      | The roundedness of the alert.                                                                                         |
| `shadow`      | `AlertShadow`        | "sm"      | The shadow to apply to the alert.                                                                                     |
| `title`       | `string`             | —         | The title to apply to the alert.                                                                                      |
| `variant`     | `AlertVariant`       | "flat"    | The variant of the alert.                                                                                             |

## Accessibility

For urgent dynamic messages use `role="alert"` and optionally `aria-live="assertive"`. For non-interrupting updates use `role="status"` and `aria-live="polite"`.

## Related components

Button, Icon, Snackbar
