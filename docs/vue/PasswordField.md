# PasswordField

Password input with visibility toggle. Extends FormField props.

## Import

```vue
import { PasswordField } from "@bridge-ui/vue/Components/PasswordField";
```

## Examples

### Usage

```vue
<PasswordField label="Password" placeholder="Enter password..." />

<PasswordField
  v-model="password"
  label="New password"
  description="Use at least 8 characters."
/>

<PasswordField label="Password" error error-message="Password is too weak." />
```

### Controlled visibility

```vue
<PasswordField
  v-model:visible="visible"
  label="Password"
  placeholder="••••••••"
  description="visible is bound to parent state."
/>
```

### customProps

```vue
<PasswordField
  label="Password"
  placeholder="••••••••"
  :custom-props="{
    input: {
      name: 'demo-password',
      autocomplete: 'new-password',
    },
  }"
/>
```

## Props

### PasswordField-specific

| Prop      | Type              | Default | Description           |
| --------- | ----------------- | ------- | --------------------- |
| `visible` | `boolean \| null` | —       | Controlled visibility |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
