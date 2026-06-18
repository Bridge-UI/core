# Button

Primary action control. Renders as `button`, `a`, or `span` via the `as` prop.

## Import

```ts
import { Button } from "@bridge-ui/vue/Components/Button";
```

## Examples

### Usage

```vue
<Button color="primary">Click me</Button>

<Button variant="outline" :start-icon="Plus">
  With icon
</Button>

<Button as="a" href="https://example.com">
  External link
</Button>
```

### Density

```vue
<Button density="mini" :icon="Settings" aria-label="Settings" />
```

### States

```vue
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
```

### Slots

```vue
<Button>
  <template #start>
    <span class="text-xs opacity-80">◀</span>
  </template>

  With slots

  <template #end>
    <span class="text-xs opacity-80">▶</span>
  </template>
</Button>
```

### customProps

```vue
<Button
  :icon="Plus"
  :custom-props="{
    startIcon: { 'aria-hidden': true },
    root: { id: 'add-btn', type: 'button' },
  }"
>
  Add item
</Button>
```

## Props

| Prop          | Type                        | Default   | Description                                                                                                                         |
| ------------- | --------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `as`          | `"a" \| "span" \| "button"` | "button"  | The element to render as.                                                                                                           |
| `classes`     | `ButtonClasses`             | —         | The classes to apply to the button.                                                                                                 |
| `color`       | `ButtonColor`               | "primary" | The color to apply to the button.                                                                                                   |
| `customProps` | `ButtonCustomProps`         | —         | Extra props for internal parts (`startIcon`, `endIcon`, slot wrappers, etc.). Root HTML attributes stay on the component top level. |
| `density`     | `ButtonDensity`             | "default" | The density of the button.                                                                                                          |
| `disabled`    | `boolean`                   | `false`   | Whether the button is disabled.                                                                                                     |
| `endIcon`     | `LucideIcon`                | —         | Icon at the **inline end** (physical right in `ltr`, physical left in `rtl`).                                                       |
| `full`        | `boolean`                   | `false`   | Whether the button is full width.                                                                                                   |
| `href`        | `string`                    | —         | The href to apply to the button.                                                                                                    |
| `icon`        | `LucideIcon`                | —         | Icon for mini density (replaces label and start/end icons).                                                                         |
| `loading`     | `boolean`                   | `false`   | Whether the button is loading.                                                                                                      |
| `rounded`     | `ButtonRounded`             | "md"      | The roundedness of the button.                                                                                                      |
| `size`        | `ButtonSize`                | "md"      | The size of the button.                                                                                                             |
| `startIcon`   | `LucideIcon`                | —         | Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`).                                                     |
| `text`        | `string`                    | —         | Label text when the default slot is not used.                                                                                       |
| `variant`     | `ButtonVariant`             | "solid"   | The variant of the button.                                                                                                          |

## Related components

Link, Icon
