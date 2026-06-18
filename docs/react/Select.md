# Select

Dropdown select with single/multiple value, search, and async data.

## Import

```tsx
import { Select } from "@bridge-ui/react/Components/Select";
```

## Examples

### Usage

```tsx
<Select label="Country" options={countries} placeholder="Select a country" />

<Select
  label="Frameworks"
  multiple
  searchable
  options={frameworks}
  value={selected}
  onChange={setSelected}
/>

<Select
  label="Country"
  error
  errorMessage="Please select a valid country."
/>
```

### Searchable

```tsx
<Select
  searchable
  label="Country"
  options={countries}
  placeholder="Type to filter..."
/>
```

### Async data

```tsx
<Select
  label="City (async)"
  placeholder="Type to search cities..."
  asyncData={{
    search: asyncSearch,
    resolve: asyncResolveSelected,
  }}
/>
```

### Custom option slot

```tsx
<Select
  label="Framework"
  options={frameworks}
  placeholder="Custom rendered options"
  slots={{
    option: ({ option, selected }) => (
      <span className="flex w-full items-center justify-between gap-2">
        <span className="truncate font-medium">{option.label}</span>

        {selected ? (
          <span className="text-primary-600 shrink-0 text-xs font-semibold">
            Selected
          </span>
        ) : null}
      </span>
    ),
  }}
/>
```

### customProps

```tsx
<Select
  label="Country"
  placeholder="Select a country"
  options={countries}
  customProps={{
    root: { id: "country-field" },
    input: { name: "country", autoComplete: "country" },
  }}
/>
```

## Props

### Select-specific

| Prop                | Type                  | Default         | Description                  |
| ------------------- | --------------------- | --------------- | ---------------------------- |
| `asyncData`         | `{ search, resolve }` | —               | Async search + resolve       |
| `clearable`         | `boolean`             | `true`          | Show clear button            |
| `defaultValue`      | `SelectModel \| null` | —               | Initial uncontrolled value   |
| `disableMaxHeight`  | `boolean`             | `false`         | Disable options max-height   |
| `emptyMessage`      | `string`              | `"No options"`  | Empty list text              |
| `flipOptions`       | `boolean`             | `false`         | Invert options order         |
| `hideEmptyMessage`  | `boolean`             | `false`         | Hide empty-state message     |
| `loading`           | `boolean`             | —               | Loading state                |
| `maxHeight`         | `string`              | `"max-h-60"`    | Options list max height      |
| `minItemsForSearch` | `number`              | `11`            | Auto-enable search threshold |
| `multiple`          | `boolean`             | `false`         | Multi-select with chips      |
| `onChange`          | `(value) => void`     | —               | Change handler (React)       |
| `optionDescription` | `string`              | `"description"` | Option description key       |
| `optionLabel`       | `string`              | `"label"`       | Option label key             |
| `options`           | `SelectOptionInput[]` | —               | Static options               |
| `optionValue`       | `string`              | `"value"`       | Option value key             |
| `placeholder`       | `string`              | —               | Placeholder                  |
| `searchable`        | `boolean`             | `false`         | Filter options               |
| `value`             | `SelectModel \| null` | —               | Selected value(s)            |

### Inherited from FormField

See [FormField](./FormField.md).

### Slots

`option`, `chip`, `beforeOptions`, `afterOptions`, `empty`, `loading`, plus FormField slots.

## Related components

Menu, List, ListItem, FormField
