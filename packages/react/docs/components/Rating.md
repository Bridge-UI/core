# Rating

Star rating field. Extends BaseField props. The value is a number from above 0 through `max`, or `null` when empty. A fraction fills the next item by that amount: `1.5` fills the first item and half of the second. `step` sets how fine a click or arrow key can be. Choosing the current value again clears it.

## Import

```ts
import { Rating } from "@bridge-ui/react/Components/Rating";
```

## Examples

### Usage

```tsx
<Rating label="Quality" />

<Rating
  name="score"
  value={score}
  label="Quality"
  onChange={setScore}
/>
```

### Read-only and scale

```tsx
<Rating max={5} readonly value={4} label="Quality" />
```

### Fractional value

```tsx
<Rating readonly value={1.5} label="Quality" />

<Rating step={0.5} label="Quality" />
```

### Required and error

```tsx
<Rating required label="Quality" />

<Rating
  error
  label="Quality"
  errorMessage="Choose a score."
/>
```

### customProps

```tsx
<Rating
  label="Quality"
  customProps={{
    input: { id: "score" },
    item: { "data-testid": "rating-item" },
  }}
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

| Prop           | Type                              | Default | Description                                                                                                                          |
| -------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `defaultValue` | `number \| null`                  | —       | Initial value for uncontrolled usage.                                                                                                |
| `onChange`     | `(value: number \| null) => void` | —       | Called with the next value. `null` means the selection was cleared.                                                                  |
| `value`        | `number \| null`                  | —       | Selected value. `null` clears the rating. A fraction fills the next item partway (`1.5` fills item 2 halfway). Pair with `onChange`. |

Hover previews the value under the pointer. Arrow keys move by `step` (horizontal arrows follow direction). Home selects the first step. End selects `max`. A move at or below the first step clears the rating.

### Inherited from BaseField

See [BaseField](./BaseField.md). `readonly` and `disabled` block changes.

## Related components

BaseField, Slider
