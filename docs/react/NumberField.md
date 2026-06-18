# NumberField

Numeric input with increment/decrement controls. Extends FormField props.

## Import

```tsx
import { NumberField } from "@bridge-ui/react/Components/NumberField";
```

## Examples

### Usage

```tsx
<NumberField label="Quantity" min={0} max={20} step={1} placeholder="0" />

<NumberField
  label="Units"
  value={quantity}
  onChange={setQuantity}
  description="Use the stepper or type a value."
/>

<NumberField
  label="Amount"
  error
  errorMessage="Value must be between 0 and 100."
/>
```

### Min, max, and step

```tsx
<NumberField label="Items" min={1} max={99} step={5} placeholder="0" />
```

### customProps

```tsx
<NumberField
  label="Quantity"
  placeholder="0"
  description="Input uses name via customProps."
  customProps={{
    input: { name: "demo-quantity" },
  }}
/>
```

## Props

### NumberField-specific

| Prop       | Type                      | Default | Description          |
| ---------- | ------------------------- | ------- | -------------------- |
| `classes`  | `NumberFieldClasses`      | —       | Per-part classes     |
| `max`      | `number`                  | —       | Maximum value        |
| `min`      | `number`                  | —       | Minimum value        |
| `onChange` | `(value: number) => void` | —       | Value change (React) |
| `step`     | `number`                  | `1`     | Step increment       |
| `value`    | `number`                  | —       | Controlled value     |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
