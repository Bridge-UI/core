# FormField

Form field chrome (label, adornments, error) used by TextField, Select, and other inputs.

## Import

```vue
import { FormField } from "@bridge-ui/vue/Components/FormField";
```

## Examples

### Usage

```vue
<FormField label="Email" description="We never share your email.">
  <input type="email" class="w-full rounded border px-3 py-2" />
</FormField>
```

### customProps

```vue
<FormField
  label="Email"
  description="We never share your email."
  :custom-props="{
    root: { id: 'email-field' },
    label: { id: 'email-label', for: 'email-input' },
    input: { id: 'email-input', autocomplete: 'email', name: 'email' },
    description: { id: 'email-desc' },
  }"
>
  <input type="email" class="w-full rounded border px-3 py-2" />
</FormField>
```

## Props

| Prop                  | Type                   | Default       | Description                   |
| --------------------- | ---------------------- | ------------- | ----------------------------- |
| default slot          | —                      | —             | Form control slot             |
| `classes`             | `FormFieldClasses`     | —             | Per-part class overrides      |
| `color`               | `Color`                | `"primary"`   | Accent color                  |
| `controlId`           | `string`               | —             | Associated control id         |
| `corner`              | `string`               | —             | Corner hint (e.g. "Optional") |
| `customProps`         | `FormFieldCustomProps` | —             | HTML props per internal part  |
| `description`         | `string`               | —             | Helper text below the field   |
| `disabled`            | `boolean`              | `false`       | Disabled state                |
| `end`                 | `string`               | —             | Inline-end text adornment     |
| `endIcon`             | `LucideIcon`           | —             | Icon at the inline end        |
| `error`               | `boolean`              | `false`       | Error state                   |
| `errorIcon`           | `LucideIcon`           | `CircleAlert` | Error icon when invalid       |
| `errorMessage`        | `string`               | —             | Error message                 |
| `label`               | `string`               | —             | Field label                   |
| `readonly`            | `boolean`              | `false`       | Read-only state               |
| `required`            | `boolean`              | `false`       | Required field                |
| `rounded`             | `Rounded`              | `"md"`        | Border radius                 |
| `size`                | `Size`                 | `"md"`        | Field size                    |
| `slots`               | `FormFieldSlots`       | —             | Custom slot content           |
| `start`               | `string`               | —             | Inline-start text adornment   |
| `startIcon`           | `LucideIcon`           | —             | Icon at the inline start      |
| `variant`             | `FormFieldVariant`     | `"outline"`   | Visual variant                |
| `withErrorIcon`       | `boolean`              | `true`        | Show error icon when `error`  |
| `withoutErrorMessage` | `boolean`              | `false`       | Hide error message row        |

## Related components

TextField, Select, NumberField, Textarea, PasswordField
