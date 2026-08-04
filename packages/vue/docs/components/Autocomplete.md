# Autocomplete

Combobox with single/multiple value, search, async data, and optional free-solo input.

## Import

```ts
import { Autocomplete } from "@bridge-ui/vue/Components/Autocomplete";
```

## Examples

### Usage

```vue
<Autocomplete
  label="Country"
  :options="countries"
  placeholder="Choose a country"
/>

<Autocomplete
  multiple
  searchable
  label="Frameworks"
  v-model="selected"
  :options="frameworks"
/>

<Autocomplete
  error
  label="Country"
  error-message="Please select a valid country."
/>
```

### Searchable

```vue
<Autocomplete
  searchable
  label="Country"
  :options="countries"
  placeholder="Type to filter..."
/>
```

### Free solo

Enabled by default. Type a value that is not in `options` and commit with Enter, Tab, or by closing the menu. Set `:free-solo="false"` to require picking from the list.

```vue
<Autocomplete label="Tag" :options="tags" placeholder="Pick or type a tag" />
```

### Async data

```vue
<Autocomplete
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
<Autocomplete
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
</Autocomplete>
```

### Grouped options

`options` may mix standalone options and section groups (`{ title, options, sticky? }`). Search filters within sections and drops empty ones.

```vue
<Autocomplete
  searchable
  label="Produce"
  :options="[
    {
      title: 'Fruits',
      sticky: true,
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
      ],
    },
    {
      title: 'Vegetables',
      options: [{ label: 'Carrot', value: 'carrot' }],
    },
    { label: 'Other', value: 'other' },
  ]"
/>
```

### Composed list (default slot)

Use the default slot with `ListSection` / `ListItem` to build the dropdown list manually. Set `value` on each `ListItem` so it registers as a selectable option. Declarative `AutocompleteOption` children still feed the `options` data path; only `ListSection` / `ListItem` (and similar) count as composed list content. The `#option` slot remains for customizing items rendered from the `options` prop.

```vue
<Autocomplete label="Status" v-model="status">
  <ListSection sticky title="Workflow" />
  <ListItem value="open" primary="Open" />
  <ListItem value="closed" primary="Closed" />
</Autocomplete>
```

### customProps

```vue
<Autocomplete
  label="Country"
  :options="countries"
  placeholder="Choose a country"
  :custom-props="{
    root: { id: 'country-field' },
    input: { name: 'country', autocomplete: 'country' },
  }"
/>
```

## Props

### Autocomplete-specific

| Prop                | Type                  | Default       | Description                                                                                             |
| ------------------- | --------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `asyncData`         | `SelectAsyncData`     | —             | Remote data source. Implies `searchable`.                                                               |
| `clearable`         | `boolean`             | `true`        | Whether the value can be cleared.                                                                       |
| `defaultValue`      | `SelectModel`         | —             | Initial value when uncontrolled.                                                                        |
| `disableMaxHeight`  | `boolean`             | `false`       | When true, the dropdown options list is not height-limited. Forwarded to the internal `Listbox`.        |
| `emptyMessage`      | `string`              | "No options"  | Message when the filtered list is empty.                                                                |
| `flipOptions`       | `boolean`             | `false`       | Inverts the visual order of options.                                                                    |
| `freeSolo`          | `boolean`             | `true`        | Allows committing typed text that is not in `options` (Enter, Tab, or closing the menu).                |
| `hideEmptyMessage`  | `boolean`             | `false`       | Hides the empty-state message.                                                                          |
| `loading`           | `boolean`             | —             | External or async loading state.                                                                        |
| `maxHeight`         | `string`              | "max-h-60"    | Tailwind max-height class for the dropdown options area. Forwarded to the internal `Listbox`.           |
| `minItemsForSearch` | `number`              | 11            | Minimum option count before search UI is enabled.                                                       |
| `multiple`          | `boolean`             | `false`       | Whether multiple values can be selected.                                                                |
| `optionDescription` | `string`              | "description" | Key used to read the description from option objects.                                                   |
| `optionLabel`       | `string`              | "label"       | Key used to read the label from option objects.                                                         |
| `options`           | `ListboxOptionsInput` | —             | Options to display. May include section groups (`{ title, options, sticky? }`) mixed with flat options. |
| `optionValue`       | `string`              | "value"       | Key used to read the value from option objects.                                                         |
| `placeholder`       | `string`              | —             | Placeholder shown when no value is selected.                                                            |
| `searchable`        | `boolean`             | `true`        | Whether options can be filtered via the trigger input.                                                  |

### v-model

| Prop / Event        | Type                                                    | Default | Description                                                                  |
| ------------------- | ------------------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `SelectValue \| SelectValue[] \| null`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: SelectValue \| SelectValue[] \| null) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormField

See [FormField](./FormField.md).

## Slots

| Slot      | Scope                                         | Description                                                                                                |
| --------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `default` | —                                             | Composed list content (`ListSection` / `ListItem` with `value`). Replaces mapped `options` in the listbox. |
| `option`  | `{ option: SelectOption; selected: boolean }` | Custom option content when rendering from the `options` prop.                                              |

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

Menu, List, ListItem, ListSection, FormField
