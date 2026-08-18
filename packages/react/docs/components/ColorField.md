# ColorField

Form field that opens a `ColorPicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props. Shows a start swatch for the selected color.

## Import

```ts
import { ColorField } from "@bridge-ui/react/Components/ColorField";
```

## Examples

### Usage

```tsx
<ColorField label="Brand color" />

<ColorField
  label="Brand"
  value={color}
  onChange={setColor}
/>

<ColorField
  error
  label="Color"
  errorMessage="Pick a valid color."
/>
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).
The input is read-only by default (picker only). Set `editable` to unlock typing; typed text is parsed on blur or Enter:

```tsx
<ColorField editable label="Color" />
```

### Output format

```tsx
<ColorField label="Hex" format="hex" value={color} onChange={setColor} />

<ColorField
  label="RGBA"
  format="rgba"
  value={color}
  onChange={setColor}
/>
```

### customProps

```tsx
<ColorField
  label="Color"
  customProps={{
    input: { name: "color" },
    colorPicker: { root: { "data-testid": "color-picker" } },
  }}
/>
```

## Props

### ColorField-specific

| Prop           | Type                    | Default                                      | Description                                                                        |
| -------------- | ----------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `alpha`        | `boolean`               | —                                            | Shows the alpha slider. Unset: `true` for `hexa` / `rgba` / `hsla`.                |
| `classes`      | `ColorFieldClasses`     | —                                            | Classes for field / input regions.                                                 |
| `clearable`    | `boolean`               | `true`                                       | Whether the value can be cleared.                                                  |
| `customProps`  | `ColorFieldCustomProps` | —                                            | Extra props for internal parts.                                                    |
| `defaultValue` | `string \| null`        | `null`                                       | Uncontrolled initial value.                                                        |
| `editable`     | `boolean`               | `false`                                      | Unlocks the input. Typed text is parsed on blur or Enter.                          |
| `fill`         | `boolean`               | —                                            | Fills the overlay width. Unset: `true` for `drawer`, `false` for `menu` / `modal`. |
| `format`       | `ColorFormat`           | `"hex"`                                      | Serialized output: `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla`.                    |
| `overlay`      | `FieldOverlayMode`      | `"auto"`                                     | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                               |
| `showFooter`   | `boolean`               | `false` (`true` for modal/drawer when unset) | Shows Cancel / Apply on the nested picker.                                         |
| `showSwatch`   | `boolean`               | `true`                                       | Shows the selected color at the start of the field.                                |
| `slots`        | `ColorFieldSlots`       | —                                            | Named slots (`FormField` slots + footer).                                          |
| `swatches`     | `string[]`              | —                                            | Preset colors forwarded to the nested picker.                                      |
| `value`        | `string \| null`        | —                                            | Controlled value.                                                                  |

### Binding

| Prop       | Type                              | Default | Description                            |
| ---------- | --------------------------------- | ------- | -------------------------------------- |
| `value`    | `string \| null`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: string \| null) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                              | Description                                   |
| ---------- | --------------------------------- | --------------------------------------------- |
| `onApply`  | `() => void`                      | Called when Apply is pressed (`showFooter`).  |
| `onCancel` | `() => void`                      | Called when Cancel is pressed (`showFooter`). |
| `onChange` | `(value: string \| null) => void` | Called when the color changes.                |
| `onClear`  | `() => void`                      | Called when the value is cleared.             |
| `onClose`  | `() => void`                      | Called when the menu closes.                  |
| `onOpen`   | `() => void`                      | Called when the menu opens.                   |

## Related components

ColorPicker, FormField, FieldOverlay, Menu, Modal, Drawer
