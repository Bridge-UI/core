# NumberField

Numeric input with increment/decrement controls. Extends FormField props.

## Import

```vue
import { NumberField } from "@bridge-ui/vue/Components/NumberField";
```

## Examples

### Usage

```vue
<NumberField label="Quantity" :min="0" :max="20" :step="1" placeholder="0" />

<NumberField
  v-model="quantity"
  label="Units"
  description="Use the stepper or type a value."
/>

<NumberField
  label="Amount"
  error
  error-message="Value must be between 0 and 100."
/>
```

### Min, max, and step

```vue
<NumberField label="Items" :min="1" :max="99" :step="5" placeholder="0" />
```

### customProps

```vue
<NumberField
  label="Quantity"
  placeholder="0"
  description="Input uses name via customProps."
  :custom-props="{
    input: { name: 'demo-quantity' },
  }"
/>
```

## Props

### NumberField-specific

| Prop         | Type                 | Default | Description      |
| ------------ | -------------------- | ------- | ---------------- |
| `classes`    | `NumberFieldClasses` | —       | Per-part classes |
| `max`        | `number`             | —       | Maximum value    |
| `min`        | `number`             | —       | Minimum value    |
| `modelValue` | `number`             | —       | Bound value      |
| `step`       | `number`             | `1`     | Step increment   |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
