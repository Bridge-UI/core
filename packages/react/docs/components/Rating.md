# Rating

Star rating field. Extends FormControl props. The value is an integer from 1 through `max`, or `null` when empty. Choosing the current value clears it.

## Import

```ts
import { Rating } from "@bridge-ui/react/Components/Rating";
```

## Examples

### Usage

```tsx
<Rating endLabel="Quality" />

<Rating
  name="score"
  value={score}
  endLabel="Quality"
  onChange={setScore}
/>
```

### Read-only and scale

```tsx
<Rating max={5} readonly value={4} endLabel="Quality" />
```

### Required and error

```tsx
<Rating required endLabel="Quality" />

<Rating
  error
  endLabel="Quality"
  errorMessage="Choose a score."
/>
```

### customProps

```tsx
<Rating
  endLabel="Quality"
  customProps={{
    input: { id: "score" },
    item: { "data-testid": "rating-item" },
  }}
/>
```

## Props

### Rating-specific

| Prop          | Type                | Default   | Description                                                          |
| ------------- | ------------------- | --------- | -------------------------------------------------------------------- |
| `classes`     | `RatingClasses`     | —         | Classes for the form control chrome and the rating parts.           |
| `color`       | `RatingColor`       | "primary" | The color applied to selected icons.                                 |
| `customProps` | `RatingCustomProps` | —         | Extra props for internal parts.                                      |
| `icon`        | `IconSource`        | "star"    | Icon used for every item.                                            |
| `max`         | `number`            | `5`       | Number of items. Values are integers from 1 through `max`.           |
| `name`        | `string`            | —         | The `name` of the hidden input submitted with the form.             |
| `rounded`     | `RatingRounded`     | "sm"      | Roundedness of each item hit area.                                   |
| `size`        | `RatingSize`        | "md"      | Size of the icons and of form control labels (`2xs` … `2xl`).        |
| `slots`       | `RatingSlots`       | —         | Chrome slots.                                                         |

### Binding

| Prop           | Type                       | Default | Description                                                                 |
| -------------- | -------------------------- | ------- | --------------------------------------------------------------------------- |
| `defaultValue` | `number \| null`           | —       | Initial value for uncontrolled usage.                                       |
| `onChange`     | `(value: number \| null) => void` | — | Called with the next value. `null` means the selection was cleared.         |
| `value`        | `number \| null`           | —       | Selected value. `null` clears the rating. Pair with `onChange`.             |

Hover previews the value under the pointer. Arrow keys change it (horizontal arrows follow direction). Home selects 1. End selects `max`. Moving below 1 clears the rating.

### Inherited from FormControl

See [FormControl](./FormControl.md). `readonly` and `disabled` block changes.

## Related components

FormControl, Radio
