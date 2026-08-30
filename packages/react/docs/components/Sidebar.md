# Sidebar

Persistent app-shell rail. Mount `SidebarProvider` around `Sidebar` and `SidebarInset` as siblings. Put `List` / `Accordion` in the rail. On small viewports the panel opens as a `Drawer`.

## Import

```ts
import {
  Sidebar,
  SidebarInset,
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
    <List>
      <ListItem interactive primary="Home" />
      <ListItem interactive primary="Settings" />
    </List>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Header and footer

```tsx
<SidebarProvider>
  <Sidebar
    slots={{
      header: <div>Acme</div>,
      footer: <ListItem interactive primary="Account" />,
    }}
  >
    <List>
      <ListItem interactive primary="Home" />
    </List>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>
```

### Icon collapse

Bind `List` `iconOnly` from `useSidebar` when `collapsible="icon"`. Wrap items in `Tooltip` if you want a label while collapsed. `useSidebar` must run under `SidebarProvider`.

```tsx
function Nav() {
  const { state } = useSidebar();

  return (
    <List iconOnly={state === "collapsed"}>
      <ListSection title="Application" />
      <ListItem
        interactive
        primary="Home"
        slots={{ start: <Icon icon="user" /> }}
      />
    </List>
  );
}

<SidebarProvider>
  <Sidebar collapsible="icon">
    <Nav />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>;
```

### Controlled

```tsx
<SidebarProvider open={open} onOpenChange={setOpen}>
  <Sidebar>
    <List>
      <ListItem interactive primary="Home" />
    </List>
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
    <List>
      <ListItem interactive primary="Inbox" />
    </List>
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
    <List>
      <ListItem interactive primary="Home" />
    </List>
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
    {children}
  </SidebarInset>
</SidebarProvider>
```

## Props (`SidebarProvider`)

| Prop           | Type                      | Default | Description                                  |
| -------------- | ------------------------- | ------- | -------------------------------------------- |
| `children`     | `ReactNode`               | —       | `Sidebar`, `SidebarInset`, and other shell.  |
| `classes`      | `SidebarProviderClasses`  | —       | Part classes (`root`).                       |
| `customProps`  | `SidebarProviderCustomProps` | —    | Extra props for the layout wrapper.          |
| `defaultOpen`  | `boolean`                 | `true`  | Uncontrolled initial desktop expanded state. |
| `onOpenChange` | `(open: boolean) => void` | —       | Called when desktop `open` should change.    |
| `open`         | `boolean`                 | —       | Controlled desktop expanded state.           |

## Props (`Sidebar`)

| Prop          | Type                              | Default       | Description                                            |
| ------------- | --------------------------------- | ------------- | ------------------------------------------------------ |
| `ariaLabel`   | `string`                          | `"Sidebar"`   | Accessible name for the `aside` and the mobile drawer. |
| `children`    | `ReactNode`                       | —             | Rail content (`List` / `Accordion`).                   |
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

## `useSidebar`

Must be called under `SidebarProvider`.

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
- `List` `iconOnly` copies string `primary` to `aria-label`

## Related components

Accordion, Button, Drawer, List, ListItem, ListSection, Tooltip
