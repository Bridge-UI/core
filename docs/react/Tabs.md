# Tabs

Organize related content into tabbed views. Use with `TabList`, `Tab`, and `TabPanel`. Selected accent is `primary` or `dark`; inactive tabs use `dark-*`.

## Import

```ts
import { Tabs } from "@bridge-ui/react/Components/Tabs";
import { Tab } from "@bridge-ui/react/Components/Tab";
import { TabItem } from "@bridge-ui/react/Components/TabItem";
import { TabList } from "@bridge-ui/react/Components/TabList";
import { TabPanel } from "@bridge-ui/react/Components/TabPanel";
```

## Examples

### Usage

```tsx
const [pkg, setPkg] = useState("bun");

<Tabs value={pkg} onChange={setPkg}>
  <TabList aria-label="Package manager">
    <Tab value="bun">bun</Tab>
    <Tab value="npm">npm</Tab>
    <Tab value="pnpm">pnpm</Tab>
  </TabList>
  <TabPanel value="bun">bun install</TabPanel>
  <TabPanel value="npm">npm install</TabPanel>
  <TabPanel value="pnpm">pnpm install</TabPanel>
</Tabs>;
```

### TabItem shortcut

```tsx
<Tabs defaultValue="bun">
  <TabItem label="bun" value="bun">
    bun install
  </TabItem>
  <TabItem label="npm" value="npm">
    npm install
  </TabItem>
</Tabs>
```

### With icons

```tsx
<Tabs defaultValue="account">
  <TabList aria-label="Settings">
    <Tab startIcon={User} value="account">
      My Account
    </Tab>
    <Tab startIcon={Building2} value="company">
      Company
    </Tab>
    <Tab startIcon={Users} value="team">
      Team Members
    </Tab>
  </TabList>
  <TabPanel value="account">Account</TabPanel>
  <TabPanel value="company">Company</TabPanel>
  <TabPanel value="team">Team</TabPanel>
</Tabs>
```

### TabItem with icons and slots

```tsx
<Tabs defaultValue="inbox">
  <TabItem startIcon={Inbox} label="Inbox" value="inbox">
    Inbox
  </TabItem>
  <TabItem
    label="Alerts"
    value="alerts"
    endIcon={ChevronDown}
    slots={{
      start: <Avatar size="sm" fallback="A" />,
    }}
  >
    Alerts
  </TabItem>
</Tabs>
```

### Custom start / end on Tab

```tsx
<Tabs defaultValue="one">
  <TabList>
    <Tab
      value="one"
      slots={{
        end: <Badge>3</Badge>,
        start: <Avatar size="sm" fallback="1" />,
      }}
    >
      One
    </Tab>
    <Tab endIcon={ChevronRight} value="two">
      Two
    </Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>
```

### Variants

`line` (default), `plain`, `pill`, `solid`, `enclosed`.

```tsx
<Tabs variant="line" color="primary" defaultValue="one">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>

<Tabs color="dark" variant="pill" defaultValue="one">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>

<Tabs variant="solid" defaultValue="one">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>

<Tabs variant="plain" defaultValue="one">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>

<Tabs variant="enclosed" defaultValue="one">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>
```

### Vertical

```tsx
<Tabs defaultValue="account" orientation="vertical">
  <TabList aria-label="Account">
    <Tab value="account">Account</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="account">Account content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```

### Manual activation

```tsx
<Tabs defaultValue="a" activation="manual">
  <TabList>
    <Tab value="a">A</Tab>
    <Tab value="b">B</Tab>
  </TabList>
  <TabPanel value="a">Panel A</TabPanel>
  <TabPanel value="b">Panel B</TabPanel>
</Tabs>
```

## Props (`Tabs`)

| Prop           | Type                                                   | Default              |
| -------------- | ------------------------------------------------------ | -------------------- |
| `value`        | `string`                                               | —                    |
| `defaultValue` | `string`                                               | first registered tab |
| `onChange`     | `(value: string) => void`                              | —                    |
| `orientation`  | `"horizontal" \| "vertical"`                           | `"horizontal"`       |
| `variant`      | `"line" \| "plain" \| "pill" \| "solid" \| "enclosed"` | `"line"`             |
| `color`        | `"primary" \| "dark"`                                  | `"primary"`          |
| `size`         | `"sm" \| "md" \| "lg"`                                 | `"md"`               |
| `activation`   | `"automatic" \| "manual"`                              | `"automatic"`        |
| `keepMounted`  | `boolean`                                              | `true`               |

## Props (`Tab`)

| Prop        | Type         | Default  |
| ----------- | ------------ | -------- |
| `value`     | `string`     | required |
| `startIcon` | `LucideIcon` | —        |
| `endIcon`   | `LucideIcon` | —        |
| `disabled`  | `boolean`    | `false`  |
| `slots`     | `TabSlots`   | —        |

`slots.start` / `slots.end` are used when the matching Lucide icon prop is omitted.

## Props (`TabList`)

HTML attributes on the `role="tablist"` container (`aria-label`, `className`, etc.).

## Props (`TabPanel`)

| Prop          | Type      | Default              |
| ------------- | --------- | -------------------- |
| `value`       | `string`  | required             |
| `keepMounted` | `boolean` | inherits from `Tabs` |

## Props (`TabItem`)

| Prop          | Type               | Default              |
| ------------- | ------------------ | -------------------- |
| `value`       | `string`           | required             |
| `label`       | `ReactNode`        | required             |
| `startIcon`   | `LucideIcon`       | —                    |
| `endIcon`     | `LucideIcon`       | —                    |
| `disabled`    | `boolean`          | `false`              |
| `keepMounted` | `boolean`          | inherits from `Tabs` |
| `slots`       | `{ start?, end? }` | —                    |
| `children`    | `ReactNode`        | panel content        |
