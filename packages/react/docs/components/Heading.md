# Heading

Section and page titles. `level` sets the element (`h1`–`h6`) and the default font size; `size` changes only the look.

## Import

```ts
import { Heading } from "@bridge-ui/react/Components/Heading";
```

## Examples

### Usage

```tsx
<Heading level={1}>Workspaces</Heading>
```

### Levels

Without `size`, each level has its own font size.

```tsx
<Heading level={1}>Level 1</Heading>
<Heading level={2}>Level 2</Heading>
<Heading level={3}>Level 3</Heading>
<Heading level={4}>Level 4</Heading>
<Heading level={5}>Level 5</Heading>
<Heading level={6}>Level 6</Heading>
```

### Size

Keep the right level for the page outline and set the look with `size`.

```tsx
<Heading size="lg" level={2}>
  Recent transactions
</Heading>
```

### Tone, color, and weight

`Heading` shares `variant`, `color`, and `weight` with `Text`. `global.defaultColor` does not apply; the default stays `dark`.

```tsx
<Heading level={3} variant="muted">
  Archived
</Heading>
<Heading level={3} weight="bold" color="primary">
  Highlights
</Heading>
```

### Provider tokens

`tokens.level` sets the font size per level.

```tsx
<BridgeUIProvider
  components={{
    Heading: {
      defaultProps: { weight: "bold" },
      tokens: { level: { "1": "text-4xl", "2": "text-3xl" } },
    },
  }}
>
  <App />
</BridgeUIProvider>
```

## Props

| Prop       | Type                         | Default      | Description                                                                                 |
| ---------- | ---------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `children` | `ReactNode`                  | —            | The children to render.                                                                     |
| `classes`  | `HeadingClasses`             | —            | The classes to apply to the heading.                                                        |
| `color`    | `TextColor`                  | `"dark"`     | The color of the heading. Ignores `global.defaultColor`.                                    |
| `level`    | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2`          | The heading level. Sets the element (`h1`–`h6`) and, when `size` is not set, the font size. |
| `size`     | `TextSize`                   | —            | The font size of the heading. When unset, it follows `level`.                               |
| `variant`  | `TextVariant`                | `"default"`  | The tone of the heading: `default` for main text, `muted` for secondary text.               |
| `weight`   | `TextWeight`                 | `"semibold"` | The font weight of the heading.                                                             |

## Related components

Text, Card, EmptyState
