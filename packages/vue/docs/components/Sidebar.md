# Sidebar

Persistent app-shell rail. Mount `SidebarProvider` around `Sidebar` and `SidebarInset` as siblings. Put `List` / `Accordion` in the default slot. On small viewports the panel opens as a `Drawer`.

## Import

```ts
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@bridge-ui/vue/Components/Sidebar";
```

## Prerequisites

Mount `SidebarProvider` around the app shell (`Sidebar` and `SidebarInset` as siblings) before using `SidebarTrigger` or `useSidebar`.

`BridgeUIProvider` still holds theme, tokens, and `defaultProps`. It does not own instance `open` state.

## Examples

### Usage

```vue
<SidebarProvider>
  <Sidebar>
    <List>
      <ListItem interactive primary="Home" />
      <ListItem interactive primary="Settings" />
    </List>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Header and footer

```vue
<SidebarProvider>
  <Sidebar>
    <template #header>
      <div>Acme</div>
    </template>
    <List>
      <ListItem interactive primary="Home" />
    </List>
    <template #footer>
      <ListItem interactive primary="Account" />
    </template>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Icon collapse

Bind `List` `icon-only` from `useSidebar` when `collapsible="icon"`. Wrap items in `Tooltip` if you want a label while collapsed. `useSidebar` must run under `SidebarProvider`.

```vue
<script setup>
const sidebar = useSidebar();
</script>

<template>
  <List :icon-only="sidebar.state === 'collapsed'">
    <ListSection title="Application" />
    <ListItem interactive primary="Home">
      <template #start>
        <Icon icon="user" />
      </template>
    </ListItem>
  </List>
</template>
```

```vue
<SidebarProvider>
  <Sidebar collapsible="icon">
    <Nav />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Controlled

```vue
<SidebarProvider v-model="open">
  <Sidebar>
    <List>
      <ListItem interactive primary="Home" />
    </List>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Right side

```vue
<SidebarProvider>
  <Sidebar side="right">
    <List>
      <ListItem interactive primary="Inbox" />
    </List>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Inset variant

```vue
<SidebarProvider>
  <Sidebar variant="inset">
    <List>
      <ListItem interactive primary="Home" />
    </List>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Collapsible groups

```vue
<SidebarProvider>
  <Sidebar>
    <Accordion>
      <AccordionItem title="Projects" value="projects">
        <List>
          <ListItem interactive primary="Alpha" />
          <ListItem interactive primary="Beta" />
        </List>
      </AccordionItem>
    </Accordion>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

## Props (`SidebarProvider`)

| Prop          | Type                         | Default | Description                                  |
| ------------- | ---------------------------- | ------- | -------------------------------------------- |
| `classes`     | `SidebarProviderClasses`     | —       | Part classes (`root`).                       |
| `customProps` | `SidebarProviderCustomProps` | —       | Extra props for the layout wrapper.          |
| `defaultOpen` | `boolean`                    | `true`  | Uncontrolled initial desktop expanded state. |
| `v-model`     | `boolean`                    | —       | Controlled desktop expanded state.           |

## Props (`Sidebar`)

| Prop          | Type                              | Default       | Description                                            |
| ------------- | --------------------------------- | ------------- | ------------------------------------------------------ |
| `ariaLabel`   | `string`                          | `"Sidebar"`   | Accessible name for the `aside` and the mobile drawer. |
| `classes`     | `SidebarClasses`                  | —             | Part classes (`root`, `header`, `content`, …).         |
| `collapsible` | `"icon" \| "none" \| "offcanvas"` | `"offcanvas"` | How the desktop rail hides.                            |
| `customProps` | `SidebarCustomProps`              | —             | Extra props for internal parts.                        |
| `side`        | `"left" \| "right"`               | `"left"`      | Edge the rail docks to.                                |
| `variant`     | `"inset" \| "sidebar"`            | `"sidebar"`   | Flush rail or padded main column.                      |

## Slots (`Sidebar`)

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `default` | Rail content (`List` / `Accordion`).   |
| `footer`  | Sticky footer.                         |
| `header`  | Sticky header.                         |

## Props (`SidebarInset`)

| Prop          | Type                      | Default | Description                     |
| ------------- | ------------------------- | ------- | ------------------------------- |
| `classes`     | `SidebarInsetClasses`     | —       | Part classes (`root`).          |
| `customProps` | `SidebarInsetCustomProps` | —       | Extra props for the inset root. |

## Props (`SidebarTrigger`)

Renders a `Button`. Forwards native button attributes. Default accessible name is `Toggle sidebar`.

## `useSidebar`

Must be called under `SidebarProvider`. Returns a computed context object (`sidebar.value.open`, …).

| Field           | Type                              | Description                                    |
| --------------- | --------------------------------- | ---------------------------------------------- |
| `collapsible`   | `"icon" \| "none" \| "offcanvas"` | Mode from the nearest `Sidebar`.               |
| `isMobile`      | `boolean`                         | Viewport is below the mobile breakpoint.       |
| `open`          | `boolean`                         | Desktop expanded state.                        |
| `openMobile`    | `boolean`                         | Mobile drawer visibility.                      |
| `setOpen`       | `(open: boolean) => void`         | Sets desktop `open`.                           |
| `setOpenMobile` | `(open: boolean) => void`         | Sets mobile drawer visibility.                 |
| `side`          | `"left" \| "right"`               | Dock edge.                                     |
| `state`         | `"collapsed" \| "expanded"`       | Desktop visual state.                          |
| `toggleSidebar` | `() => void`                      | Toggles desktop `open` or mobile `openMobile`. |
| `variant`       | `"inset" \| "sidebar"`            | Visual variant.                                |

## Accessibility

- Desktop panel is an `aside` with `aria-label`
- Mobile uses `Drawer` (dialog, overlay, Escape)
- Trigger sets `aria-expanded` and `aria-controls`
- `List` `icon-only` copies string `primary` to `aria-label`

## Related components

Accordion, Button, Drawer, List, ListItem, ListSection, Tooltip
