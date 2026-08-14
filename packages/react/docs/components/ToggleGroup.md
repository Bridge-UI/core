# ToggleGroup

Segmented control for mutually exclusive options. Use `Switch` for on/off; use `ToggleGroup` to pick among labeled segments in a shared track. Compose with `Toggle`.

## Import

```ts
import { ToggleGroup } from "@bridge-ui/react/Components/ToggleGroup";
import { Toggle } from "@bridge-ui/react/Components/Toggle";
```

## Examples

### Usage

```tsx
const [lib, setLib] = useState("vue");

<ToggleGroup value={lib} color="success" onChange={setLib} aria-label="Library">
  <Toggle value="react">React</Toggle>
  <Toggle value="vue">Vue</Toggle>
</ToggleGroup>;
```

### With icons

```tsx
<ToggleGroup value={view} onChange={setView} aria-label="View">
  <Toggle value="list" startIcon={List} aria-label="List" />
  <Toggle value="grid" startIcon={LayoutGrid} aria-label="Grid" />
</ToggleGroup>
```

### Variants

`solid` uses a soft semantic fill on the selected segment. `outline` keeps a quieter ring accent.

```tsx
<ToggleGroup value={lib} variant="solid" onChange={setLib} aria-label="Solid" />
<ToggleGroup
  value={lib}
  onChange={setLib}
  variant="outline"
  aria-label="Outline"
/>
```

### Size

```tsx
<ToggleGroup size="sm" value={lib} onChange={setLib} aria-label="Small">
  <Toggle value="react">React</Toggle>
  <Toggle value="vue">Vue</Toggle>
</ToggleGroup>
```

### Full width

```tsx
<ToggleGroup full value={lib} onChange={setLib} aria-label="Library">
  <Toggle value="react">React</Toggle>
  <Toggle value="vue">Vue</Toggle>
</ToggleGroup>
```
