# Avatar

Displays a user image, initials fallback, or icon.

## Import

```vue
import { Avatar } from "@bridge-ui/vue/Components/Avatar";
```

## Examples

### Usage

```vue
<Avatar fallback="JD" />

<Avatar :icon="User" color="primary" />

<Avatar :src="avatarSrc" alt="Jane Doe" />
```

### Classes

```vue
<Avatar
  fallback="JP"
  :classes="{
    root: 'ring-2 ring-info-500',
    fallback: 'font-bold tracking-widest',
  }"
/>
```

### Fallback slot

```vue
<Avatar>
  <template #fallback>
    <span class="text-xs font-semibold">Slot</span>
  </template>
</Avatar>
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
