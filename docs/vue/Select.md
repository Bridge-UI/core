# Select

Dropdown select with single/multiple value, search, and async data.

## Import

```vue
import { Select } from "@bridge-ui/vue/Components/Select";
```

## Examples

### Usage

```vue
<Select label="Country" :options="countries" placeholder="Select a country" />

<Select
  v-model="selected"
  label="Frameworks"
  multiple
  searchable
  :options="frameworks"
/>

<Select label="Country" error error-message="Please select a valid country." />
```

### Searchable

```vue
<Select
  searchable
  label="Country"
  :options="countries"
  placeholder="Type to filter..."
/>
```

### Async data

```vue
<Select
  label="City (async)"
  placeholder="Type to search cities..."
  :async-data="{
    search: asyncSearch,
    resolve: asyncResolveSelected,
  }"
/>
```

### Custom option slot

```vue
<Select
  label="Framework"
  :options="frameworks"
  placeholder="Custom rendered options"
>
  <template #option="{ option, selected }">
    <span class="flex w-full items-center justify-between gap-2">
      <span class="truncate font-medium">{{ option.label }}</span>

      <span v-if="selected" class="text-primary-600 shrink-0 text-xs font-semibold">
        Selected
      </span>
    </span>
  </template>
</Select>
```

### customProps

```vue
<Select
  label="Country"
  placeholder="Select a country"
  :options="countries"
  :custom-props="{
    root: { id: 'country-field' },
    input: { name: 'country', autocomplete: 'country' },
  }"
/>
```

## Props

### Select-specific

| Prop                | Type                  | Default         | Description                  |
| ------------------- | --------------------- | --------------- | ---------------------------- |
| `asyncData`         | `{ search, resolve }` | —               | Async search + resolve       |
| `clearable`         | `boolean`             | `true`          | Show clear button            |
| `emptyMessage`      | `string`              | `"No options"`  | Empty list text              |
| `flipOptions`       | `boolean`             | `false`         | Invert options order         |
| `hideEmptyMessage`  | `boolean`             | `false`         | Hide empty-state message     |
| `loading`           | `boolean`             | —               | Loading state                |
| `maxHeight`         | `string`              | `"max-h-60"`    | Options list max height      |
| `minItemsForSearch` | `number`              | `11`            | Auto-enable search threshold |
| `modelValue`        | `SelectModel \| null` | —               | Selected value(s)            |
| `multiple`          | `boolean`             | `false`         | Multi-select with chips      |
| `optionDescription` | `string`              | `"description"` | Option description key       |
| `optionLabel`       | `string`              | `"label"`       | Option label key             |
| `options`           | `SelectOptionInput[]` | —               | Static options               |
| `optionValue`       | `string`              | `"value"`       | Option value key             |
| `placeholder`       | `string`              | —               | Placeholder                  |
| `searchable`        | `boolean`             | `false`         | Filter options               |

### Inherited from FormField

See [FormField](./FormField.md).

### Slots

`option`, `chip`, `beforeOptions`, `afterOptions`, `empty`, `loading`, plus FormField slots.

## Related components

Menu, List, ListItem, FormField
