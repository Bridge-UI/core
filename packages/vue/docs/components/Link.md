# Link

Styled anchor for in-app and external navigation.

## Import

```ts
import { Link } from "@bridge-ui/vue/Components/Link";
```

## Examples

### Usage

```vue
<Link href="/dashboard">Dashboard</Link>

<Link color="primary" underline="hover" href="https://example.com">
  External link
</Link>

<Link href="#" :left-icon="Info">
  With icon
</Link>
```

### States

```vue
<Link disabled href="/button">
  Disabled
</Link>

<Link external href="https://example.com">
  External
</Link>
```

### Router link

`link-as` replaces the `<a>`. `href` is forwarded, and when `link-as` is set it also accepts that component's `href`. `link-props` is checked against `link-as` and forwarded to it (`method`, `replace`, `prefetch`, and so on). The component handles the click.

```vue
<Link
  href="/logout"
  :link-as="AppLink"
  :link-props="{ method: 'post', replace: true }"
>
  Logout
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

| Prop          | Type                  | Default   | Description                                                                                                                           |
| ------------- | --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `classes`     | `LinkClasses`         | —         | The classes to apply to the link.                                                                                                     |
| `color`       | `LinkColor`           | "primary" | The color to apply to the link.                                                                                                       |
| `customProps` | `LinkCustomProps`     | —         | Extra props for internal parts (`leftIcon`, `rightIcon`, etc.). Root HTML attributes stay on the component top level.                 |
| `disabled`    | `boolean`             | `false`   | Whether the link is disabled.                                                                                                         |
| `external`    | `boolean`             | `false`   | Whether the link opens in a new tab.                                                                                                  |
| `href`        | `string`              | —         | The URL the link points to. When `linkAs` is set, this also accepts that component's `href`.                                          |
| `leftIcon`    | `LucideIcon`          | —         | The icon to display before the link text.                                                                                             |
| `linkAs`      | `string \| Component` | —         | Component rendered in place of the navigating `<a>`. Receives `href`, `linkProps`, and the anchor attributes. Ignored while disabled. |
| `linkProps`   | props of `linkAs`     | —         | Props forwarded to `linkAs`. Checked against that component. Ignored while `linkAs` is not rendered.                                  |
| `rightIcon`   | `LucideIcon`          | —         | The icon to display after the link text.                                                                                              |
| `size`        | `LinkSize`            | "md"      | The size of the link.                                                                                                                 |
| `underline`   | `LinkUnderline`       | "hover"   | The underline behavior of the link.                                                                                                   |

## Related components

Button
