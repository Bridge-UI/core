# Tabs

Organize related content into tabbed views. Use with `TabList`, `Tab`, and `TabPanel`.

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
  <TabList>
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

Registers label + panel without a manual `TabList` / `TabPanel`.

```vue
<Tabs v-model="pkg">
  <TabItem label="bun" value="bun">bun install</TabItem>
  <TabItem label="npm" value="npm">npm install</TabItem>
</Tabs>
```

### Pill variant

```vue
<Tabs variant="pill" v-model="tab">
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
<Tabs orientation="vertical" v-model="section">
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

```vue
<Tabs activation="manual" v-model="letter">
  <TabList>
    <Tab value="a">A</Tab>
    <Tab value="b">B</Tab>
  </TabList>
  <TabPanel value="a">Panel A</TabPanel>
  <TabPanel value="b">Panel B</TabPanel>
</Tabs>
```

## Props (`Tabs`)

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| `activation`  | `"automatic" \| "manual"`    | `"automatic"`  |
| `color`       | color token                  | `"primary"`    |
| `keepMounted` | `boolean`                    | `true`         |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `size`        | `"sm" \| "md" \| "lg"`       | `"md"`         |
| `variant`     | `"line" \| "pill"`           | `"line"`       |

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

| Prop       | Type      | Default  |
| ---------- | --------- | -------- |
| `value`    | `string`  | required |
| `disabled` | `boolean` | `false`  |

## Props (`TabList`)

HTML attributes on the `role="tablist"` container (`aria-label`, `class`, etc.).

## Props (`TabPanel`)

| Prop          | Type      | Default              |
| ------------- | --------- | -------------------- |
| `value`       | `string`  | required             |
| `keepMounted` | `boolean` | inherits from `Tabs` |

## Props (`TabItem`)

| Prop          | Type      | Default              |
| ------------- | --------- | -------------------- |
| `value`       | `string`  | required             |
| `label`       | `string`  | or `#label` slot     |
| `disabled`    | `boolean` | `false`              |
| `keepMounted` | `boolean` | inherits from `Tabs` |
