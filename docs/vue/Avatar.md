# Avatar

Displays a user image, initials fallback, or icon.

## Import

```vue
import { Avatar } from "@bridge-ui/vue/Components/Avatar";
```

## Examples

### Icon, Image and Fallback

```vue
<Avatar :icon="User" />
<Avatar fallback="JP" />
<Avatar :src="avatarSrc" alt="Jane Doe" />
```

### Colors

```vue
<Avatar fallback="P" color="primary" />

<Avatar fallback="S" color="secondary" />
```

### Sizes

```vue
<Avatar size="2xs" fallback="2" />
<Avatar size="xs" fallback="3" />
<Avatar size="sm" fallback="5" />
<Avatar size="md" fallback="8" />
<Avatar size="lg" fallback="12" />
<Avatar size="xl" fallback="99" />
<Avatar size="2xl" fallback="99+" />
```

### Customization

```vue
<Avatar fallback="JP" class="ring-primary-500 ring-2 ring-offset-2" />
```

```vue
<Avatar
  fallback="JP"
  :classes="{
    root: "ring-2 ring-info-500",
    fallback: "font-bold tracking-widest",
  }
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
