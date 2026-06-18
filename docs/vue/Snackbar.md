# Snackbar

Toast notification portaled to the viewport. Sets `role="status"` and `aria-live="polite"` by default.

## Import

```vue
import { Snackbar } from "@bridge-ui/vue/Components/Snackbar";
```

## Examples

### Usage

```vue
<Button @click="open = true">Show snackbar</Button>

<Snackbar
  v-model="open"
  title="Saved"
  description="Your changes were saved successfully."
/>
```

### Duration and progressbar

```vue
<Snackbar v-model="open" title="Auto dismiss" :duration="3000" progressbar />
```

### Slots

```vue
<Snackbar v-model="open">
  <template #icon>
    <Icon size="md" :icon="Info" />
  </template>

  <template #actions>
    <Button size="sm" variant="flat" @click="open = false">Undo</Button>
  </template>

  Custom children below the description.
</Snackbar>
```

### customProps

```vue
<Snackbar
  v-model="open"
  title="customProps"
  :custom-props="{
    root: { id: 'snackbar-root' },
    title: { id: 'snackbar-title' },
  }"
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
| `modelValue`  | `boolean`            | `false`           | Visible state     |
| `position`    | `SnackbarPosition`   | `"bottom-center"` | Viewport position |
| `progressbar` | `boolean`            | `true`            | Countdown bar     |
| `teleportTo`  | `string \| false`    | `"body"`          | Portal target     |
| `title`       | `string`             | —                 | Toast title       |
| `transition`  | `SnackbarTransition` | `"slide"`         | Animation         |

## Related components

SnackbarAction, Alert, Button
