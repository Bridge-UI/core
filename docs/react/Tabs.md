# Tabs

Organize related content into tabbed views. Use with `TabList`, `Tab`, and `TabPanel` (MUI `TabContext`-like).

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
  <TabList>
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

Registers label + panel without a manual `TabList` / `TabPanel`.

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

### Pill variant

```tsx
<Tabs variant="pill" defaultValue="one">
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
<Tabs orientation="vertical" defaultValue="account">
  <TabList>
    <Tab value="account">Account</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="account">Account content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```

### Manual activation

Arrow keys move focus only; Enter or Space selects.

```tsx
<Tabs activation="manual" defaultValue="a">
  <TabList>
    <Tab value="a">A</Tab>
    <Tab value="b">B</Tab>
  </TabList>
  <TabPanel value="a">Panel A</TabPanel>
  <TabPanel value="b">Panel B</TabPanel>
</Tabs>
```

## Props (`Tabs`)

| Prop           | Type                         | Default              |
| -------------- | ---------------------------- | -------------------- |
| `value`        | `string`                     | —                    |
| `defaultValue` | `string`                     | first registered tab |
| `onChange`     | `(value: string) => void`    | —                    |
| `orientation`  | `"horizontal" \| "vertical"` | `"horizontal"`       |
| `variant`      | `"line" \| "pill"`           | `"line"`             |
| `color`        | color token                  | `"primary"`          |
| `size`         | `"sm" \| "md" \| "lg"`       | `"md"`               |
| `activation`   | `"automatic" \| "manual"`    | `"automatic"`        |
| `keepMounted`  | `boolean`                    | `true`               |

## Props (`Tab`)

| Prop       | Type      | Default  |
| ---------- | --------- | -------- |
| `value`    | `string`  | required |
| `disabled` | `boolean` | `false`  |

## Props (`TabList`)

HTML attributes on the `role="tablist"` container (`aria-label`, `className`, etc.).

## Props (`TabPanel`)

| Prop          | Type      | Default              |
| ------------- | --------- | -------------------- |
| `value`       | `string`  | required             |
| `keepMounted` | `boolean` | inherits from `Tabs` |

## Props (`TabItem`)

| Prop          | Type        | Default              |
| ------------- | ----------- | -------------------- |
| `value`       | `string`    | required             |
| `label`       | `ReactNode` | required             |
| `disabled`    | `boolean`   | `false`              |
| `keepMounted` | `boolean`   | inherits from `Tabs` |
| `children`    | `ReactNode` | panel content        |
