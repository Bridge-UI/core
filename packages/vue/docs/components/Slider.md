# Slider

Horizontal slider for selecting a single value or a range. Label, corner,
start/end slots, description, and error chrome are rendered via the shared
`BaseField` layout; tooltips and stop marks are optional.

## Import

```ts
import { Slider } from "@bridge-ui/vue/Components/Slider";
```

## Examples

### Usage

```vue
<Slider label="Volume" />

<Slider
  v-model="opacity"
  label="Opacity"
  corner="%"
  description="Adjust transparency."
/>

<Slider error label="Volume" error-message="Value is required." />
```

### Range

```vue
<Slider range v-model="range" label="Price range" />

<Slider range :default-value="[20, 80]" label="Range" />
```

### Min, max, and step

```vue
<Slider :min="0" :max="100" :step="10" label="Rating" />
```

### Colors and sizes

```vue
<Slider color="primary" label="Primary" />
<Slider color="secondary" label="Secondary" />
<Slider size="sm" label="Small" />
<Slider size="lg" label="Large" />
```

### Stops and tooltips

```vue
<Slider
  show-stops
  label="Rating"
  :stops="[
    { value: 0, label: 'Low' },
    { value: 100, label: 'High' },
  ]"
/>

<Slider :show-tooltip="false" label="Volume" />
```

### customProps

```vue
<Slider
  label="Volume"
  description="Track uses name via customProps."
  :custom-props="{
    track: { 'data-testid': 'volume-track' },
  }"
/>
```

## Props

### Slider-specific

| Prop           | Type                         | Default     | Description                                             |
| -------------- | ---------------------------- | ----------- | ------------------------------------------------------- |
| `classes`      | `SliderClasses`              | —           | Classes for the field chrome and slider control.        |
| `color`        | token                        | `"primary"` | Bar and thumb color.                                    |
| `defaultValue` | `number \| [number, number]` | min         | Initial value when `v-model` is unbound.                |
| `max`          | `number`                     | `100`       | Maximum value.                                          |
| `min`          | `number`                     | `0`         | Minimum value.                                          |
| `range`        | `boolean`                    | `false`     | Two-thumb range selection.                              |
| `rounded`      | token                        | `"full"`    | Track and bar border radius.                            |
| `showStops`    | `boolean`                    | `false`     | Render stop marks on the track.                         |
| `showTooltip`  | `boolean`                    | `true`      | Show value tooltip on each thumb while focused/hovered. |
| `size`         | token                        | `"md"`      | Track/thumb size and chrome typography.                 |
| `step`         | `number`                     | `1`         | Step increment between values.                          |
| `stops`        | `SliderStopInput[]`          | —           | Custom stop marks (numbers become `{ value }`).         |

### Binding

| Prop         | Type                         | Default | Description                |
| ------------ | ---------------------------- | ------- | -------------------------- |
| `modelValue` | `number \| [number, number]` | —       | Current value (`v-model`). |

### Field chrome

| Prop               | Type      | Default | Description                             |
| ------------------ | --------- | ------- | --------------------------------------- |
| `controlId`        | `string`  | auto    | Id for the control and related labels.  |
| `corner`           | `string`  | —       | Secondary header text.                  |
| `customProps`      | object    | —       | Extra props for internal parts.         |
| `description`      | `string`  | —       | Helper text below the control.          |
| `disabled`         | `boolean` | `false` | Disables interaction.                   |
| `error`            | `boolean` | `false` | Invalid styling.                        |
| `errorMessage`     | `string`  | —       | Error message below the control.        |
| `hideErrorMessage` | `boolean` | `false` | Hides the error message row.            |
| `label`            | `string`  | —       | Primary label above the control.        |
| `readonly`         | `boolean` | `false` | Read-only (no pointer interaction).     |
| `required`         | `boolean` | `false` | Shows a required asterisk on the label. |

## Slots

| Slot            | Description                              |
| --------------- | ---------------------------------------- |
| `#label`        | Primary label content.                   |
| `#corner`       | Secondary header text at the inline end. |
| `#description`  | Helper text below the control.           |
| `#errorMessage` | Error message below the control.         |
| `#thumb`        | Custom thumb content (replaces knob).    |

## Events

| Event               | Payload                      | Description                     |
| ------------------- | ---------------------------- | ------------------------------- |
| `change`            | `number \| [number, number]` | Emitted when the value changes. |
| `update:modelValue` | `number \| [number, number]` | Emitted for `v-model` updates.  |

## Related components

BaseField, OtpField, NumberField, Label
