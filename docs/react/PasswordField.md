# PasswordField

Password input with visibility toggle. Extends FormField props.

## Import

```tsx
import { PasswordField } from "@bridge-ui/react/Components/PasswordField";
```

## Examples

### Usage

```tsx
<PasswordField label="Password" placeholder="Enter password..." />

<PasswordField
  label="New password"
  value={password}
  onChange={(event) => setPassword(event.target.value)}
  description="Use at least 8 characters."
/>

<PasswordField
  label="Password"
  error
  errorMessage="Password is too weak."
/>
```

### Controlled visibility

```tsx
<PasswordField
  label="Password"
  visible={visible}
  placeholder="••••••••"
  onVisibilityChange={setVisible}
  description="visible prop is bound to parent state."
/>
```

### customProps

```tsx
<PasswordField
  label="Password"
  placeholder="••••••••"
  customProps={{
    input: {
      name: "demo-password",
      autoComplete: "new-password",
    },
  }}
/>
```

## Props

### PasswordField-specific

| Prop                 | Type                         | Default | Description           |
| -------------------- | ---------------------------- | ------- | --------------------- |
| `visible`            | `boolean \| null`            | —       | Controlled visibility |
| `onVisibilityChange` | `(visible: boolean) => void` | —       | Toggle callback       |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
