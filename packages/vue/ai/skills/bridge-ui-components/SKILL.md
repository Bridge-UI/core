---
name: bridge-ui-components
description: >-
  Use Bridge UI Vue presentational components — Button, Avatar, Card, Alert,
  Badge, Icon, Link, List, Tabs, Spinner, Skeleton, Progress, classes,
  customProps, slots. Use when building UI outside forms and overlays.
---

# Bridge UI (Vue) — components

## Imports

```ts
import { Button } from "@bridge-ui/vue/Components/Button";
import { Card } from "@bridge-ui/vue/Components/Card";
```

Prefer `/Components/{Name}` as in the docs.

## Common tokens

- `color`, `size`, `variant`, `density` when available
- `:classes` — part → className
- `:custom-props` — part → element props
- Named slots — replace or extend parts

## Button

```vue
<Button color="primary">Save</Button>
<Button variant="outline" :start-icon="Plus">Add</Button>
<Button as="a" href="https://example.com">Docs</Button>
<Button loading disabled>Saving</Button>
```

`as`: `"button"` (default) | `"a"` | `"span"`.

## Card

Use for surfaces and as **Modal / Drawer content**:

```vue
<Card title="Title" :on-close="() => (open = false)">Body</Card>
```

## Avatar / Badge / Alert / Icon

```vue
<Avatar fallback="JD" />
<Badge color="primary">New</Badge>
<Alert color="success">Saved</Alert>
<Icon :icon="Settings" />
```

Semantic string icons require `global.icons` (see `bridge-ui-setup`).

## classes and customProps

```vue
<Button
  :classes="{ root: 'shadow-md' }"
  :custom-props="{
    root: { type: 'submit', id: 'save' },
    startIcon: { 'aria-hidden': true },
  }"
>
  Save
</Button>
```

Root HTML attributes on the component apply to the root; use `custom-props` for inner parts.

## Slots

```vue
<Button>
  <template #start><span class="text-xs">◀</span></template>
  Label
  <template #end><span class="text-xs">▶</span></template>
</Button>
```

## Layout / feedback

| Need | Component |
|------|-----------|
| Spinner / progress | `Spinner`, `Progress` |
| Placeholder | `Skeleton` |
| Lists | `List`, `ListItem`, `ListSection` |
| Tabs | `Tabs`, `TabList`, `Tab`, `TabPanel` |
