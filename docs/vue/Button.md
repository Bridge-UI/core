# Button

Primary action control. Renders as `button`, `a`, or `span` via the `as` prop.

## Import

```vue
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

| Prop                    | Type                        | Default     | Description         |
| ----------------------- | --------------------------- | ----------- | ------------------- |
| `as`                    | `"button" \| "a" \| "span"` | `"button"`  | Root element        |
| `color`                 | `Color`                     | `"primary"` | Color preset        |
| `customProps`           | `ButtonCustomProps`         | —           | Per-part props      |
| `density`               | `"default" \| "mini"`       | `"default"` | Icon-only compact   |
| `disabled`              | `boolean`                   | `false`     | Disabled            |
| `full`                  | `boolean`                   | `false`     | Full width          |
| `href`                  | `string`                    | —           | When `as="a"`       |
| `icon`                  | `LucideIcon`                | —           | Icon (mini density) |
| `loading`               | `boolean`                   | `false`     | Loading spinner     |
| `rounded`               | `Rounded`                   | `"md"`      | Border radius       |
| `size`                  | `Size`                      | `"md"`      | Button size         |
| `slots`                 | `ButtonSlots`               | —           | `start`, `end`      |
| `startIcon` / `endIcon` | `LucideIcon`                | —           | Row icons           |
| `variant`               | `Variant`                   | `"solid"`   | Visual variant      |

## Related components

Link, Icon
