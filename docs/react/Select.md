# Select

Dropdown select with single/multiple value, search, and async data.

## Import

```tsx
import { Select } from "@bridge-ui/react/Components/Select";
```

## Examples

### Usage

```tsx
<Select
  label="Country"
  options={countries}
  placeholder="Select a country"
/>

<Select
  multiple
  searchable
  value={selected}
  label="Frameworks"
  options={frameworks}
  onChange={setSelected}
/>

<Select
  error
  label="Country"
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
  options={countries}
  placeholder="Select a country"
  customProps={{
    root: { id: "country-field" },
    input: { name: "country", autoComplete: "country" },
  }}
/>
```

## Props

### Select-specific

| Prop                | Type                  | Default       | Description                                                                                      |
| ------------------- | --------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `asyncData`         | `SelectAsyncData`     | —             | Remote data source. Implies `searchable`.                                                        |
| `clearable`         | `boolean`             | `true`        | Whether the value can be cleared.                                                                |
| `defaultValue`      | `SelectModel \| null` | —             | Initial value when uncontrolled.                                                                 |
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

### Binding

| Prop       | Type                           | Default | Description                                                                |
| ---------- | ------------------------------ | ------- | -------------------------------------------------------------------------- |
| `value`    | `SelectModel \| null`          | —       | The selected value (controlled). Use with `onChange` for controlled state. |
| `onChange` | `(value: SelectModel) => void` | —       | Called when the selection changes.                                         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback     | Payload                  | Description                                          |
| ------------ | ------------------------ | ---------------------------------------------------- |
| `onClear`    | —                        | Called when the value is cleared.                    |
| `onClose`    | —                        | Called when the menu closes.                         |
| `onDeselect` | `(option: SelectOption)` | Called when an option is deselected (multiple mode). |
| `onOpen`     | —                        | Called when the menu opens.                          |
| `onSearch`   | `(query: string)`        | Called when the search query changes.                |
| `onSelect`   | `(option: SelectOption)` | Called when an option is selected.                   |

## Related components

Menu, List, ListItem, FormField
