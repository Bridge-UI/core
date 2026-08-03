# OtpField

One-time password / PIN input with individual pin cells. Label, description, and
error chrome sit above/below the group; variants style each pin.

## Import

```ts
import { OtpField } from "@bridge-ui/react/Components/OtpField";
```

## Examples

### Usage

```tsx
<OtpField label="Verification code" />

<OtpField
  length={4}
  value={code}
  label="PIN"
  onChange={setCode}
  description="Enter the 4-digit code from your email."
/>

<OtpField
  error
  label="Code"
  errorMessage="Invalid or expired code."
/>
```

### Length and type

```tsx
<OtpField length={4} label="PIN" />

<OtpField
  length={8}
  type="alphanumeric"
  label="Backup code"
/>
```

### Variants

```tsx
<OtpField variant="outline" label="Outline" />
<OtpField variant="filled" label="Filled" />
<OtpField variant="underlined" label="Underlined" />
<OtpField variant="stacked" label="Stacked" />
<OtpField variant="notched" label="Notched" />
```

### Masked

```tsx
<OtpField mask label="Secure code" />
```

### customProps

```tsx
<OtpField
  label="Code"
  description="Pins use name via customProps."
  customProps={{
    input: { name: "demo-otp" },
  }}
/>
```

## Props

### OtpField-specific

| Prop          | Type                          | Default     | Description                                 |
| ------------- | ----------------------------- | ----------- | ------------------------------------------- |
| `autoFocus`   | `boolean`                     | `false`     | Focus the first empty pin on mount.         |
| `classes`     | `OtpFieldClasses`             | —           | Classes for the field chrome and pin cells. |
| `length`      | `number`                      | `6`         | Number of pin slots.                        |
| `mask`        | `boolean`                     | `false`     | Mask pin values (password-style).           |
| `onComplete`  | `(value: string) => void`     | —           | Called when every pin is filled.            |
| `placeholder` | `string`                      | —           | Placeholder character in empty pins.        |
| `type`        | `"numeric" \| "alphanumeric"` | `"numeric"` | Character set accepted by each pin.         |
| `variant`     | `OtpFieldVariant`             | `"outline"` | Visual variant applied to each pin cell.    |

### Binding

| Prop       | Type                      | Default | Description                                                 |
| ---------- | ------------------------- | ------- | ----------------------------------------------------------- |
| `value`    | `string`                  | —       | Concatenated OTP value. Use with `onChange` for controlled. |
| `onChange` | `(value: string) => void` | —       | Called with the full OTP string when it changes.            |

### Field chrome

| Prop                  | Type      | Default     | Description                                       |
| --------------------- | --------- | ----------- | ------------------------------------------------- |
| `color`               | token     | `"primary"` | Focus color on each pin.                          |
| `controlId`           | `string`  | auto        | Id for the pin group and related labels.          |
| `corner`              | `string`  | —           | Secondary header text.                            |
| `customProps`         | object    | —           | Extra props for internal parts.                   |
| `description`         | `string`  | —           | Helper text below the pins.                       |
| `disabled`            | `boolean` | `false`     | Disables all pins.                                |
| `error`               | `boolean` | `false`     | Invalid styling.                                  |
| `errorMessage`        | `string`  | —           | Error message below the pins.                     |
| `label`               | `string`  | —           | Primary label above the pins.                     |
| `readonly`            | `boolean` | `false`     | Makes all pins read-only.                         |
| `required`            | `boolean` | `false`     | Shows a required asterisk on the label.           |
| `rounded`             | token     | `"md"`      | Border radius of each pin.                        |
| `size`                | token     | `"md"`      | Pin size and label typography.                    |
| `slots`               | object    | —           | `label`, `corner`, `description`, `errorMessage`. |
| `withoutErrorMessage` | `boolean` | `false`     | Hides the error message row.                      |

## Related components

TextField, FormField, NumberField
