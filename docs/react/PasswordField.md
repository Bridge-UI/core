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

| Prop      | Type                   | Default | Description                                                  |
| --------- | ---------------------- | ------- | ------------------------------------------------------------ |
| `classes` | `PasswordFieldClasses` | —       | The classes to apply to the password field.                  |
| `visible` | `boolean \| null`      | —       | Whether the password is visible. Omit for uncontrolled mode. |

### Binding

| Prop       | Type                                   | Default | Description                                            |
| ---------- | -------------------------------------- | ------- | ------------------------------------------------------ |
| `value`    | `string`                               | —       | Input value. Use with `onChange` for controlled state. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | —       | Native input change handler.                           |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback             | Payload              | Description                              |
| -------------------- | -------------------- | ---------------------------------------- |
| `onVisibilityChange` | `(visible: boolean)` | Called when password visibility changes. |

## Related components

TextField, FormField
