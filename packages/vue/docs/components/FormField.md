# FormField

> Building block for field chrome. Prefer public fields (`TextField`, `Select`, …) in apps; FormField remains exported for advanced composition. Not a `BridgeUIComponentsConfig` key — theme via the public parent (`components.TextField`, `components.Select`, …).

Form field chrome (label, adornments, error) used by TextField, Select, and other inputs.

## Import

```ts
import { FormField } from "@bridge-ui/vue";
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
    description: { id: 'email-desc' },
    label: { id: 'email-label', for: 'email-input' },
    input: { id: 'email-input', autocomplete: 'email', name: 'email' },
  }"
>
  <input type="email" class="w-full rounded border px-3 py-2" />
</FormField>
```

## Props

| Prop                     | Type                   | Default     | Description                                                                                                                                             |
| ------------------------ | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `classes`                | `FormFieldClasses`     | —           | Classes for the field chrome and the control (includes label, container, adornments).                                                                   |
| `color`                  | `FormFieldColor`       | "primary"   | The color to apply to the field control.                                                                                                                |
| `controlId`              | `string`               | —           | Associates labels and helper text with a form control. When omitted, an id is generated automatically.                                                  |
| `corner`                 | `string`               | —           | Secondary label text at the inline end of the header row.                                                                                               |
| `customProps`            | `FormFieldCustomProps` | —           | Extra props for internal parts (`header`, `label`, `input`, `container`, …).                                                                            |
| `description`            | `string`               | —           | Helper text below the control. Hidden when `error` and an error message are set, unless `showDescriptionOnError`.                                       |
| `disabled`               | `boolean`              | `false`     | Whether the control is disabled.                                                                                                                        |
| `end`                    | `string`               | —           | Inline-end text inside the field (suffix), e.g. `@mail.com`.                                                                                            |
| `endIcon`                | `LucideIcon`           | —           | Icon at the **inline end** (physical right in `ltr`, physical left in `rtl`).                                                                           |
| `error`                  | `boolean`              | `false`     | When `true`, applies invalid styling on the label. Hides description when an error message is shown, unless `showDescriptionOnError`.                   |
| `errorIcon`              | `LucideIcon`           | CircleAlert | Icon used when `showErrorIcon` is enabled and the field is invalid.                                                                                     |
| `errorMessage`           | `string`               | —           | Error message below the control. Shown only when set (or via `#errorMessage` slot).                                                                     |
| `field`                  | `UseFormFieldReturn`   | —           | Pre-composed field API from a parent composable (e.g. `useTextField`). Used by `<FormField :field="…" />`; not set on field wrappers such as TextField. |
| `hideErrorMessage`       | `boolean`              | `false`     | When `true`, does not reserve space below the control for error messages.                                                                               |
| `label`                  | `string`               | —           | The primary label text above the control.                                                                                                               |
| `readonly`               | `boolean`              | `false`     | Whether the control is read-only.                                                                                                                       |
| `required`               | `boolean`              | `false`     | Shows a red asterisk on the label.                                                                                                                      |
| `rounded`                | `FormFieldRounded`     | "md"        | The roundedness of the field control.                                                                                                                   |
| `showDescriptionOnError` | `boolean`              | `false`     | When `true`, keeps the description visible while the field is invalid.                                                                                  |
| `showErrorIcon`          | `boolean`              | `true`      | When `true` and the field is invalid, shows an error icon at the inline end when no `endIcon` or `end` slot is present.                                 |
| `size`                   | `FormFieldSize`        | "md"        | Typography scale for label, corner, description, and error message, and control sizing (input, container, icons).                                       |
| `slots`                  | `FormFieldSlots`       | —           | Chrome slots (`label`, `description`, `errorMessage`, …) via `#slot` or prop; inline adornments use `#start` / `#end`.                                  |
| `start`                  | `string`               | —           | Inline-start text inside the field (prefix), e.g. `https://`.                                                                                           |
| `startIcon`              | `LucideIcon`           | —           | Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`).                                                                         |
| `variant`                | `FormFieldVariant`     | "outline"   | The visual variant of the field shell and control.                                                                                                      |

## Related components

TextField, Select, NumberField, Textarea, PasswordField
