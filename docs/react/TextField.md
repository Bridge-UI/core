# TextField

Single-line text input with FormField chrome, icons, and adornments.

## Import

```ts
import { TextField } from "@bridge-ui/react/Components/TextField";
```

## Examples

### Usage

```tsx
<TextField
  label="Email"
  placeholder="you@example.com"
/>

<TextField
  value={name}
  label="Display name"
  description="This is how your name will appear."
  onChange={(event) => setName(event.target.value)}
/>

<TextField
  error
  label="Email"
  errorMessage="Enter a valid email address."
/>
```

### Icons and adornments

```tsx
<TextField
  label="Search"
  startIcon={Search}
  placeholder="Search..."
/>

<TextField
  label="Website"
  start="https://"
  placeholder="example"
/>

<TextField
  end="EUR"
  label="Amount"
  placeholder="0.00"
/>
```

### Input types

```tsx
<TextField
  type="email"
  label="Email"
  placeholder="you@example.com"
/>

<TextField
  type="tel"
  label="Phone"
  placeholder="+351 900 000 000"
/>
```

### customProps

```tsx
<TextField
  label="Username"
  placeholder="johndoe"
  customProps={{
    input: { autoComplete: "username", name: "username" },
  }}
/>
```

## Props

Props are the same as [FormField](./FormField.md), plus native input attributes merged on the input element (`type`, `placeholder`, etc.).

### Binding

| Prop       | Type                                   | Default | Description                                            |
| ---------- | -------------------------------------- | ------- | ------------------------------------------------------ |
| `value`    | `string`                               | —       | Input value. Use with `onChange` for controlled state. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | —       | Native input change handler.                           |

## Related components

FormField, PasswordField, NumberField, Textarea, Select
