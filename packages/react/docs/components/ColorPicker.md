# ColorPicker

Inline color picker with a saturation/brightness area, hue slider, optional alpha, and preset swatches. Optional Cancel / Apply footer.

## Import

```ts
import { ColorPicker } from "@bridge-ui/react/Components/ColorPicker";
```

## Examples

### Usage

```tsx
<ColorPicker />

<ColorPicker value={color} onChange={setColor} />

<ColorPicker
  alpha
  showFooter
  format="rgba"
  value={color}
  onChange={setColor}
/>
```

### Preset swatches

```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  swatches={["#0f766e", "#2563eb", "#dc2626", "#000000"]}
/>
```

### Output format

```tsx
<ColorPicker format="hex" value={color} onChange={setColor} />

<ColorPicker format="rgb" value={color} onChange={setColor} />

<ColorPicker format="rgba" value={color} onChange={setColor} />

<ColorPicker format="hsl" value={color} onChange={setColor} />
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
| `slots`        | `ColorPickerSlots`       | —           | Named slots (`footer` for Cancel / Apply).                          |
| `swatches`     | `string[]`               | —           | Preset colors shown below the sliders.                              |
| `tokens`       | `ColorPickerTokens`      | —           | Token overrides.                                                    |
| `value`        | `string \| null`         | —           | Controlled value.                                                   |

## Events

| Callback   | Type                              | Description                                                            |
| ---------- | --------------------------------- | ---------------------------------------------------------------------- |
| `onApply`  | `() => void`                      | Called when Apply is pressed (`showFooter`).                           |
| `onCancel` | `() => void`                      | Called when Cancel is pressed.                                         |
| `onChange` | `(value: string \| null) => void` | Called when Apply is pressed (`showFooter`) or when the value commits. |

## Related components

ColorField, FormField, FieldOverlay
