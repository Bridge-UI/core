# Sidebar

Persistent app-shell rail. Mount `SidebarProvider` around `Sidebar` and `SidebarInset` as siblings. Put `SidebarList` / `Accordion` in the rail. On small viewports the panel opens as a `Drawer`.

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
} from "@bridge-ui/react/Components/Sidebar";
```

## Prerequisites

Mount `SidebarProvider` around the app shell (`Sidebar` and `SidebarInset` as siblings) before using `SidebarTrigger` or `useSidebar`.

`BridgeUIProvider` still holds theme, tokens, and `defaultProps`. It does not own instance `open` state.

## Examples

### Usage

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
      <SidebarListItem interactive primary="Settings" />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Header and footer

Put brand and account rows in `slots.header` / `slots.footer`. `SidebarList` collapses those rows to the start avatar. The end chevron hides while collapsed. Header and footer lists use `classes.root` `p-0` because those slots are already padded.

```tsx
function Brand() {
  return (
    <SidebarList classes={{ root: "p-0" }}>
      <SidebarListItem
        interactive
        primary="Acme Inc"
        secondary="Enterprise"
        slots={{
          end: <Icon icon="chevronUpDown" />,
          start: <Avatar size="sm" rounded="lg" fallback="A" color="primary" />,
        }}
      />
    </SidebarList>
  );
}

function Account() {
  return (
    <SidebarList classes={{ root: "p-0" }}>
      <SidebarListItem
        interactive
        primary="Ada Lovelace"
        secondary="ada@example.com"
        slots={{
          end: <Icon icon="chevronUpDown" />,
          start: <Avatar size="sm" rounded="lg" fallback="AL" />,
        }}
      />
    </SidebarList>
  );
}

<SidebarProvider>
  <Sidebar
    collapsible="icon"
    slots={{
      header: <Brand />,
      footer: <Account />,
    }}
  >
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>;
```

### Icon collapse

Use `SidebarList` / `SidebarListItem` when `collapsible="icon"`. Collapsed items keep `primary` as an `aria-label` and show it in a `Tooltip` on the whole item. Nested `SidebarList` is hidden. The mobile drawer keeps labels.

```tsx
<SidebarProvider>
  <Sidebar
    collapsible="icon"
    slots={{
      header: <Brand />,
      footer: <Account />,
    }}
  >
    <SidebarList>
      <ListSection title="Application" />
      <SidebarListItem
        interactive
        primary="Home"
        slots={{ start: <Icon icon="user" /> }}
      />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Controlled

```tsx
<SidebarProvider open={open} onOpenChange={setOpen}>
  <Sidebar>
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Right side

```tsx
<SidebarProvider>
  <Sidebar side="right">
    <SidebarList>
      <SidebarListItem interactive primary="Inbox" />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Inset variant

```tsx
<SidebarProvider>
  <Sidebar variant="inset">
    <SidebarList>
      <SidebarListItem interactive primary="Home" />
    </SidebarList>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Collapsible groups

```tsx
<SidebarProvider>
  <Sidebar>
    <Accordion variant="plain">
      <AccordionItem title="Projects" value="projects">
        <SidebarList classes={{ root: "p-0" }}>
          <SidebarListItem interactive primary="Alpha" />
          <SidebarListItem interactive primary="Beta" />
        </SidebarList>
      </AccordionItem>
    </Accordion>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

## Props (`SidebarProvider`)

| Prop           | Type                         | Default | Description                                  |
| -------------- | ---------------------------- | ------- | -------------------------------------------- |
| `children`     | `ReactNode`                  | —       | `Sidebar`, `SidebarInset`, and other shell.  |
| `classes`      | `SidebarProviderClasses`     | —       | Part classes (`root`).                       |
| `customProps`  | `SidebarProviderCustomProps` | —       | Extra props for the layout wrapper.          |
| `defaultOpen`  | `boolean`                    | `true`  | Uncontrolled initial desktop expanded state. |
| `onOpenChange` | `(open: boolean) => void`    | —       | Called when desktop `open` should change.    |
| `open`         | `boolean`                    | —       | Controlled desktop expanded state.           |

## Props (`Sidebar`)

| Prop          | Type                              | Default       | Description                                            |
| ------------- | --------------------------------- | ------------- | ------------------------------------------------------ |
| `ariaLabel`   | `string`                          | `"Sidebar"`   | Accessible name for the `aside` and the mobile drawer. |
| `children`    | `ReactNode`                       | —             | Rail content (`SidebarList` / `Accordion`).            |
| `classes`     | `SidebarClasses`                  | —             | Part classes (`root`, `header`, `content`, …).         |
| `collapsible` | `"icon" \| "none" \| "offcanvas"` | `"offcanvas"` | How the desktop rail hides.                            |
| `customProps` | `SidebarCustomProps`              | —             | Extra props for internal parts.                        |
| `side`        | `"left" \| "right"`               | `"left"`      | Edge the rail docks to.                                |
| `slots`       | `SidebarSlots`                    | —             | `header`, `footer`.                                    |
| `variant`     | `"inset" \| "sidebar"`            | `"sidebar"`   | Flush rail or padded main column.                      |

## Props (`SidebarInset`)

| Prop          | Type                      | Default | Description                     |
| ------------- | ------------------------- | ------- | ------------------------------- |
| `children`    | `ReactNode`               | —       | Main content.                   |
| `classes`     | `SidebarInsetClasses`     | —       | Part classes (`root`).          |
| `customProps` | `SidebarInsetCustomProps` | —       | Extra props for the inset root. |

## Props (`SidebarTrigger`)

Renders a `Button`. Forwards native button attributes. Default accessible name is `Toggle sidebar`.

## Props (`SidebarList`)

Same as `List`. Sets `iconOnly` when the icon rail is collapsed on desktop. Override with `iconOnly`. Nested `SidebarList` is hidden while collapsed.

## Props (`SidebarListItem`)

Same as `ListItem`. When the icon rail is collapsed, string `primary` is shown in a tooltip on the whole row.

## `useSidebar`

Must be called under `SidebarProvider`.

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
