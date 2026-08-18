# ColorPicker

Inline color picker with a saturation/brightness area, hue slider, optional alpha, and preset swatches. Optional Cancel / Apply footer.

## Import

```ts
import { ColorPicker } from "@bridge-ui/vue/Components/ColorPicker";
```

## Examples

### Usage

```vue
<ColorPicker />

<ColorPicker :value="color" v-on:change="color = $event" />

<ColorPicker
  alpha
  show-footer
  format="rgba"
  :value="color"
  v-on:change="color = $event"
/>
```

### Preset swatches

```vue
<ColorPicker
  :value="color"
  :swatches="['#0f766e', '#2563eb', '#dc2626', '#000000']"
  v-on:change="color = $event"
/>
```

### Output format

```vue
<ColorPicker format="hex" :value="color" v-on:change="color = $event" />

<ColorPicker format="rgb" :value="color" v-on:change="color = $event" />

<ColorPicker format="rgba" :value="color" v-on:change="color = $event" />
```

## Props

| Prop           | Type                     | Default     | Description                                                         |
| -------------- | ------------------------ | ----------- | ------------------------------------------------------------------- |
| `alpha`        | `boolean`                | —           | Shows the alpha slider. Unset: `true` for `hexa` / `rgba` / `hsla`. |
| `classes`      | `ColorPickerClasses`     | —           | Classes for picker regions.                                         |
| `color`        | `ColorPickerColor`       | `"primary"` | Accent color for selected swatches.                                 |
| `customProps`  | `ColorPickerCustomProps` | —           | Extra props for internal parts.                                     |
| `defaultValue` | `string \| null`         | `null`      | Uncontrolled initial value.                                         |
| `disabled`     | `boolean`                | `false`     | Disables the picker.                                                |
| `error`        | `boolean`                | `false`     | Invalid state. Preset swatches still use `color`.                   |
| `fill`         | `boolean`                | `false`     | Fills the container width.                                          |
| `format`       | `ColorFormat`            | `"hex"`     | Serialized output: `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla`.     |
| `readOnly`     | `boolean`                | `false`     | Prevents selection.                                                 |
| `rounded`      | `ColorPickerRounded`     | `"md"`      | Border radius of the picker shell and swatches.                     |
| `showFooter`   | `boolean`                | `false`     | Shows Cancel / Apply. Selection is draft until Apply.               |
| `swatches`     | `string[]`               | —           | Preset colors shown below the sliders.                              |
| `tokens`       | `ColorPickerTokens`      | —           | Token overrides.                                                    |
| `value`        | `string \| null`         | —           | Controlled value.                                                   |

## Events

| Event         | Payload                   | Description                                                             |
| ------------- | ------------------------- | ----------------------------------------------------------------------- |
| `v-on:apply`  | `()`                      | Emitted when Apply is pressed (`showFooter`).                           |
| `v-on:cancel` | `()`                      | Emitted when Cancel is pressed.                                         |
| `v-on:change` | `(value: string \| null)` | Emitted when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

ColorField, FormField, FieldOverlay
