# Autocomplete

Combobox with single/multiple value, search, async data, and optional free-solo input.

## Import

```ts
import { Autocomplete } from "@bridge-ui/react/Components/Autocomplete";
```

## Examples

### Usage

```tsx
<Autocomplete
  label="Country"
  options={countries}
  placeholder="Choose a country"
/>

<Autocomplete
  multiple
  searchable
  value={selected}
  label="Frameworks"
  options={frameworks}
  onChange={setSelected}
/>

<Autocomplete
  error
  label="Country"
  errorMessage="Please select a valid country."
/>
```

### Searchable

```tsx
<Autocomplete
  searchable
  label="Country"
  options={countries}
  placeholder="Type to filter..."
/>
```

### Free solo

Enabled by default. Type a value that is not in `options` and commit with Enter, Tab, or by closing the menu. Set `freeSolo={false}` to require picking from the list.

```tsx
<Autocomplete label="Tag" options={tags} placeholder="Pick or type a tag" />
```

### Async data

```tsx
<Autocomplete
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
<Autocomplete
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

### Grouped options

`options` may mix standalone options and section groups (`{ title, options, sticky? }`). Search filters within sections and drops empty ones.

```tsx
<Autocomplete
  searchable
  label="Produce"
  options={[
    {
      title: "Fruits",
      sticky: true,
      options: [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
      ],
    },
    {
      title: "Vegetables",
      options: [{ label: "Carrot", value: "carrot" }],
    },
    { label: "Other", value: "other" },
  ]}
/>
```

### Composed list children

Pass `ListSection` / `ListItem` as children to build the dropdown list manually. Set `value` on each `ListItem` so it registers as a selectable option. When children are present, mapped `options` are not rendered in the listbox.

```tsx
<Autocomplete label="Status" value={status} onChange={setStatus}>
  <ListSection sticky title="Workflow" />
  <ListItem value="open" primary="Open" />
  <ListItem value="closed" primary="Closed" />
</Autocomplete>
```

### Overlay

```tsx
<Autocomplete label="Country" overlay="auto" options={countries} />

<Autocomplete label="Country" overlay="drawer" options={countries} />
```

Default `overlay` is `auto`: `menu` on desktop and bottom `drawer` on mobile.

### customProps

```tsx
<Autocomplete
  label="Country"
  options={countries}
  placeholder="Choose a country"
  customProps={{
    root: { id: "country-field" },
    input: { name: "country", autoComplete: "country" },
  }}
/>
```

## Props

### Autocomplete-specific

| Prop                | Type                  | Default       | Description                                                                                             |
| ------------------- | --------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `asyncData`         | `SelectAsyncData`     | —             | Remote data source. Implies `searchable`.                                                               |
| `children`          | `ReactNode`           | —             | Composed dropdown content (`ListSection` / `ListItem` with `value`). Replaces mapped `options`.         |
| `clearable`         | `boolean`             | `true`        | Whether the value can be cleared.                                                                       |
| `defaultValue`      | `SelectModel \| null` | —             | Initial value when uncontrolled.                                                                        |
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
| `overlay`           | `FieldOverlayMode`    | `"auto"`      | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                                                    |
| `placeholder`       | `string`              | —             | Placeholder shown when no value is selected.                                                            |
| `searchable`        | `boolean`             | `true`        | Whether options can be filtered via the trigger input.                                                  |

### Binding

| Prop       | Type                           | Default | Description                                                                |
| ---------- | ------------------------------ | ------- | -------------------------------------------------------------------------- |
| `value`    | `SelectModel \| null`          | —       | The selected value (controlled). Use with `onChange` for controlled state. |
| `onChange` | `(value: SelectModel) => void` | —       | Called when the selection changes.                                         |

### Inherited from FormField

See [FormField](./FormField.md) (building-block chrome). Field tokens live on `components.Autocomplete` (`size`, `color`, `rounded`, `variant`, …). Dropdown option tokens are nested under `components.Autocomplete.tokens.listbox`.

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

Menu, Modal, Drawer, FieldOverlay, List, ListItem, ListSection, FormField
