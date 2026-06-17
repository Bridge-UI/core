# Button

Primary action control. Renders as `button`, `a`, or `span` via the `as` prop.

> Live examples: `testing-laravel` project → `resources/js/react/Pages/Button.tsx`

## Import

```tsx
import { Button } from "@bridge-ui/react/Components/Button";
```

## Examples

### Default

```tsx
<Button color="primary" variant="light" aria-label="primary">
  Click me
</Button>
```

### Mini

```tsx
<Button density="mini" color="primary" variant="light" aria-label="primary">
  Click me
</Button>
```

### Variants

```tsx
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="flat">Flat</Button>
<Button variant="light">Light</Button>
```

### Sizes

```tsx
<Button size="2xs">Size 2xs</Button>
<Button size="xs">Size xs</Button>
<Button size="sm">Size sm</Button>
<Button size="md">Size md</Button>
<Button size="lg">Size lg</Button>
<Button size="xl">Size xl</Button>
<Button size="2xl">Size 2xl</Button>
```

### States

```tsx
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Icons

```tsx
<Button startIcon={Plus}>Start icon</Button>
<Button endIcon={ArrowRight}>End icon</Button>
<Button startIcon={Plus} endIcon={ArrowRight}>
  Both icons
</Button>
```

### Full width

```tsx
<Button full>Full width button</Button>
```

### As link

```tsx
<Button as="a" href="https://example.com">
  External link
</Button>
```

### Custom classes

```tsx
<Button color="primary" className="tracking-widest uppercase shadow-lg">
  Styled root
</Button>
```

### Slots

```tsx
<Button
  slots={{
    end: <span className="text-xs opacity-80">▶</span>,
    start: <span className="text-xs opacity-80">◀</span>,
  }}
>
  With slots
</Button>
```

### customProps

```tsx
<Button
  icon={Plus}
  customProps={{
    startIcon: { "aria-hidden": true },
    root: { id: "add-btn", type: "button" },
  }}
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
