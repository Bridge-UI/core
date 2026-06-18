# TextField

Single-line text input with FormField chrome, icons, and adornments.

## Import

```ts
import { TextField } from "@bridge-ui/vue/Components/TextField";
```

## Examples

### Usage

```vue
<TextField label="Email" placeholder="you@example.com" />

<TextField
  v-model="name"
  label="Display name"
  description="This is how your name will appear."
/>

<TextField label="Email" error error-message="Enter a valid email address." />
```

### Icons and adornments

```vue
<TextField label="Search" :start-icon="Search" placeholder="Search..." />

<TextField label="Website" start="https://" placeholder="example" />

<TextField end="EUR" label="Amount" placeholder="0.00" />
```

### Input types

```vue
<TextField type="email" label="Email" placeholder="you@example.com" />

<TextField type="tel" label="Phone" placeholder="+351 900 000 000" />
```

### customProps

```vue
<TextField
  label="Username"
  placeholder="johndoe"
  :custom-props="{
    input: { autocomplete: 'username', name: 'username' },
  }"
/>
```

## Props

### v-model

| Prop / Event        | Type                              | Default | Description                                                                  |
| ------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `string \| null`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: string \| null) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

FormField, PasswordField, NumberField, Textarea, Select
