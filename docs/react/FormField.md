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
    description: { id: "email-desc" },
    label: { id: "email-label", htmlFor: "email-input" },
    input: { id: "email-input", autoComplete: "email", name: "email" },
  }}
>
  <input type="email" className="w-full rounded border px-3 py-2" />
</FormField>
```

## Props

| Prop                  | Type                   | Default     | Description                                                                                                                                            |
| --------------------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`            | `ReactNode`            | —           | The form control (input, textarea, select trigger, etc.).                                                                                              |
| `classes`             | `FormFieldClasses`     | —           | Classes for the field chrome and the control (includes label, container, adornments).                                                                  |
| `color`               | `FormFieldColor`       | "primary"   | The color to apply to the field control.                                                                                                               |
| `controlId`           | `string`               | —           | Associates labels and helper text with a form control. When omitted, an id is generated automatically.                                                 |
| `corner`              | `string`               | —           | Secondary label text at the inline end of the header row.                                                                                              |
| `customProps`         | `FormFieldCustomProps` | —           | Extra props for internal parts (`header`, `label`, `input`, `container`, …).                                                                           |
| `description`         | `string`               | —           | Helper text below the control (hidden when the field is invalid).                                                                                      |
| `disabled`            | `boolean`              | `false`     | Whether the control is disabled.                                                                                                                       |
| `end`                 | `string`               | —           | Inline-end text inside the field (suffix), e.g. `@mail.com`.                                                                                           |
| `endIcon`             | `LucideIcon`           | —           | Icon at the inline end.                                                                                                                                |
| `error`               | `boolean`              | `false`     | When `true`, applies invalid styling on the label and hides description.                                                                               |
| `errorIcon`           | `LucideIcon`           | CircleAlert | Icon used when `withErrorIcon` is enabled and the field is invalid.                                                                                    |
| `errorMessage`        | `string`               | —           | Error message below the control. Shown only when set (or via `errorMessage` slot).                                                                     |
| `field`               | `UseFormFieldReturn`   | —           | Pre-composed field API from a parent composable (e.g. `useTextField`). Used by `<FormField field={…} />`; not set on field wrappers such as TextField. |
| `label`               | `string`               | —           | The primary label text above the control.                                                                                                              |
| `readonly`            | `boolean`              | `false`     | Whether the control is read-only.                                                                                                                      |
| `required`            | `boolean`              | `false`     | Shows a red asterisk on the label.                                                                                                                     |
| `rounded`             | `FormFieldRounded`     | "md"        | The roundedness of the field control.                                                                                                                  |
| `size`                | `FormFieldSize`        | "md"        | Typography scale for label, corner, description, error and control sizing.                                                                             |
| `slots`               | `FormFieldSlots`       | —           | Chrome slots (`label`, `description`, `errorMessage`, …) and adornment slots.                                                                          |
| `start`               | `string`               | —           | Inline-start text inside the field (prefix), e.g. `https://`.                                                                                          |
| `startIcon`           | `LucideIcon`           | —           | Icon at the inline start.                                                                                                                              |
| `variant`             | `FormFieldVariant`     | "outline"   | The visual variant of the field shell and control.                                                                                                     |
| `withErrorIcon`       | `boolean`              | `true`      | When `true` and the field is invalid, shows an error icon at the inline end.                                                                           |
| `withoutErrorMessage` | `boolean`              | `false`     | When `true`, does not reserve space below the control for error messages.                                                                              |

## Related components

TextField, Select, NumberField, Textarea, PasswordField
