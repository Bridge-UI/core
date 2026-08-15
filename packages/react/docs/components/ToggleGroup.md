# ToggleGroup

Segmented control for one or more labeled options in a shared track. Single selection by default; set `multiple` for multi-select. Use `Switch` for on/off. Compose with `ToggleItem`.

## Import

```ts
import { ToggleGroup } from "@bridge-ui/react/Components/ToggleGroup";
import { ToggleItem } from "@bridge-ui/react/Components/ToggleItem";
```

## Examples

### Usage

```tsx
const [lib, setLib] = useState("vue");

<ToggleGroup value={lib} color="success" onChange={setLib} aria-label="Library">
  <ToggleItem value="react">React</ToggleItem>
  <ToggleItem value="vue">Vue</ToggleItem>
</ToggleGroup>;
```

### Multiple

```tsx
const [libs, setLibs] = useState(["vue"]);

<ToggleGroup multiple value={libs} onChange={setLibs} aria-label="Libraries">
  <ToggleItem value="react">React</ToggleItem>
  <ToggleItem value="vue">Vue</ToggleItem>
</ToggleGroup>;
```

### With icons

```tsx
<ToggleGroup value={view} onChange={setView} aria-label="View">
  <ToggleItem value="list" startIcon={List} aria-label="List" />
  <ToggleItem value="grid" startIcon={LayoutGrid} aria-label="Grid" />
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
  <ToggleItem value="react">React</ToggleItem>
  <ToggleItem value="vue">Vue</ToggleItem>
</ToggleGroup>
```

### Full width

```tsx
<ToggleGroup full value={lib} onChange={setLib} aria-label="Library">
  <ToggleItem value="react">React</ToggleItem>
  <ToggleItem value="vue">Vue</ToggleItem>
</ToggleGroup>
```
