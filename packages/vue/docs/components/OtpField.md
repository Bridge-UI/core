# OtpField

One-time password / PIN input with individual pin cells. Label, description, and
error chrome are rendered via the shared `BaseField` layout; variants style each
pin.

## Import

```ts
import { OtpField } from "@bridge-ui/vue/Components/OtpField";
```

## Examples

### Usage

```vue
<OtpField label="Verification code" />

<OtpField
  v-model="code"
  :length="4"
  label="PIN"
  description="Enter the 4-digit code from your email."
/>

<OtpField error label="Code" error-message="Invalid or expired code." />
```

### Length and type

```vue
<OtpField :length="4" label="PIN" />

<OtpField :length="8" type="alphanumeric" label="Backup code" />
```

### Variants

```vue
<OtpField variant="outline" label="Outline" />
<OtpField variant="filled" label="Filled" />
<OtpField variant="underlined" label="Underlined" />
<OtpField variant="stacked" label="Stacked" />
<OtpField variant="notched" label="Notched" />
```

### Masked

```vue
<OtpField mask label="Secure code" />
```

### Adornment slots

```vue
<OtpField label="Code">
  <template #start>
    <Lock aria-hidden="true" />
  </template>
  <template #end>
    <button type="button">Resend</button>
  </template>
</OtpField>
```

### customProps

```vue
<OtpField
  label="Code"
  description="Pins use name via customProps."
  :custom-props="{
    input: { name: 'demo-otp' },
  }"
/>
```

## Props

### OtpField-specific

| Prop           | Type                          | Default     | Description                                 |
| -------------- | ----------------------------- | ----------- | ------------------------------------------- |
| `autoFocus`    | `boolean`                     | `false`     | Focus the first empty pin on mount.         |
| `classes`      | `OtpFieldClasses`             | —           | Classes for the field chrome and pin cells. |
| `defaultValue` | `string`                      | —           | Initial value when `v-model` is unbound.    |
| `length`       | `number`                      | `6`         | Number of pin slots.                        |
| `mask`         | `boolean`                     | `false`     | Mask pin values (password-style).           |
| `placeholder`  | `string`                      | —           | Placeholder character in empty pins.        |
| `type`         | `"numeric" \| "alphanumeric"` | `"numeric"` | Character set accepted by each pin.         |
| `variant`      | `OtpFieldVariant`             | `"outline"` | Visual variant applied to each pin cell.    |

### Binding

| Prop         | Type     | Default | Description                         |
| ------------ | -------- | ------- | ----------------------------------- |
| `modelValue` | `string` | —       | Concatenated OTP value (`v-model`). |

### Field chrome

Label, corner, description, error message, and start/end adornment slots use the
same `BaseField` layout as other field components. Pin-specific props (`length`,
`mask`, `variant`, …) apply only to the pin row.

| Prop               | Type      | Default     | Description                                                             |
| ------------------ | --------- | ----------- | ----------------------------------------------------------------------- |
| `color`            | token     | `"primary"` | Focus color on each pin.                                                |
| `controlId`        | `string`  | auto        | Id for the pin group and related labels.                                |
| `corner`           | `string`  | —           | Secondary header text.                                                  |
| `customProps`      | object    | —           | Extra props for internal parts.                                         |
| `description`      | `string`  | —           | Helper text below the pins.                                             |
| `disabled`         | `boolean` | `false`     | Disables all pins.                                                      |
| `error`            | `boolean` | `false`     | Invalid styling.                                                        |
| `errorMessage`     | `string`  | —           | Error message below the pins.                                           |
| `hideErrorMessage` | `boolean` | `false`     | Hides the error message row.                                            |
| `label`            | `string`  | —           | Primary label above the pins.                                           |
| `readonly`         | `boolean` | `false`     | Makes all pins read-only.                                               |
| `required`         | `boolean` | `false`     | Shows a required asterisk on the label.                                 |
| `rounded`          | token     | `"md"`      | Border radius of each pin.                                              |
| `size`             | token     | `"md"`      | Pin size and label typography (`2xs` … `2xl`).                          |
| `slots`            | —         | —           | `#label`, `#corner`, `#description`, `#errorMessage`, `#start`, `#end`. |

## Events

| Event      | Payload  | Description                          |
| ---------- | -------- | ------------------------------------ |
| `change`   | `string` | Emitted when the OTP string changes. |
| `complete` | `string` | Emitted when every pin is filled.    |

## Related components

BaseField, TextField, FormField, NumberField
