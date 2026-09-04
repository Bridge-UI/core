# BaseField

> Building block for composite field chrome. Prefer `OtpField` / `Slider` in apps; BaseField remains exported for advanced composition. Not a registry key — theme chrome via `tokens.baseField` on the public parent (e.g. `components.Slider.tokens.baseField`).

Shared vertical field chrome (label, corner, start/end slots, description,
error message) for OtpField, Slider, and similar controls.

Control tokens stay on the parent (`tokens.size`, …).

## Import

```ts
import { BaseField, useBaseField } from "@bridge-ui/vue";
```

## Examples

### Usage

Compose with `useBaseField` and pass the returned API as `:field`:

```vue
<script setup lang="ts">
import { BaseField, useBaseField } from "@bridge-ui/vue";

const field = useBaseField(() => ({
  label: "Verification code",
  description: "Enter the code from your email.",
}));
</script>

<template>
  <BaseField :field="field">
    <input type="text" aria-label="Code" />
  </BaseField>
</template>
```

### Label and corner

```vue
<BaseField
  :field="
    useBaseField(() => ({
      label: 'Amount',
      corner: 'Optional',
    }))
  "
>
  <input type="number" aria-label="Amount" />
</BaseField>
```

### Adornment slots

```vue
<BaseField :field="useBaseField(() => ({ label: 'Code' }))">
  <template #start>
    <Lock aria-hidden="true" />
  </template>

  <input type="text" aria-label="Code" />

  <template #end>
    <button type="button">Resend</button>
  </template>
</BaseField>
```

### Error state

```vue
<BaseField
  :field="
    useBaseField(() => ({
      error: true,
      label: 'Email',
      errorMessage: 'Invalid email address.',
    }))
  "
>
  <input type="email" aria-label="Email" />
</BaseField>
```

### customProps

```vue
<BaseField
  :field="
    useBaseField(() => ({
      label: 'Email',
      description: 'We never share your email.',
      customProps: {
        group: { 'data-testid': 'email-group' },
      },
    }))
  "
>
  <input type="email" aria-label="Email" />
</BaseField>
```

## Props

| Prop                     | Type                   | Default | Description                                                                                                                        |
| ------------------------ | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `classes`                | `BaseFieldClasses`     | —       | Classes for the field chrome and control group layout.                                                                             |
| `controlId`              | `string`               | auto    | Id for the control group and related labels.                                                                                       |
| `corner`                 | `string`               | —       | Secondary header text at the inline end.                                                                                           |
| `customProps`            | `BaseFieldCustomProps` | —       | Extra props for internal parts (`root`, `group`, `label`, …).                                                                      |
| `description`            | `string`               | —       | Helper text below the control group. Hidden when `error` and an error message are set, unless `showDescriptionOnError`.            |
| `disabled`               | `boolean`              | `false` | Disables the field control group.                                                                                                  |
| `error`                  | `boolean`              | `false` | Invalid styling on the label and control group. Hides description when an error message is shown, unless `showDescriptionOnError`. |
| `errorMessage`           | `string`               | —       | Error message below the control group.                                                                                             |
| `field`                  | `UseBaseFieldReturn`   | —       | Pre-composed field chrome API from `useBaseField`. Used by `<BaseField :field="…" />`.                                             |
| `hideErrorMessage`       | `boolean`              | `false` | When `true`, does not reserve the error row. That row is also omitted while a description is shown.                                |
| `label`                  | `string`               | —       | Primary label above the control group.                                                                                             |
| `readonly`               | `boolean`              | `false` | Read-only field control group.                                                                                                     |
| `required`               | `boolean`              | `false` | Shows a required asterisk on the label.                                                                                            |
| `showDescriptionOnError` | `boolean`              | `false` | When `true`, keeps the description visible while the field is invalid.                                                             |
| `size`                   | `BaseFieldSize`        | `"md"`  | Label typography and control group gap scale.                                                                                      |
| `slots`                  | `BaseFieldSlots`       | —       | `#label`, `#corner`, `#description`, `#errorMessage`, `#start`, `#end`, and default control.                                       |

## Related components

OtpField, Slider, Label
