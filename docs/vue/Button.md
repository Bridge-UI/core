# Button

Primary action control. Renders as `button`, `a`, or `span` via the `as` prop.

> Live examples: `testing-laravel` project → `resources/js/vue/Pages/Button.vue`

## Import

```vue
import { Button } from "@bridge-ui/vue/Components/Button";
```

## Examples

### Default

```vue
<Button color="primary" variant="light" aria-label="primary">
  Click me
</Button>
```

### Mini

```vue
<Button density="mini" color="primary" variant="light" aria-label="primary">
  Click me
</Button>
```

### Variants

```vue
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="flat">Flat</Button>
<Button variant="light">Light</Button>
```

### Sizes

```vue
<Button size="2xs">Size 2xs</Button>
<Button size="xs">Size xs</Button>
<Button size="sm">Size sm</Button>
<Button size="md">Size md</Button>
<Button size="lg">Size lg</Button>
<Button size="xl">Size xl</Button>
<Button size="2xl">Size 2xl</Button>
```

### States

```vue
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Icons

```vue
<Button :start-icon="Plus">Start icon</Button>
<Button :end-icon="ArrowRight">End icon</Button>
<Button :start-icon="Plus" :end-icon="ArrowRight">
  Both icons
</Button>
```

### Full width

```vue
<Button full>Full width button</Button>
```

### As link

```vue
<Button as="a" href="https://example.com">
  External link
</Button>
```

### Custom classes

```vue
<Button color="primary" class="tracking-widest uppercase shadow-lg">
  Styled root
</Button>
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
