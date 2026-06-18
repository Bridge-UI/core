# Avatar

Displays a user image, initials fallback, or icon.

## Import

```ts
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

| Prop       | Type            | Default   | Description                                              |
| ---------- | --------------- | --------- | -------------------------------------------------------- |
| `alt`      | `string`        | —         | The alt text for the avatar image.                       |
| `classes`  | `AvatarClasses` | —         | The classes to apply to the avatar.                      |
| `color`    | `AvatarColor`   | "primary" | The color to apply to the avatar fallback.               |
| `fallback` | `string`        | —         | The fallback text to display when no image is available. |
| `icon`     | `LucideIcon`    | —         | The icon to display as fallback.                         |
| `rounded`  | `AvatarRounded` | "full"    | The roundedness of the avatar.                           |
| `size`     | `AvatarSize`    | "md"      | The size of the avatar.                                  |
| `src`      | `string`        | —         | The source URL for the avatar image.                     |

## Related components

Badge
