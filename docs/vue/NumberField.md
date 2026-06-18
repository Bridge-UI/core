# NumberField

Numeric input with increment/decrement controls. Extends FormField props.

## Import

```vue
import { NumberField } from "@bridge-ui/vue/Components/NumberField";
```

## Examples

### Usage

```vue
<NumberField :min="0" :max="20" :step="1" placeholder="0" label="Quantity" />

<NumberField
  label="Units"
  v-model="quantity"
  description="Use the stepper or type a value."
/>

<NumberField
  error
  label="Amount"
  error-message="Value must be between 0 and 100."
/>
```

### Min, max, and step

```vue
<NumberField :min="1" :max="99" :step="5" label="Items" placeholder="0" />
```

### customProps

```vue
<NumberField
  placeholder="0"
  label="Quantity"
  description="Input uses name via customProps."
  :custom-props="{
    input: { name: 'demo-quantity' },
  }"
/>
```

## Props

### NumberField-specific

| Prop      | Type                 | Default | Description                               |
| --------- | -------------------- | ------- | ----------------------------------------- |
| `classes` | `NumberFieldClasses` | —       | The classes to apply to the number field. |
| `max`     | `number`             | —       | The maximum value.                        |
| `min`     | `number`             | —       | The minimum value.                        |
| `step`    | `number`             | 1       | The step increment value.                 |

### v-model

| Prop / Event        | Type                              | Default | Description                                                                  |
| ------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `number \| null`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: number \| null) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event         | Payload           | Description                                     |
| ------------- | ----------------- | ----------------------------------------------- |
| `v-on:change` | `(value: number)` | Emitted with the numeric value when it changes. |

## Related components

TextField, FormField
