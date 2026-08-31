# Sidebar

Persistent app-shell rail. Mount `SidebarProvider` around `Sidebar` and `SidebarInset` as siblings. Put `SidebarList` / `Accordion` in the default slot. On small viewports the panel opens as a `Drawer`.

## Import

```ts
import {
  Sidebar,
  SidebarInset,
  SidebarList,
  SidebarListItem,
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
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
      <SidebarListItem interactive primary="Settings" />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Header and footer

Put brand and account rows in `#header` / `#footer`. `SidebarList` collapses those rows to the start avatar. The end chevron hides while collapsed. Header and footer lists use `classes.root` `p-0` because those slots are already padded.

```vue
<template>
  <SidebarList :classes="{ root: 'p-0' }">
    <SidebarListItem interactive primary="Acme Inc" secondary="Enterprise">
      <template #end>
        <Icon icon="chevronUpDown" />
      </template>
      <template #start>
        <Avatar size="sm" rounded="lg" fallback="A" color="primary" />
      </template>
    </SidebarListItem>
  </SidebarList>
</template>
```

```vue
<template>
  <SidebarList :classes="{ root: 'p-0' }">
    <SidebarListItem
      interactive
      primary="Ada Lovelace"
      secondary="ada@example.com"
    >
      <template #end>
        <Icon icon="chevronUpDown" />
      </template>
      <template #start>
        <Avatar size="sm" rounded="lg" fallback="AL" />
      </template>
    </SidebarListItem>
  </SidebarList>
</template>
```

```vue
<SidebarProvider>
  <Sidebar collapsible="icon">
    <template #header>
      <Brand />
    </template>
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
    </SidebarList>
    <template #footer>
      <Account />
    </template>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <slot />
  </SidebarInset>
</SidebarProvider>
```

### Icon collapse

Use `SidebarList` / `SidebarListItem` when `collapsible="icon"`. Collapsed items keep `primary` as an `aria-label` and show it in a `Tooltip` on the whole item. Nested `SidebarList` is hidden. The mobile drawer keeps labels.

```vue
<template>
  <SidebarList>
    <ListSection title="Application" />
    <SidebarListItem interactive primary="Home">
      <template #start>
        <Icon icon="user" />
      </template>
    </SidebarListItem>
  </SidebarList>
</template>
```

```vue
<SidebarProvider>
  <Sidebar collapsible="icon">
    <template #header>
      <Brand />
    </template>
    <Nav />
    <template #footer>
      <Account />
    </template>
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
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
    </SidebarList>
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
    <SidebarList>
      <SidebarListItem interactive primary="Inbox" />
    </SidebarList>
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
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
    </SidebarList>
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
    <Accordion variant="plain">
      <AccordionItem title="Projects" value="projects">
        <SidebarList :classes="{ root: 'p-0' }">
          <SidebarListItem interactive primary="Alpha" />
          <SidebarListItem interactive primary="Beta" />
        </SidebarList>
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

| Prop               | Type                         | Default | Description                                  |
| ------------------ | ---------------------------- | ------- | -------------------------------------------- |
| `classes`          | `SidebarProviderClasses`     | —       | Part classes (`root`).                       |
| `customProps`      | `SidebarProviderCustomProps` | —       | Extra props for the layout wrapper.          |
| `defaultOpen`      | `boolean`                    | `true`  | Uncontrolled initial desktop expanded state. |
| `v-model`          | `boolean`                    | —       | Controlled desktop expanded state.           |
| `v-on:open-change` | `(open: boolean)`            | —       | Emitted when desktop `open` should change.   |

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

| Slot      | Description                                 |
| --------- | ------------------------------------------- |
| `default` | Rail content (`SidebarList` / `Accordion`). |
| `footer`  | Sticky footer.                              |
| `header`  | Sticky header.                              |

## Props (`SidebarInset`)

| Prop          | Type                      | Default | Description                     |
| ------------- | ------------------------- | ------- | ------------------------------- |
| `classes`     | `SidebarInsetClasses`     | —       | Part classes (`root`).          |
| `customProps` | `SidebarInsetCustomProps` | —       | Extra props for the inset root. |

## Props (`SidebarTrigger`)

Renders a `Button`. Forwards native button attributes. Default accessible name is `Toggle sidebar`.

## Props (`SidebarList`)

Same as `List`, plus `icon-only`. Sets `icon-only` when the icon rail is collapsed on desktop. Applies stacked nav chrome (gap, compact rows, nested guide). Override with `icon-only`. Nested `SidebarList` is hidden while collapsed. `ListSection` labels are hidden while collapsed.

## Props (`SidebarListItem`)

Same as `ListItem`, plus `tooltip` / `tooltip-placement`. Applies compact nav chrome. When the icon rail is collapsed, string `primary` is shown in a tooltip on the whole row.

## `useSidebar`

Must be called under `SidebarProvider`. Returns a computed context object (`sidebar.value.open`, …).

| Field           | Type                              | Description                                    |
| --------------- | --------------------------------- | ---------------------------------------------- |
| `collapsible`   | `"icon" \| "none" \| "offcanvas"` | Mode from the nearest `Sidebar`.               |
| `isMobile`      | `boolean`                         | Viewport is below `md` (desktop rail CSS).     |
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
- Offcanvas collapsed panel is `inert` (out of the tab order)
- Mobile uses `Drawer` (dialog, overlay, Escape)
- Trigger sets `aria-expanded` and `aria-controls`
- `SidebarListItem` copies string `primary` to `aria-label` when collapsed

## Related components

Accordion, Avatar, Button, Drawer, List, ListItem, ListSection, Tooltip
