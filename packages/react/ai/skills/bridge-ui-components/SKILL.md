---
name: bridge-ui-components
description: >-
  Use Bridge UI React presentational components — Button, Avatar, Card, Alert,
  Badge, Icon, Link, List, Tabs, Spinner, Skeleton, Progress, classes,
  customProps, slots. Use when building UI outside forms and overlays.
---

# Bridge UI (React) — components

## Imports

```ts
import { Button } from "@bridge-ui/react/Components/Button";
import { Card } from "@bridge-ui/react/Components/Card";
```

Prefer `/Components/{Name}` as in the docs.

## Common tokens

- `color`, `size`, `variant`, `density` when available
- `classes` — part → className
- `customProps` — part → element props
- `slots` — replace or extend parts

## Button

```tsx
<Button color="primary">Save</Button>
<Button startIcon={Plus} variant="outline">Add</Button>
<Button as="a" href="https://example.com">Docs</Button>
<Button loading disabled>
  Saving
</Button>
```

`as`: `"button"` (default) | `"a"` | `"span"`.

## Card

Use for surfaces and as **Modal / Drawer content**:

```tsx
<Card title="Title" onClose={() => setOpen(false)}>
  Body
</Card>
```

## Avatar / Badge / Alert / Icon

```tsx
<Avatar fallback="JD" />
<Badge color="primary">New</Badge>
<Alert color="success">Saved</Alert>
<Icon icon={Settings} />
```

Semantic string icons require `global.icons` (see `bridge-ui-setup`).

## classes and customProps

```tsx
<Button
  classes={{ root: "shadow-md" }}
  customProps={{
    root: { type: "submit", id: "save" },
    startIcon: { "aria-hidden": true },
  }}
>
  Save
</Button>
```

Root HTML attributes on the component apply to the root; use `customProps` for inner parts.

## Slots

```tsx
<Button
  slots={{
    start: <span className="text-xs">◀</span>,
    end: <span className="text-xs">▶</span>,
  }}
>
  Label
</Button>
```

## Layout / feedback

| Need | Component |
|------|-----------|
| Spinner / progress | `Spinner`, `Progress` |
| Placeholder | `Skeleton` |
| Lists | `List`, `ListItem`, `ListSection` |
| Tabs | `Tabs`, `TabList`, `Tab`, `TabPanel` |
