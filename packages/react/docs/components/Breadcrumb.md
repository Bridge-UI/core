# Breadcrumb

Navigation trail for hierarchy (home → section → page). Compose with `BreadcrumbItem`, or pass `items` for a data-driven list. Supports icon crumbs and a custom separator icon.

## Import

```ts
import { Breadcrumb } from "@bridge-ui/react/Components/Breadcrumb";
import { BreadcrumbItem } from "@bridge-ui/react/Components/BreadcrumbItem";
```

## Examples

### Usage

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem current>Avatar</BreadcrumbItem>
</Breadcrumb>
```

### From items array

```tsx
<Breadcrumb
  items={[
    { href: "/", label: "Home", startIcon: Home },
    { href: "/docs", label: "Docs" },
    { label: "Avatar", current: true },
  ]}
/>
```

### Icon only

Omit the label and set `aria-label` for assistive tech.

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/" startIcon={Home} aria-label="Home" />
  <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
  <BreadcrumbItem current>Project Nero</BreadcrumbItem>
</Breadcrumb>
```

### Custom separator

```tsx
<Breadcrumb separator="chevronLeft">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Page</BreadcrumbItem>
</Breadcrumb>
```

```tsx
<Breadcrumb
  slots={{
    separator: <span>/</span>,
  }}
>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Page</BreadcrumbItem>
</Breadcrumb>
```

### Collapse middle crumbs

```tsx
<Breadcrumb
  maxItems={3}
  items={[
    { href: "/", label: "Home" },
    { href: "/a", label: "Section A" },
    { href: "/b", label: "Section B" },
    { href: "/c", label: "Section C" },
    { label: "Page", current: true },
  ]}
/>
```

### Router link

`linkAs` replaces navigating crumb anchors. It applies to `items` and to child crumbs that omit their own `linkAs`. The current crumb stays a non-link. `items[].linkProps` is checked against this `linkAs`. On a child `BreadcrumbItem`, set `linkAs` on that crumb for `linkProps` to be checked against it.

```tsx
<Breadcrumb linkAs={AppLink}>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Settings</BreadcrumbItem>
</Breadcrumb>

<Breadcrumb
  linkAs={AppLink}
  items={[{ href: "/", label: "Home", linkProps: { replace: true } }]}
/>
```
