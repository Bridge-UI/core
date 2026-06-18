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
  multiple
  searchable
  label="Frameworks"
  v-model="selected"
  :options="frameworks"
/>

<Select error label="Country" error-message="Please select a valid country." />
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
  :options="countries"
  placeholder="Select a country"
  :custom-props="{
    root: { id: 'country-field' },
    input: { name: 'country', autocomplete: 'country' },
  }"
/>
```

## Props

### Select-specific

| Prop                | Type                  | Default       | Description                                                                                      |
| ------------------- | --------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `asyncData`         | `SelectAsyncData`     | —             | Remote data source. Implies `searchable`.                                                        |
| `clearable`         | `boolean`             | `true`        | Whether the value can be cleared.                                                                |
| `defaultValue`      | `SelectModel`         | —             | Initial value when uncontrolled.                                                                 |
| `disableMaxHeight`  | `boolean`             | `false`       | When true, the dropdown options list is not height-limited. Forwarded to the internal `Listbox`. |
| `emptyMessage`      | `string`              | "No options"  | Message when the filtered list is empty.                                                         |
| `flipOptions`       | `boolean`             | `false`       | Inverts the visual order of options.                                                             |
| `hideEmptyMessage`  | `boolean`             | `false`       | Hides the empty-state message.                                                                   |
| `loading`           | `boolean`             | —             | External or async loading state.                                                                 |
| `maxHeight`         | `string`              | "max-h-60"    | Tailwind max-height class for the dropdown options area. Forwarded to the internal `Listbox`.    |
| `minItemsForSearch` | `number`              | 11            | Minimum option count before search UI is enabled.                                                |
| `multiple`          | `boolean`             | `false`       | Whether multiple values can be selected.                                                         |
| `optionDescription` | `string`              | "description" | Key used to read the description from option objects.                                            |
| `optionLabel`       | `string`              | "label"       | Key used to read the label from option objects.                                                  |
| `options`           | `SelectOptionInput[]` | —             | The list of options to display.                                                                  |
| `optionValue`       | `string`              | "value"       | Key used to read the value from option objects.                                                  |
| `placeholder`       | `string`              | —             | Placeholder shown when no value is selected.                                                     |
| `searchable`        | `boolean`             | `false`       | Whether options can be filtered via the trigger input.                                           |

### v-model

| Prop / Event        | Type                                                    | Default | Description                                                                  |
| ------------------- | ------------------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `SelectValue \| SelectValue[] \| null`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: SelectValue \| SelectValue[] \| null) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event           | Payload                  | Description                                           |
| --------------- | ------------------------ | ----------------------------------------------------- |
| `v-on:change`   | `(value: SelectModel)`   | Emitted when the selection changes.                   |
| `v-on:clear`    | —                        | Emitted when the value is cleared.                    |
| `v-on:close`    | —                        | Emitted when the menu closes.                         |
| `v-on:deselect` | `(option: SelectOption)` | Emitted when an option is deselected (multiple mode). |
| `v-on:open`     | —                        | Emitted when the menu opens.                          |
| `v-on:search`   | `(query: string)`        | Emitted when the search query changes.                |
| `v-on:select`   | `(option: SelectOption)` | Emitted when an option is selected.                   |

## Related components

Menu, List, ListItem, FormField
