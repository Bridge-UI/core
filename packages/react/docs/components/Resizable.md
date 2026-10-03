# Resizable

Panels the user can resize by dragging the handle between them or with the keyboard. `Resizable` is the group, `ResizablePanel` is each panel, and `ResizableHandle` sits between two panels.

Sizes are percentages of the group. Panels without `defaultSize` share the space left. Panel order follows the DOM, so panels and handles can be wrapped or rendered conditionally.

The group fills its parent (`h-full w-full`). Give the parent, or the group through `className`, a height when the panels stack or when the page does not set one.

## Import

```ts
import { Resizable } from "@bridge-ui/react/Components/Resizable";
import { ResizableHandle } from "@bridge-ui/react/Components/ResizableHandle";
import { ResizablePanel } from "@bridge-ui/react/Components/ResizablePanel";
```

## Examples

### Usage

```tsx
<Resizable className="h-64 rounded-lg border">
  <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</Resizable>
```

### Vertical

```tsx
<Resizable className="h-96" orientation="vertical">
  <ResizablePanel>Editor</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={30}>Console</ResizablePanel>
</Resizable>
```

### With a grip

`withHandle` shows a grip on the handle.

```tsx
<Resizable className="h-64">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel>Two</ResizablePanel>
</Resizable>
```

### Size limits

`minSize` and `maxSize` bound a panel while dragging and with the keyboard. Once the panel shrinking next to the handle reaches its `minSize`, the drag goes on to shrink the panels beyond it.

```tsx
<Resizable className="h-64">
  <ResizablePanel minSize={15} maxSize={40} defaultSize={25}>
    Sidebar
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel minSize={30}>Content</ResizablePanel>
</Resizable>
```

### Nested groups

```tsx
<Resizable className="h-96">
  <ResizablePanel defaultSize={25}>Files</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>
    <Resizable orientation="vertical">
      <ResizablePanel>Editor</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>Terminal</ResizablePanel>
    </Resizable>
  </ResizablePanel>
</Resizable>
```

### Collapsible panel

A `collapsible` panel collapses to `collapsedSize` (default `0`) once it is dragged past half of `minSize`. `Enter` on the handle collapses it and expands it back to its last size. Bind `collapsed` to collapse or expand it from outside.

```tsx
const [collapsed, setCollapsed] = useState(false);

<Button onClick={() => setCollapsed((value) => !value)}>Toggle sidebar</Button>

<Resizable className="h-64">
  <ResizablePanel
    collapsible
    minSize={15}
    defaultSize={25}
    collapsed={collapsed}
    onCollapsedChange={setCollapsed}
  >
    Sidebar
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel>Content</ResizablePanel>
</Resizable>;
```

`collapsedSize` keeps a strip visible, for example for an icon rail:

```tsx
<ResizablePanel collapsible minSize={20} collapsedSize={5}>
  Sidebar
</ResizablePanel>
```

### Saving the layout

`onLayoutChange` receives every panel size, in order. Feed saved sizes back through `defaultSize`.

```tsx
const saved = JSON.parse(localStorage.getItem("layout") ?? "[30, 70]");

<Resizable
  className="h-64"
  onLayoutChange={(layout) => {
    localStorage.setItem("layout", JSON.stringify(layout));
  }}
>
  <ResizablePanel defaultSize={saved[0]}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={saved[1]}>Content</ResizablePanel>
</Resizable>;
```

`ResizablePanel` also calls `onResize` with its own size.

### Disabled

`disabled` on the group locks every handle. On a handle, it locks only that handle.

```tsx
<Resizable disabled className="h-64">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</Resizable>
```

### Right to left

`dir="rtl"` flips the horizontal drag and arrow keys, so the panel on the right is the first one.

```tsx
<Resizable dir="rtl" className="h-64">
  <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</Resizable>
```

### Classes and grip slot

```tsx
<ResizableHandle
  withHandle
  slots={{ grip: "⋮" }}
  classes={{
    root: "bg-primary-200",
    grip: "flex h-5 w-3 items-center justify-center text-xs",
  }}
/>
```

## Keyboard

- Each handle is a focusable `separator`. Its value is the size of the panel before it
- Horizontal: `ArrowLeft` / `ArrowRight`. Vertical: `ArrowUp` / `ArrowDown`. `dir="rtl"` swaps the horizontal arrows
- Arrow keys move by `keyboardStep` (default `10`)
- `Home` shrinks the panel before the handle to its `minSize` (or collapses it when `collapsible`). `End` grows it to its `maxSize`
- `Enter` collapses or expands a `collapsible` panel before the handle

## Props

### Resizable

| Prop             | Type                         | Default        | Description                                            |
| ---------------- | ---------------------------- | -------------- | ------------------------------------------------------ |
| `classes`        | `ResizableClasses`           | —              | Classes for the group root.                            |
| `disabled`       | `boolean`                    | `false`        | Lock every handle in the group.                        |
| `keyboardStep`   | `number`                     | `10`           | Percent an arrow key moves a focused handle.           |
| `onLayoutChange` | `(layout: number[]) => void` | —              | Called with every panel size (percent) after a change. |
| `orientation`    | `"horizontal" \| "vertical"` | `"horizontal"` | Axis the panels are laid out on.                       |

### ResizablePanel

| Prop                | Type                           | Default | Description                                                  |
| ------------------- | ------------------------------ | ------- | ------------------------------------------------------------ |
| `classes`           | `ResizablePanelClasses`        | —       | Classes for the panel.                                       |
| `collapsed`         | `boolean`                      | —       | Collapsed state. Needs `collapsible`.                        |
| `collapsedSize`     | `number`                       | `0`     | Size while collapsed, in percent.                            |
| `collapsible`       | `boolean`                      | `false` | Let the panel collapse past half of `minSize`.               |
| `defaultSize`       | `number`                       | —       | Initial size, in percent. Panels without one share the rest. |
| `maxSize`           | `number`                       | `100`   | Largest size, in percent.                                    |
| `minSize`           | `number`                       | `0`     | Smallest size while expanded, in percent.                    |
| `onCollapsedChange` | `(collapsed: boolean) => void` | —       | Called when the panel collapses or expands.                  |
| `onResize`          | `(size: number) => void`       | —       | Called when the panel size changes.                          |

### ResizableHandle

| Prop          | Type                         | Default | Description                        |
| ------------- | ---------------------------- | ------- | ---------------------------------- |
| `classes`     | `ResizableHandleClasses`     | —       | Classes for `root` and `grip`.     |
| `customProps` | `ResizableHandleCustomProps` | —       | Extra props for the `grip`.        |
| `disabled`    | `boolean`                    | `false` | Lock this handle.                  |
| `slots`       | `ResizableHandleSlots`       | —       | `grip` content.                    |
| `withHandle`  | `boolean`                    | `false` | Show a visible grip on the handle. |

## Related components

Sidebar, Divider
