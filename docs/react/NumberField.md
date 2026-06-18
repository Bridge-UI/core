# NumberField

Numeric input with increment/decrement controls. Extends FormField props.

## Import

```tsx
import { NumberField } from "@bridge-ui/react/Components/NumberField";
```

## Examples

### Usage

```tsx
<NumberField
  min={0}
  max={20}
  step={1}
  placeholder="0"
  label="Quantity"
/>

<NumberField
  label="Units"
  value={quantity}
  onChange={setQuantity}
  description="Use the stepper or type a value."
/>

<NumberField
  error
  label="Amount"
  errorMessage="Value must be between 0 and 100."
/>
```

### Min, max, and step

```tsx
<NumberField min={1} max={99} step={5} label="Items" placeholder="0" />
```

### customProps

```tsx
<NumberField
  placeholder="0"
  label="Quantity"
  description="Input uses name via customProps."
  customProps={{
    input: { name: "demo-quantity" },
  }}
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

### Binding

| Prop       | Type                      | Default | Description                                                               |
| ---------- | ------------------------- | ------- | ------------------------------------------------------------------------- |
| `value`    | `number \| string`        | —       | Input value (native attribute). Use with `onChange` for controlled state. |
| `onChange` | `(value: number) => void` | —       | Called with the numeric value when it changes.                            |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
