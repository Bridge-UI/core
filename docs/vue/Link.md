# Link

Styled anchor for in-app and external navigation.

## Import

```vue
import { Link } from "@bridge-ui/vue/Components/Link";
```

## Examples

### Usage

```vue
<Link href="/dashboard">Dashboard</Link>

<Link href="https://example.com" color="primary" underline="hover">
  External link
</Link>

<Link href="#" :left-icon="Info">
  With icon
</Link>
```

### States

```vue
<Link href="/button" disabled>
  Disabled
</Link>

<Link href="https://example.com" external>
  External
</Link>
```

### customProps

```vue
<Link
  href="#"
  :left-icon="ExternalLink"
  :custom-props="{
    leftIcon: { 'aria-hidden': true },
    root: { id: 'docs-link', target: '_blank', rel: 'noopener noreferrer' },
  }"
>
  Open documentation
</Link>
```

## Props

| Prop          | Type              | Default   | Description                                                                                                           |
| ------------- | ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `classes`     | `LinkClasses`     | —         | The classes to apply to the link.                                                                                     |
| `color`       | `LinkColor`       | "primary" | The color to apply to the link.                                                                                       |
| `customProps` | `LinkCustomProps` | —         | Extra props for internal parts (`leftIcon`, `rightIcon`, etc.). Root HTML attributes stay on the component top level. |
| `disabled`    | `boolean`         | `false`   | Whether the link is disabled.                                                                                         |
| `external`    | `boolean`         | `false`   | Whether the link opens in a new tab.                                                                                  |
| `href`        | `string`          | —         | The URL the link points to.                                                                                           |
| `leftIcon`    | `LucideIcon`      | —         | The icon to display before the link text.                                                                             |
| `rightIcon`   | `LucideIcon`      | —         | The icon to display after the link text.                                                                              |
| `size`        | `LinkSize`        | "md"      | The size of the link.                                                                                                 |
| `underline`   | `LinkUnderline`   | "hover"   | The underline behavior of the link.                                                                                   |

## Related components

Button
