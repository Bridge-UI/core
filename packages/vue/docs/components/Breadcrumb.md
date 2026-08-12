# Breadcrumb

Navigation trail for hierarchy (home → section → page). Compose with `BreadcrumbItem`, or pass `items` for a data-driven list. Supports icon-only crumbs and a custom separator icon.

## Import

```ts
import { Breadcrumb } from "@bridge-ui/vue/Components/Breadcrumb";
import { BreadcrumbItem } from "@bridge-ui/vue/Components/BreadcrumbItem";
```

## Examples

### Usage

```vue
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem current>Avatar</BreadcrumbItem>
</Breadcrumb>
```

### From items array

```vue
<Breadcrumb :items="crumbs" />
```

```ts
const crumbs = [
  { href: "/", label: "Home", startIcon: Home },
  { href: "/docs", label: "Docs" },
  { label: "Avatar", current: true },
];
```

### Icon only

```vue
<Breadcrumb>
  <BreadcrumbItem icon-only href="/" :start-icon="Home">
    Home
  </BreadcrumbItem>
  <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
  <BreadcrumbItem current>Project Nero</BreadcrumbItem>
</Breadcrumb>
```

### Custom separator

```vue
<Breadcrumb separator="chevronLeft">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Page</BreadcrumbItem>
</Breadcrumb>
```

```vue
<Breadcrumb>
  <template #separator>
    <span>/</span>
  </template>

  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem current>Page</BreadcrumbItem>
</Breadcrumb>
```

### Collapse middle crumbs

```vue
<Breadcrumb :max-items="3" :items="deepCrumbs" />
```
