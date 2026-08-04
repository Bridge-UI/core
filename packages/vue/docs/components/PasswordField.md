# PasswordField

Password input with visibility toggle. Extends FormField props.

## Import

```ts
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

<PasswordField error label="Password" error-message="Password is too weak." />
```

### Controlled visibility

```vue
<PasswordField
  label="Password"
  :visible="visible"
  placeholder="••••••••"
  v-on:visibility-change="visible = $event"
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

| Prop      | Type                   | Default | Description                                                  |
| --------- | ---------------------- | ------- | ------------------------------------------------------------ |
| `classes` | `PasswordFieldClasses` | —       | The classes to apply to the password field.                  |
| `visible` | `boolean \| null`      | —       | Whether the password is visible. Omit for uncontrolled mode. |

### v-model

| Prop / Event        | Type                              | Default | Description                                                                  |
| ------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `string \| null`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: string \| null) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Event                    | Payload              | Description                               |
| ------------------------ | -------------------- | ----------------------------------------- |
| `v-on:visibility-change` | `(visible: boolean)` | Emitted when password visibility changes. |

## Related components

TextField, FormField
