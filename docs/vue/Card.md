# Card

Surface container with optional title, action, and footer.

## Import

```ts
import { Card } from "@bridge-ui/vue/Components/Card";
```

## Examples

### Usage

```vue
<Card title="Card title">
  Card body content goes here.
</Card>

<Card title="Outlined card" variant="outlined">
  Outlined surface with a visible border.
</Card>

<Card title="Confirm changes">
  Review your changes before saving.

  <template #footer>
    <div class="flex justify-end gap-2">
      <Button size="sm" variant="flat">Cancel</Button>

      <Button size="sm">Save</Button>
    </div>
  </template>
</Card>
```

### Borderless

```vue
<div class="grid gap-4 sm:grid-cols-2">
  <Card title="With dividers (default)">
    Default card with header and footer dividers.

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button size="sm" variant="flat">Cancel</Button>

        <Button size="sm">Save</Button>
      </div>
    </template>
  </Card>

  <Card borderless title="Borderless">
    Header and footer borders are removed.

    <template #footer>
      <Button size="sm" variant="flat">Cancel</Button>

        <Button size="sm">Save</Button>
    </template>
  </Card>
</div>
```

### Title

```vue
<Card title="Via title prop">
  Content rendered via the title prop.
</Card>

<Card>
  <template #title>
    <span class="text-primary-600">Custom title slot</span>
  </template>

  Content with a custom title slot.
</Card>
```

### Action slot

```vue
<Card title="Card with actions">
  <template #action>
    <Button
        size="sm"
        variant="flat"
        density="mini"
        aria-label="More options"
      >
        <MoreHorizontal class="size-4" />
      </Button>
  </template>

  Use the action slot for header controls.
</Card>
```

### Footer slot

```vue
<Card title="Confirm changes">
  Are you sure you want to proceed?

  <template #footer>
    <Button size="sm" variant="flat">Cancel</Button>

      <Button size="sm" color="primary">Confirm</Button>
  </template>
</Card>
```

### Custom header slot

```vue
<Card>
  <template #header>
    <div
      class="border-secondary-200 bg-primary-50 dark:border-secondary-600 dark:bg-primary-950/30 flex items-center gap-3 border-b px-4 py-3"
    >
      <div
        class="bg-primary-500 flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white"
      >
        JD
      </div>
      <div>
        <p class="font-medium">Jane Doe</p>
        <p class="text-secondary-500 text-sm">Custom header area</p>
      </div>
    </div>
  </template>

  Replaces the default title row entirely.
</Card>
```

### Full composition

```vue
<Card rounded="2xl" shadow="lg" title="Project settings">
  <template #action>
    <Button size="sm" variant="outline">Edit</Button>
  </template>

  Title, action, body, and footer together with elevated styling.

  <template #footer>
    <Button size="sm" variant="flat" color="error">Delete</Button>

      <Button size="sm" color="primary">Save changes</Button>
  </template>
</Card>
```

### Partial layouts

```vue
<Card title="Title only (no body children)" />

<Card>Card with body content only.</Card>

<Card>
  <template #footer>
    <p class="text-secondary-500 text-sm">Footer only</p>
  </template>
</Card>
```

### Classes

```vue
<Card
  title="Styled parts"
  :classes="{
    footer: 'bg-secondary-50',
    body: 'text-secondary-600',
    root: 'ring-2 ring-primary-200',
    title: 'text-xl font-bold tracking-tight',
    header: 'bg-primary-50 dark:bg-primary-950/20',
  }"
>
  Body text with custom classes applied.

  <template #footer>
    <span class="text-sm">Custom footer classes</span>
  </template>
</Card>
```

### customProps

```vue
<Card
  title="Forwarded part attributes"
  :custom-props="{
    title: { id: 'card-demo-title' },
    root: { 'data-testid': 'card-root' },
    header: { 'aria-label': 'Card header' },
    footer: { 'data-testid': 'card-footer' },
    body: { role: 'region', 'aria-labelledby': 'card-demo-title' },
  }"
>
  Card body with forwarded attributes on each part.

  <template #footer>
    <span>Inspect DOM for data attributes on each part.</span>
  </template>
</Card>
```

### Root HTML attributes

```vue
<Card
  id="demo-card"
  role="article"
  class="max-w-md"
  title="Root attrs"
  aria-label="Demo card"
>
  class and other root HTML props are merged onto the root element.
</Card>
```

### Combined

```vue
<Card
  borderless
  shadow="xl"
  rounded="2xl"
  padding="large"
  variant="tonal"
  title="Tonal card"
  :classes="{ body: 'leading-relaxed' }"
>
  Large padding, 2xl rounded, xl shadow (elevated only — here variant is
  tonal so shadow is ignored), borderless, and custom body classes.

  <template #action>
    <Button size="sm" variant="flat">Options</Button>
  </template>

  <template #footer>
    <Button size="sm" full>Continue</Button>
  </template>
</Card>
```

### customProps

```vue
<Card
  title="Forwarded part attributes"
  :custom-props="{
    title: { id: 'card-demo-title' },
    root: { 'data-testid': 'card-root' },
    header: { 'aria-label': 'Card header' },
    footer: { 'data-testid': 'card-footer' },
    body: { role: 'region', 'aria-labelledby': 'card-demo-title' },
  }"
>
  Card body with forwarded attributes on each part.

  <template #footer>
    <span>Inspect DOM for data attributes on each part.</span>
  </template>
</Card>
```

## Props

| Prop          | Type              | Default    | Description                                                                                                                       |
| ------------- | ----------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `borderless`  | `boolean`         | `false`    | Removes header and footer borders.                                                                                                |
| `classes`     | `CardClasses`     | —          | The classes to apply to the card.                                                                                                 |
| `customProps` | `CardCustomProps` | —          | Extra props for internal parts (`header`, `title`, `body`, `footer`, etc.). Root HTML attributes stay on the component top level. |
| `padding`     | `CardPadding`     | "medium"   | Padding for header, body, and footer (horizontal alignment is shared).                                                            |
| `rounded`     | `CardRounded`     | "sm"       | The roundedness of the card.                                                                                                      |
| `shadow`      | `CardShadow`      | "sm"       | Shadow size. Only applied when `variant` is `elevated`.                                                                           |
| `title`       | `string`          | —          | The title to apply to the card.                                                                                                   |
| `variant`     | `CardVariant`     | "elevated" | Visual style of the card.                                                                                                         |

## Related components

Modal, List
