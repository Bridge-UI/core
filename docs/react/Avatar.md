# Avatar

Displays a user image, initials fallback, or icon.

## Import

```tsx
import { Avatar } from "@bridge-ui/react/Components/Avatar";
```

## Examples

### Icon, Image and Fallback

```tsx
<Avatar icon={User} />
<Avatar fallback="JP" />
<Avatar src={avatarSrc} alt="Jane Doe" />
```

### Colors

```tsx
<Avatar fallback="P" color="primary" />

<Avatar fallback="S" color="secondary" />
```

### Sizes

```tsx
<Avatar size="2xs" fallback="2" />
<Avatar size="xs" fallback="3" />
<Avatar size="sm" fallback="5" />
<Avatar size="md" fallback="8" />
<Avatar size="lg" fallback="12" />
<Avatar size="xl" fallback="99" />
<Avatar size="2xl" fallback="99+" />
```

### Customization

```tsx
<Avatar fallback="JP" className="ring-primary-500 ring-2 ring-offset-2" />
```

```tsx
<Avatar
  fallback="JP"
  classes={{
    root: "ring-2 ring-info-500",
    fallback: "font-bold tracking-widest",
  }}
/>
```

### Fallback slot

```tsx
<Avatar
  slots={{
    fallback: <span className="text-xs font-semibold">Slot</span>,
  }}
/>
```

## Props

| Prop       | Type            | Default     | Description            |
| ---------- | --------------- | ----------- | ---------------------- |
| `alt`      | `string`        | —           | Image alt text         |
| `classes`  | `AvatarClasses` | —           | `root`, `fallback`     |
| `color`    | `Color`         | `"primary"` | Fallback background    |
| `fallback` | `string`        | —           | Initials when no image |
| `icon`     | `LucideIcon`    | —           | Icon when no image     |
| `rounded`  | `Rounded`       | `"full"`    | Border radius          |
| `size`     | `Size`          | `"md"`      | Avatar size            |
| `slots`    | `AvatarSlots`   | —           | `fallback`             |
| `src`      | `string`        | —           | Image URL              |

## Related components

Badge
