# Text

Body text with a semantic tone (`default` or `muted`), a color, a size, and a weight. Colors cover light and dark themes, so pages do not repeat `text-dark-* dark:text-dark-*` pairs.

## Import

```ts
import { Text } from "@bridge-ui/react/Components/Text";
```

## Examples

### Usage

```tsx
<Text>Monthly summary for your workspace.</Text>
```

### Muted

Use `variant="muted"` for subtitles, captions, and metadata.

```tsx
<Text size="xs" variant="muted">
  Compared to last month
</Text>
```

### Values

`numeric` aligns digits (tabular figures) for money and counts.

```tsx
<Text numeric size="2xl" weight="semibold">
  $9,300.00
</Text>
```

### Color

`color` works with both variants. `global.defaultColor` does not apply to `Text`; the default stays `dark`.

```tsx
<Text numeric color="success" weight="semibold">
  +$1,250.00
</Text>
<Text numeric color="error" weight="semibold">
  −$480.00
</Text>
<Text size="sm" color="error" variant="muted">
  Payment overdue
</Text>
```

### Label

```tsx
<Text uppercase size="xs" variant="muted" weight="medium">
  Balance
</Text>
```

### Element

`Text` renders a `p` by default. Use `as` for inline or list content.

```tsx
<Text as="span" size="sm" variant="muted">
  Updated 5 minutes ago
</Text>
```

### Truncate

```tsx
<Text truncate className="max-w-48">
  A very long account name that does not fit
</Text>
```

### Provider defaults and tokens

Change the muted tone for the whole app in one place with `tokens`, or set defaults with `defaultProps`.

```tsx
<BridgeUIProvider
  components={{
    Text: {
      defaultProps: { size: "sm" },
      tokens: {
        variant: {
          muted: { dark: "text-dark-600 dark:text-dark-300" },
        },
      },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

## Props

| Prop        | Type                                                                                                       | Default     | Description                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `as`        | `"p" \| "dd" \| "dt" \| "em" \| "li" \| "div" \| "span" \| "label" \| "small" \| "strong" \| "figcaption"` | `"p"`       | The element rendered as the root.                                          |
| `children`  | `ReactNode`                                                                                                | —           | The children to render.                                                    |
| `classes`   | `TextClasses`                                                                                              | —           | The classes to apply to the text.                                          |
| `color`     | `TextColor`                                                                                                | `"dark"`    | The color of the text. Ignores `global.defaultColor`.                      |
| `numeric`   | `boolean`                                                                                                  | `false`     | Whether digits use tabular figures and tight tracking (money, counts).     |
| `size`      | `TextSize`                                                                                                 | `"md"`      | The size of the text (`2xs` to `4xl`).                                     |
| `truncate`  | `boolean`                                                                                                  | `false`     | Whether the text is cut to one line with an ellipsis.                      |
| `uppercase` | `boolean`                                                                                                  | `false`     | Whether the text is uppercase with wide tracking (small labels).           |
| `variant`   | `TextVariant`                                                                                              | `"default"` | The tone of the text: `default` for main text, `muted` for secondary text. |
| `weight`    | `TextWeight`                                                                                               | `"normal"`  | The font weight of the text (`normal`, `medium`, `semibold`, `bold`).      |

## Related components

Heading, Card, Label
