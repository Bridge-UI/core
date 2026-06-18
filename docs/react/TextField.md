# TextField

Single-line text input with FormField chrome, icons, and adornments.

## Import

```tsx
import { TextField } from "@bridge-ui/react/Components/TextField";
```

## Examples

### Usage

```tsx
<TextField label="Email" placeholder="you@example.com" />

<TextField
  label="Display name"
  value={name}
  onChange={(event) => setName(event.target.value)}
  description="This is how your name will appear."
/>

<TextField
  label="Email"
  error
  errorMessage="Enter a valid email address."
/>
```

### Icons and adornments

```tsx
<TextField label="Search" startIcon={Search} placeholder="Search..." />

<TextField label="Website" start="https://" placeholder="example" />

<TextField
  label="Amount"
  end="EUR"
  placeholder="0.00"
/>
```

### Input types

```tsx
<TextField type="email" label="Email" placeholder="you@example.com" />
<TextField type="tel" label="Phone" placeholder="+351 900 000 000" />
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

TextField props are the same as [FormField](./FormField.md), plus native input attributes merged on the input element (`type`, `placeholder`, `value`, `onChange`, etc.).

## Related components

FormField, PasswordField, NumberField, Textarea, Select
