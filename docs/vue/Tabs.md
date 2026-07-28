# Tabs

Organize related content into tabbed views. Use with `TabList`, `Tab`, and `TabPanel`. Selected accent is `primary` or `dark`; inactive tabs use `dark-*`.

## Import

```ts
import { Tabs } from "@bridge-ui/vue/Components/Tabs";
import { Tab } from "@bridge-ui/vue/Components/Tab";
import { TabItem } from "@bridge-ui/vue/Components/TabItem";
import { TabList } from "@bridge-ui/vue/Components/TabList";
import { TabPanel } from "@bridge-ui/vue/Components/TabPanel";
```

## Examples

### Usage

```vue
<Tabs v-model="pkg">
  <TabList aria-label="Package manager">
    <Tab value="bun">bun</Tab>
    <Tab value="npm">npm</Tab>
    <Tab value="pnpm">pnpm</Tab>
  </TabList>
  <TabPanel value="bun">bun install</TabPanel>
  <TabPanel value="npm">npm install</TabPanel>
  <TabPanel value="pnpm">pnpm install</TabPanel>
</Tabs>
```

### TabItem shortcut

```vue
<Tabs v-model="pkg">
  <TabItem label="bun" value="bun">bun install</TabItem>
  <TabItem label="npm" value="npm">npm install</TabItem>
</Tabs>
```

### With icons

```vue
<Tabs v-model="section">
  <TabList aria-label="Settings">
    <Tab :start-icon="User" value="account">My Account</Tab>
    <Tab :start-icon="Building2" value="company">Company</Tab>
    <Tab :start-icon="Users" value="team">Team Members</Tab>
  </TabList>
  <TabPanel value="account">Account</TabPanel>
  <TabPanel value="company">Company</TabPanel>
  <TabPanel value="team">Team</TabPanel>
</Tabs>
```

### TabItem with icons and slots

```vue
<Tabs v-model="section">
  <TabItem :start-icon="Inbox" label="Inbox" value="inbox">Inbox</TabItem>
  <TabItem label="Alerts" value="alerts" :end-icon="ChevronDown">
    <template #start>
      <Avatar size="sm" fallback="A" />
    </template>
    Alerts
  </TabItem>
</Tabs>
```

### Custom start / end on Tab

```vue
<Tabs v-model="tab">
  <TabList>
    <Tab value="one">
      <template #start>
        <Avatar size="sm" fallback="1" />
      </template>
      One
      <template #end>
        <Badge>3</Badge>
      </template>
    </Tab>
    <Tab value="two" :end-icon="ChevronRight">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>
```

### Variants

`line` (default), `plain`, `pill`, `solid`, `enclosed`.

```vue
<Tabs v-model="tab" variant="line" color="primary">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>

<Tabs color="dark" v-model="tab" variant="pill">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>

<Tabs v-model="tab" variant="enclosed">
  <TabList>
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
  </TabList>
  <TabPanel value="one">First</TabPanel>
  <TabPanel value="two">Second</TabPanel>
</Tabs>
```

### Vertical

```vue
<Tabs v-model="section" orientation="vertical">
  <TabList aria-label="Account">
    <Tab value="account">Account</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="account">Account content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```

### Manual activation

```vue
<Tabs v-model="letter" activation="manual">
  <TabList>
    <Tab value="a">A</Tab>
    <Tab value="b">B</Tab>
  </TabList>
  <TabPanel value="a">Panel A</TabPanel>
  <TabPanel value="b">Panel B</TabPanel>
</Tabs>
```

## Props (`Tabs`)

| Prop          | Type                                                   | Default        |
| ------------- | ------------------------------------------------------ | -------------- |
| `activation`  | `"automatic" \| "manual"`                              | `"automatic"`  |
| `color`       | `"primary" \| "dark"`                                  | `"primary"`    |
| `keepMounted` | `boolean`                                              | `true`         |
| `orientation` | `"horizontal" \| "vertical"`                           | `"horizontal"` |
| `size`        | `"sm" \| "md" \| "lg"`                                 | `"md"`         |
| `variant`     | `"line" \| "plain" \| "pill" \| "solid" \| "enclosed"` | `"line"`       |

### v-model

| Prop / Event        | Type                      | Default              | Description                                                                  |
| ------------------- | ------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `string`                  | first registered tab | The selected tab value. Bound with `v-model`.                                |
| `update:modelValue` | `(value: string) => void` | —                    | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

## Events

| Event         | Payload           | Description                                |
| ------------- | ----------------- | ------------------------------------------ |
| `v-on:change` | `(value: string)` | Emitted whenever the selected tab changes. |

## Props (`Tab`)

| Prop        | Type         | Default  |
| ----------- | ------------ | -------- |
| `value`     | `string`     | required |
| `startIcon` | `LucideIcon` | —        |
| `endIcon`   | `LucideIcon` | —        |
| `disabled`  | `boolean`    | `false`  |

Slots: `#default` (label), `#start`, `#end`. `#start` / `#end` are used when the matching Lucide icon prop is omitted.

## Props (`TabList`)

HTML attributes on the `role="tablist"` container (`aria-label`, `class`, etc.).

## Props (`TabPanel`)

| Prop          | Type      | Default              |
| ------------- | --------- | -------------------- |
| `value`       | `string`  | required             |
| `keepMounted` | `boolean` | inherits from `Tabs` |

## Props (`TabItem`)

| Prop          | Type         | Default              |
| ------------- | ------------ | -------------------- |
| `value`       | `string`     | required             |
| `label`       | `string`     | or `#label` slot     |
| `startIcon`   | `LucideIcon` | —                    |
| `endIcon`     | `LucideIcon` | —                    |
| `disabled`    | `boolean`    | `false`              |
| `keepMounted` | `boolean`    | inherits from `Tabs` |

Slots: `#default` (panel), `#label`, `#start`, `#end`.
