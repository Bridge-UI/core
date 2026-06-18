# Card

Surface container with optional title, action, and footer.

## Import

```tsx
import { Card } from "@bridge-ui/react/Components/Card";
```

## Examples

### Usage

```tsx
<Card title="Card title">
  Card body content goes here.
</Card>

<Card variant="outlined" title="Outlined card">
  Outlined surface with a visible border.
</Card>

<Card
  title="Confirm changes"
  slots={{
    footer: (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="flat">
          Cancel
        </Button>

        <Button size="sm">Save</Button>
      </div>
    ),
  }}
>
  Review your changes before saving.
</Card>
```

### Borderless

```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <Card
    title="With dividers (default)"
    slots={{
      footer: (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="flat">
            Cancel
          </Button>

          <Button size="sm">Save</Button>
        </div>
      ),
    }}
  >
    Default card with header and footer dividers.
  </Card>

  <Card
    borderless
    title="Borderless"
    slots={{
      footer: (
        <Button size="sm" variant="flat">
            Cancel
          </Button>

          <Button size="sm">Save</Button>
      ),
    }}
  >
    Header and footer borders are removed.
  </Card>
</div>
```

### Title

```tsx
<Card title="Via title prop">
  Content rendered via the title prop.
</Card>

<Card
  slots={{
    title: <span className="text-primary-600">Custom title slot</span>,
  }}
>
  Content with a custom title slot.
</Card>
```

### Action slot

```tsx
<Card
  title="Card with actions"
  slots={{
    action: (
      <Button size="sm" variant="flat" density="mini" aria-label="More options">
        <MoreHorizontal className="size-4" />
      </Button>
    ),
  }}
>
  Use the action slot for header controls.
</Card>
```

### Footer slot

```tsx
<Card
  title="Confirm changes"
  slots={{
    footer: (
      <Button size="sm" variant="flat">
          Cancel
        </Button>

        <Button size="sm" color="primary">
          Confirm
        </Button>
    ),
  }}
>
  Are you sure you want to proceed?
</Card>
```

### Custom header slot

```tsx
<Card
  slots={{
    header: (
      <div className="border-secondary-200 bg-primary-50 dark:border-secondary-600 dark:bg-primary-950/30 flex items-center gap-3 border-b px-4 py-3">
        <div className="bg-primary-500 flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white">
          JD
        </div>
        <div>
          <p className="font-medium">Jane Doe</p>
          <p className="text-secondary-500 text-sm">Custom header area</p>
        </div>
      </div>
    ),
  }}
>
  Replaces the default title row entirely.
</Card>
```

### Full composition

```tsx
<Card
  shadow="lg"
  rounded="2xl"
  title="Project settings"
  slots={{
    action: (
      <Button size="sm" variant="outline">
        Edit
      </Button>
    ),
    footer: (
      <Button size="sm" variant="flat" color="error">
          Delete
        </Button>

        <Button size="sm" color="primary">
          Save changes
        </Button>
    ),
  }}
>
  Title, action, body, and footer together with elevated styling.
</Card>
```

### Partial layouts

```tsx
<Card title="Title only (no body children)" />

<Card>Card with body content only.</Card>

<Card
  slots={{
    footer: <p className="text-secondary-500 text-sm">Footer only</p>,
  }}
/>
```

### Classes

```tsx
<Card
  title="Styled parts"
  classes={{
    footer: "bg-secondary-50",
    body: "text-secondary-600",
    root: "ring-2 ring-primary-200",
    title: "text-xl font-bold tracking-tight",
    header: "bg-primary-50 dark:bg-primary-950/20",
  }}
  slots={{
    footer: <span className="text-sm">Custom footer classes</span>,
  }}
>
  Body text with custom classes applied.
</Card>
```

### customProps

```tsx
<Card
  title="Forwarded part attributes"
  customProps={{
    root: { id: "card-root" },
    footer: { id: "card-footer" },
    title: { id: "card-demo-title" },
    header: { "aria-label": "Card header" },
    body: { role: "region", "aria-labelledby": "card-demo-title" },
  }}
  slots={{
    footer: <span>Inspect DOM for data attributes on each part.</span>,
  }}
>
  Card body with forwarded attributes on each part.
</Card>
```

### Root HTML attributes

```tsx
<Card
  id="demo-card"
  role="article"
  title="Root attrs"
  className="max-w-md"
  aria-label="Demo card"
>
  className and other root HTML props are merged onto the root element.
</Card>
```

### Combined

```tsx
<Card
  borderless
  shadow="xl"
  rounded="2xl"
  padding="large"
  variant="tonal"
  title="Tonal card"
  classes={{
    body: "leading-relaxed",
  }}
  slots={{
    action: (
      <Button size="sm" variant="flat">
        Options
      </Button>
    ),
    footer: (
      <Button size="sm" full>
        Continue
      </Button>
    ),
  }}
>
  Large padding, 2xl rounded, xl shadow (elevated only — here variant is tonal
  so shadow is ignored), borderless, and custom body classes.
</Card>
```

## Props

| Prop          | Type              | Default    | Description                                                                                                                       |
| ------------- | ----------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `borderless`  | `boolean`         | `false`    | Removes header and footer borders.                                                                                                |
| `children`    | `ReactNode`       | —          | The children to render.                                                                                                           |
| `classes`     | `CardClasses`     | —          | The classes to apply to the card.                                                                                                 |
| `customProps` | `CardCustomProps` | —          | Extra props for internal parts (`header`, `title`, `body`, `footer`, etc.). Root HTML attributes stay on the component top level. |
| `padding`     | `CardPadding`     | "medium"   | Padding for header, body, and footer (horizontal alignment is shared).                                                            |
| `rounded`     | `CardRounded`     | "sm"       | The roundedness of the card.                                                                                                      |
| `shadow`      | `CardShadow`      | "sm"       | Shadow size. Only applied when `variant` is `elevated`.                                                                           |
| `slots`       | `CardSlots`       | —          | The slots to apply to the card.                                                                                                   |
| `title`       | `string`          | —          | The title to apply to the card.                                                                                                   |
| `variant`     | `CardVariant`     | "elevated" | Visual style of the card.                                                                                                         |

## Related components

Modal, List
