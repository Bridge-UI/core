# ColorField

Form field that opens a `ColorPicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props. Shows a start swatch for the selected color.

## Import

```ts
import { ColorField } from "@bridge-ui/vue/Components/ColorField";
```

## Examples

### Usage

```vue
<ColorField label="Brand color" />

<ColorField v-model="color" label="Brand" />

<ColorField error label="Color" error-message="Pick a valid color." />
```

Supports the same `overlay` prop as DateField (`menu` | `modal` | `drawer` | `auto`).
The input is read-only by default (picker only). Set `editable` to unlock typing; typed text is parsed on blur or Enter:

```vue
<ColorField editable label="Color" />
```

### Output format

```vue
<ColorField v-model="color" format="hex" label="Hex" />

<ColorField v-model="color" label="RGBA" format="rgba" />
```

### customProps

```vue
<ColorField
  label="Color"
  :custom-props="{
    input: { name: 'color' },
    colorPicker: { root: { 'data-testid': 'color-picker' } },
  }"
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
| `swatches`     | `string[]`              | —                                            | Preset colors forwarded to the nested picker.                                      |

### v-model

| Prop / Event        | Type                              | Default | Description                           |
| ------------------- | --------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `string \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: string \| null) => void` | —       | Emitted when `v-model` should update. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload                   | Description                                    |
| ------------- | ------------------------- | ---------------------------------------------- |
| `v-on:apply`  | `()`                      | Emitted when Apply is pressed (`showFooter`).  |
| `v-on:cancel` | `()`                      | Emitted when Cancel is pressed (`showFooter`). |
| `v-on:change` | `(value: string \| null)` | Emitted when the color changes.                |
| `v-on:clear`  | `()`                      | Emitted when the value is cleared.             |
| `v-on:close`  | `()`                      | Emitted when the menu closes.                  |
| `v-on:open`   | `()`                      | Emitted when the menu opens.                   |

## Related components

ColorPicker, FormField, FieldOverlay, Menu, Modal, Drawer
