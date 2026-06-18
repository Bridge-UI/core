# FormField

Form field chrome (label, adornments, error) used by TextField, Select, and other inputs.

## Import

```tsx
import { FormField } from "@bridge-ui/react/Components/FormField";
```

## Examples

### Usage

```tsx
<FormField label="Email" description="We never share your email.">
  <input type="email" className="w-full rounded border px-3 py-2" />
</FormField>
```

### customProps

```tsx
<FormField
  label="Email"
  description="We never share your email."
  customProps={{
    root: { id: "email-field" },
    label: { id: "email-label", htmlFor: "email-input" },
    input: { id: "email-input", autoComplete: "email", name: "email" },
    description: { id: "email-desc" },
  }}
>
  <input type="email" className="w-full rounded border px-3 py-2" />
</FormField>
```

## Props

| Prop                  | Type                   | Default       | Description                   |
| --------------------- | ---------------------- | ------------- | ----------------------------- |
| `children`            | `ReactNode`            | —             | Form control slot             |
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
