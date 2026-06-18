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

| Prop           | Type                      | Default         | Description                                                                    |
| -------------- | ------------------------- | --------------- | ------------------------------------------------------------------------------ |
| `classes`      | `SnackbarClasses`         | —               | The classes to apply to the snackbar.                                          |
| `closeButton`  | `boolean`                 | `true`          | Whether to show the close button.                                              |
| `color`        | `SnackbarColor`           | "primary"       | Tint color for the default icon.                                               |
| `customProps`  | `SnackbarCustomProps`     | —               | Extra props for internal parts (`icon`, `title`, `description`, etc.).         |
| `description`  | `string`                  | —               | Body text below the title.                                                     |
| `duration`     | `number \| false`         | 5000            | Auto-dismiss delay in ms. `false` disables the timer.                          |
| `icon`         | `LucideIcon \| null`      | —               | The icon to display. Use `null` to hide the icon.                              |
| `img`          | `string`                  | —               | Avatar image URL (shown instead of icon when set).                             |
| `onShowChange` | `(show: boolean) => void` | —               | Called when `v-model` visibility should change (controlled state).             |
| `padding`      | `SnackbarPadding`         | "medium"        | Padding for the content area.                                                  |
| `position`     | `SnackbarPosition`        | "bottom-center" | Viewport anchor when portaled (standalone). Ignored when `teleportTo={false}`. |
| `progressbar`  | `boolean`                 | `true`          | Whether to show the countdown progress bar when `duration` is set.             |
| `stackId`      | `string`                  | —               | Pre-assigned stack id (BridgeSnackbarHost).                                    |
| `teleportTo`   | `string \| false`         | "body"          | Portal target. `false` renders inline without layer stack.                     |
| `title`        | `string`                  | —               | Headline text.                                                                 |
| `transition`   | `SnackbarTransition`      | "slide"         | Enter/leave animation preset.                                                  |

### v-model

| Prop / Event        | Type                       | Default | Description                                                                  |
| ------------------- | -------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `boolean`                  | `false` | Whether the snackbar is visible. Bound with `v-model`.                       |
| `update:modelValue` | `(value: boolean) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Events

| Event        | Payload | Description                                  |
| ------------ | ------- | -------------------------------------------- |
| `v-on:close` | —       | Emitted when the snackbar requests to close. |

## Related components

SnackbarAction, Alert, Button
