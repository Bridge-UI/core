# Slider

Input control for selecting a numeric value or range. Label, corner, start/end
slots, description, and error chrome are rendered via the shared `BaseField`
layout. Optional value Tooltip on each thumb.

## Import

```ts
import { Slider } from "@bridge-ui/react/Components/Slider";
```

## Examples

### Usage

```tsx
<Slider label="Volume" />

<Slider
  max={100}
  step={5}
  label="Opacity"
  defaultValue={40}
  description="Adjust transparency."
/>
```

### Controlled

```tsx
<Slider value={volume} label="Volume" onChange={setVolume} />
```

### Range

```tsx
<Slider
  range
  label="Price"
  defaultValue={[20, 80]}
  onChange={(value) => setPrice(value)}
/>
```

### Without tooltip

```tsx
<Slider showTooltip={false} label="Brightness" />
```

### Stops

```tsx
<Slider
  showStops
  label="Rating"
  stops={[
    { value: 0, label: "Low" },
    { value: 50, label: "Mid" },
    { value: 100, label: "High" },
  ]}
/>
```

### Error

```tsx
<Slider error label="Volume" errorMessage="Choose a value." />
```

## Props

| Prop               | Type                                                 | Default     | Description                                   |
| ------------------ | ---------------------------------------------------- | ----------- | --------------------------------------------- |
| `classes`          | `SliderClasses`                                      | —           | Classes for chrome and slider parts.          |
| `color`            | `SliderColor`                                        | `"primary"` | Color of the bar and thumbs.                  |
| `controlId`        | `string`                                             | —           | Id for labels / helper text association.      |
| `corner`           | `string`                                             | —           | Secondary header text.                        |
| `customProps`      | `SliderCustomProps`                                  | —           | Extra props for internal parts.               |
| `defaultValue`     | `number \| [number, number]`                         | `min`       | Uncontrolled initial value.                   |
| `description`      | `string`                                             | —           | Helper text below the control.                |
| `disabled`         | `boolean`                                            | `false`     | Disables interaction.                         |
| `error`            | `boolean`                                            | `false`     | Invalid styling.                              |
| `errorMessage`     | `string`                                             | —           | Error text below the control.                 |
| `hideErrorMessage` | `boolean`                                            | `false`     | Do not reserve error message space.           |
| `label`            | `string`                                             | —           | Primary label above the control.              |
| `max`              | `number`                                             | `100`       | Maximum value.                                |
| `min`              | `number`                                             | `0`         | Minimum value.                                |
| `onChange`         | `(value: number \| [number, number]) => void`        | —           | Called when the value changes.                |
| `range`            | `boolean`                                            | `false`     | Enables two thumbs for a range.               |
| `readonly`         | `boolean`                                            | `false`     | Prevents interaction.                         |
| `required`         | `boolean`                                            | `false`     | Shows a required asterisk on the label.       |
| `rounded`          | `SliderRounded`                                      | `"full"`    | Border radius of the track and bar.           |
| `showStops`        | `boolean`                                            | `false`     | Renders stop marks (`stops` or every `step`). |
| `showTooltip`      | `boolean`                                            | `true`      | Shows a Tooltip with the thumb value.         |
| `size`             | `SliderSize`                                         | `"md"`      | Track / thumb size and chrome typography.     |
| `slots`            | `SliderSlots`                                        | —           | Chrome and thumb slots.                       |
| `step`             | `number`                                             | `1`         | Step increment.                               |
| `stops`            | `Array<number \| { value: number; label?: string }>` | —           | Custom stop marks.                            |
| `value`            | `number \| [number, number]`                         | —           | Controlled value.                             |

## Related components

BaseField, OtpField, Tooltip, Progress, Label
