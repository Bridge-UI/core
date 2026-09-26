# Rating

Star rating field. Extends BaseField props. The value is a number from above 0 through `max`, or `null` when empty. A fraction fills the next item by that amount: `1.5` fills the first item and half of the second. `step` sets how fine a click or arrow key can be. Choosing the current value again clears it.

## Import

```ts
import { Rating } from "@bridge-ui/vue/Components/Rating";
```

## Examples

### Usage

```vue
<Rating label="Quality" />

<Rating name="score" v-model="score" label="Quality" />
```

### Read-only and scale

```vue
<Rating readonly :max="5" label="Quality" :model-value="4" />
```

### Fractional value

```vue
<Rating readonly label="Quality" :model-value="1.5" />

<Rating :step="0.5" label="Quality" />
```

### Required and error

```vue
<Rating required label="Quality" />

<Rating error label="Quality" error-message="Choose a score." />
```

### customProps

```vue
<Rating
  label="Quality"
  :custom-props="{
    input: { id: 'score' },
    item: { 'data-testid': 'rating-item' },
  }"
/>
```

## Props

### Rating-specific

| Prop          | Type                | Default   | Description                                                            |
| ------------- | ------------------- | --------- | ---------------------------------------------------------------------- |
| `classes`     | `RatingClasses`     | —         | Classes for the field chrome and the rating parts.                     |
| `color`       | `RatingColor`       | "primary" | The color applied to selected icons.                                   |
| `customProps` | `RatingCustomProps` | —         | Extra props for internal parts.                                        |
| `icon`        | `IconSource`        | "star"    | Icon used for every item.                                              |
| `max`         | `number`            | `5`       | Number of items. The value runs from above 0 through `max`.            |
| `name`        | `string`            | —         | The `name` of the hidden input submitted with the form.                |
| `rounded`     | `RatingRounded`     | "sm"      | Roundedness of each item hit area.                                     |
| `size`        | `RatingSize`        | "md"      | Size of the icons and of the field label (`2xs` … `2xl`).              |
| `slots`       | `RatingSlots`       | —         | Chrome slots.                                                          |
| `step`        | `number`            | `1`       | Increment for pointer and keyboard selection. `0.5` selects each half. |

### Binding

| Prop           | Type             | Default | Description                                                                                                    |
| -------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `defaultValue` | `number \| null` | —       | Initial value for uncontrolled usage.                                                                          |
| `modelValue`   | `number \| null` | —       | Selected value. `null` clears the rating. A fraction fills the next item partway (`1.5` fills item 2 halfway). |

Hover previews the value under the pointer. Arrow keys move by `step` (horizontal arrows follow direction). Home selects the first step. End selects `max`. A move at or below the first step clears the rating.

### Inherited from BaseField

See [BaseField](./BaseField.md). `readonly` and `disabled` block changes.

## Related components

BaseField, Slider
