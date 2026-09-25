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

<ColorPicker v-model="color" />

<ColorPicker alpha show-footer format="rgba" v-model="color" />
```

### Preset swatches

```vue
<ColorPicker
  v-model="color"
  :swatches="['#0f766e', '#2563eb', '#dc2626', '#000000']"
/>
```

### Output format

```vue
<ColorPicker format="hex" v-model="color" />

<ColorPicker format="rgb" v-model="color" />

<ColorPicker format="rgba" v-model="color" />
```

## Props

| Prop           | Type                     | Default | Description                                                         |
| -------------- | ------------------------ | ------- | ------------------------------------------------------------------- |
| `alpha`        | `boolean`                | —       | Shows the alpha slider. Unset: `true` for `hexa` / `rgba` / `hsla`. |
| `classes`      | `ColorPickerClasses`     | —       | Classes for picker regions.                                         |
| `customProps`  | `ColorPickerCustomProps` | —       | Extra props for internal parts.                                     |
| `defaultValue` | `string \| null`         | `null`  | Uncontrolled initial value.                                         |
| `disabled`     | `boolean`                | `false` | Disables the picker.                                                |
| `fill`         | `boolean`                | `false` | Fills the container width.                                          |
| `format`       | `ColorFormat`            | `"hex"` | Serialized output: `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla`.     |
| `readOnly`     | `boolean`                | `false` | Prevents selection.                                                 |
| `rounded`      | `ColorPickerRounded`     | `"md"`  | Border radius of the picker shell and swatches.                     |
| `showFooter`   | `boolean`                | `false` | Shows Cancel / Apply. Selection is draft until Apply.               |
| `swatches`     | `string[]`               | —       | Preset colors shown below the sliders.                              |

### v-model

| Prop / Event        | Type                              | Default | Description                           |
| ------------------- | --------------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `string \| null`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: string \| null) => void` | —       | Emitted when `v-model` should update. |

Picker tokens live on `components.ColorPicker` (`rounded`, `size`).

## Events

| Event         | Payload                   | Description                                                             |
| ------------- | ------------------------- | ----------------------------------------------------------------------- |
| `v-on:apply`  | `()`                      | Emitted when Apply is pressed (`showFooter`).                           |
| `v-on:cancel` | `()`                      | Emitted when Cancel is pressed.                                         |
| `v-on:change` | `(value: string \| null)` | Emitted when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

ColorField, FormField, FieldOverlay, ActionFooter
