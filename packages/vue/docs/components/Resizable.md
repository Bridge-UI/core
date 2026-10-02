# Resizable

Panels the user can resize by dragging the handle between them or with the keyboard. `Resizable` is the group, `ResizablePanel` is each panel, and `ResizableHandle` sits between two panels.

Sizes are percentages of the group. Panels without `default-size` share the space left. Panel order follows the DOM, so panels and handles can be wrapped or rendered with `v-if`.

The group fills its parent (`h-full w-full`). Give the parent, or the group through `class`, a height when the panels stack or when the page does not set one.

## Import

```ts
import { Resizable } from "@bridge-ui/vue/Components/Resizable";
import { ResizableHandle } from "@bridge-ui/vue/Components/ResizableHandle";
import { ResizablePanel } from "@bridge-ui/vue/Components/ResizablePanel";
```

## Examples

### Usage

```vue
<Resizable class="h-64 rounded-lg border">
  <ResizablePanel :default-size="25">Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</Resizable>
```

### Vertical

```vue
<Resizable class="h-96" orientation="vertical">
  <ResizablePanel>Editor</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel :default-size="30">Console</ResizablePanel>
</Resizable>
```

### With a grip

`with-handle` shows a grip on the handle.

```vue
<Resizable class="h-64">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle with-handle />
  <ResizablePanel>Two</ResizablePanel>
</Resizable>
```

### Size limits

`min-size` and `max-size` bound a panel while dragging and with the keyboard. Once the panel shrinking next to the handle reaches its `min-size`, the drag goes on to shrink the panels beyond it.

```vue
<Resizable class="h-64">
  <ResizablePanel :min-size="15" :max-size="40" :default-size="25">
    Sidebar
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel :min-size="30">Content</ResizablePanel>
</Resizable>
```

### Nested groups

```vue
<Resizable class="h-96">
  <ResizablePanel :default-size="25">Files</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>
    <Resizable orientation="vertical">
      <ResizablePanel>Editor</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="30">Terminal</ResizablePanel>
    </Resizable>
  </ResizablePanel>
</Resizable>
```

### Collapsible panel

A `collapsible` panel collapses to `collapsed-size` (default `0`) once it is dragged past half of `min-size`. `Enter` on the handle collapses it and expands it back to its last size. Bind `v-model:collapsed` to collapse or expand it from outside.

```vue
<Button @click="collapsed = !collapsed">Toggle sidebar</Button>

<Resizable class="h-64">
  <ResizablePanel
    collapsible
    :min-size="15"
    :default-size="25"
    v-model:collapsed="collapsed"
  >
    Sidebar
  </ResizablePanel>
  <ResizableHandle with-handle />
  <ResizablePanel>Content</ResizablePanel>
</Resizable>
```

`collapsed-size` keeps a strip visible, for example for an icon rail:

```vue
<ResizablePanel collapsible :min-size="20" :collapsed-size="5">
  Sidebar
</ResizablePanel>
```

### Saving the layout

`@layout-change` receives every panel size, in order. Feed saved sizes back through `default-size`.

```vue
<script setup lang="ts">
const saved = JSON.parse(localStorage.getItem("layout") ?? "[30, 70]");

function save(layout: number[]) {
  localStorage.setItem("layout", JSON.stringify(layout));
}
</script>

<template>
  <Resizable class="h-64" @layout-change="save">
    <ResizablePanel :default-size="saved[0]">Sidebar</ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="saved[1]">Content</ResizablePanel>
  </Resizable>
</template>
```

`ResizablePanel` also emits `resize` with its own size.

### Disabled

`disabled` on the group locks every handle. On a handle, it locks only that handle.

```vue
<Resizable disabled class="h-64">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</Resizable>
```

### Right to left

`dir="rtl"` flips the horizontal drag and arrow keys, so the panel on the right is the first one.

```vue
<Resizable dir="rtl" class="h-64">
  <ResizablePanel :default-size="25">Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</Resizable>
```

### Classes and grip slot

```vue
<ResizableHandle
  with-handle
  :classes="{
    root: 'bg-primary-200',
    grip: 'flex h-5 w-3 items-center justify-center text-xs',
  }"
>
  <template #grip>⋮</template>
</ResizableHandle>
```

## Keyboard

- Each handle is a focusable `separator`. Its value is the size of the panel before it
- Horizontal: `ArrowLeft` / `ArrowRight`. Vertical: `ArrowUp` / `ArrowDown`. `dir="rtl"` swaps the horizontal arrows
- Arrow keys move by `keyboard-step` (default `10`)
- `Home` shrinks the panel before the handle to its `min-size` (or collapses it when `collapsible`). `End` grows it to its `max-size`
- `Enter` collapses or expands a `collapsible` panel before the handle

## Props

### Resizable

| Prop           | Type                         | Default        | Description                                  |
| -------------- | ---------------------------- | -------------- | -------------------------------------------- |
| `classes`      | `ResizableClasses`           | —              | Classes for the group root.                  |
| `disabled`     | `boolean`                    | `false`        | Lock every handle in the group.              |
| `keyboardStep` | `number`                     | `10`           | Percent an arrow key moves a focused handle. |
| `orientation`  | `"horizontal" \| "vertical"` | `"horizontal"` | Axis the panels are laid out on.             |

| Event          | Payload            | Description                                           |
| -------------- | ------------------ | ----------------------------------------------------- |
| `layoutChange` | `layout: number[]` | Every panel size (percent), in order, after a change. |

### ResizablePanel

| Prop            | Type                    | Default | Description                                                           |
| --------------- | ----------------------- | ------- | --------------------------------------------------------------------- |
| `classes`       | `ResizablePanelClasses` | —       | Classes for the panel.                                                |
| `collapsed`     | `boolean`               | —       | Collapsed state, bound with `v-model:collapsed`. Needs `collapsible`. |
| `collapsedSize` | `number`                | `0`     | Size while collapsed, in percent.                                     |
| `collapsible`   | `boolean`               | `false` | Let the panel collapse past half of `minSize`.                        |
| `defaultSize`   | `number`                | —       | Initial size, in percent. Panels without one share the rest.          |
| `maxSize`       | `number`                | `100`   | Largest size, in percent.                                             |
| `minSize`       | `number`                | `0`     | Smallest size while expanded, in percent.                             |

| Event              | Payload              | Description                       |
| ------------------ | -------------------- | --------------------------------- |
| `resize`           | `size: number`       | The panel size changed (percent). |
| `update:collapsed` | `collapsed: boolean` | The panel collapsed or expanded.  |

### ResizableHandle

| Prop          | Type                         | Default | Description                        |
| ------------- | ---------------------------- | ------- | ---------------------------------- |
| `classes`     | `ResizableHandleClasses`     | —       | Classes for `root` and `grip`.     |
| `customProps` | `ResizableHandleCustomProps` | —       | Extra props for the `grip`.        |
| `disabled`    | `boolean`                    | `false` | Lock this handle.                  |
| `withHandle`  | `boolean`                    | `false` | Show a visible grip on the handle. |

Slot `grip`: content inside the grip (`with-handle`).

## Related components

Sidebar, Divider
