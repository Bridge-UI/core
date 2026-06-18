# Avatar

Displays a user image, initials fallback, or icon.

## Import

```tsx
import { Avatar } from "@bridge-ui/react/Components/Avatar";
```

## Examples

### Usage

```tsx
<Avatar fallback="JD" />

<Avatar icon={User} color="primary" />

<Avatar src="/avatar.jpg" alt="Jane Doe" />
```

### Classes

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
