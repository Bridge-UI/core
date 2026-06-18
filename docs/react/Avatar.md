# Avatar

Displays a user image, initials fallback, or icon.

## Import

```ts
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

| Prop       | Type            | Default   | Description                                              |
| ---------- | --------------- | --------- | -------------------------------------------------------- |
| `alt`      | `string`        | —         | The alt text for the avatar image.                       |
| `children` | `ReactNode`     | —         | The children to render.                                  |
| `classes`  | `AvatarClasses` | —         | The classes to apply to the avatar.                      |
| `color`    | `AvatarColor`   | "primary" | The color to apply to the avatar fallback.               |
| `fallback` | `string`        | —         | The fallback text to display when no image is available. |
| `icon`     | `LucideIcon`    | —         | The icon to display as fallback.                         |
| `rounded`  | `AvatarRounded` | "full"    | The roundedness of the avatar.                           |
| `size`     | `AvatarSize`    | "md"      | The size of the avatar.                                  |
| `slots`    | `AvatarSlots`   | —         | Named slots for avatar regions.                          |
| `src`      | `string`        | —         | The source URL for the avatar image.                     |

## Related components

Badge
