# BaseField

> Building block for composite field chrome. Prefer `OtpField` / `Slider` in apps; BaseField remains exported for advanced composition. Not a registry key — theme chrome via `tokens.baseField` on the public parent (e.g. `components.Slider.tokens.baseField`).

Shared field chrome (label, corner, start/end slots, description, error) for composite inputs such as `OtpField` and `Slider`.

Control tokens stay on the parent (`tokens.size`, …).

## Import

```ts
import { BaseField, useBaseField } from "@bridge-ui/react";
```

## Examples

### Usage

Compose the hook in a parent component, then pass the API to `BaseField`:

```tsx
function MyField(props: MyFieldProps) {
  const field = useBaseField(props);

  return (
    <BaseField field={field}>
      <input type="text" />
    </BaseField>
  );
}
```

### With label, description, and slots

```tsx
const field = useBaseField({
  label: "Amount",
  corner: "USD",
  description: "Enter a value between 0 and 100.",
  slots: { start: <Icon icon="dollar-sign" /> },
});

<BaseField field={field}>
  <input type="number" />
</BaseField>;
```

## Props

Props are consumed by `useBaseField`. `<BaseField />` accepts `field` (the hook return) and `children`.

| Prop               | Type                   | Default | Description                                                                                               |
| ------------------ | ---------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `children`         | `ReactNode`            | —       | Control content rendered inside the group (between start/end slots).                                      |
| `classes`          | `BaseFieldClasses`     | —       | Classes for the field chrome and group layout.                                                            |
| `controlId`        | `string`               | —       | Associates labels and helper text with the control group. When omitted, an id is generated automatically. |
| `corner`           | `string`               | —       | Secondary label text at the inline end of the header row.                                                 |
| `customProps`      | `BaseFieldCustomProps` | —       | Extra props for internal parts (`root`, `group`, `label`, …).                                             |
| `description`      | `string`               | —       | Helper text below the group (hidden when invalid).                                                        |
| `disabled`         | `boolean`              | `false` | Whether the field is disabled.                                                                            |
| `error`            | `boolean`              | `false` | When `true`, applies invalid styling on the label and group.                                              |
| `errorMessage`     | `string`               | —       | Error message below the group.                                                                            |
| `field`            | `UseBaseFieldReturn`   | —       | Pre-composed field API from a parent composable. Used by `<BaseField field={…} />`.                       |
| `hideErrorMessage` | `boolean`              | `false` | When `true`, does not reserve space below the group for error messages.                                   |
| `label`            | `string`               | —       | Primary label text above the group.                                                                       |
| `readonly`         | `boolean`              | `false` | Whether the field is read-only.                                                                           |
| `required`         | `boolean`              | `false` | Shows a required asterisk on the label.                                                                   |
| `size`             | `BaseFieldSize`        | `"md"`  | Label, corner, description, and error typography scale.                                                   |
| `slots`            | `BaseFieldSlots`       | —       | Chrome slots (`label`, `description`, `errorMessage`, `start`, `end`, …).                                 |

## Related components

FormControl, Label, OtpField
