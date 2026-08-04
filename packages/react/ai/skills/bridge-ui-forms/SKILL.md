---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI React — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Checkbox, Radio, Switch,
  FormField, FormControl. Use when wiring inputs, validation chrome, or select.
---

# Bridge UI (React) — forms

Do **not** invent APIs. Copy examples from `.ai/docs/components/{Component}.md`.

## Binding

Controlled fields: **`value` + `onChange`**. Never Vue `v-model`.

## Start here

| Need                      | Doc                                                                |
| ------------------------- | ------------------------------------------------------------------ |
| Text input                | `.ai/docs/components/TextField.md`                                 |
| Password                  | `.ai/docs/components/PasswordField.md`                             |
| Number / OTP / textarea   | `.ai/docs/components/NumberField.md`, `OtpField.md`, `Textarea.md` |
| Select                    | `.ai/docs/components/Select.md`                                    |
| Autocomplete              | `.ai/docs/components/Autocomplete.md`                              |
| Checkbox / radio / switch | `.ai/docs/components/Checkbox.md`, `Radio.md`, `Switch.md`         |
| Chrome wrapper            | `.ai/docs/components/FormField.md`, `FormControl.md`               |

## Hard rules

1. Map validation to `error`, `errorMessage`, `description`, `disabled`, `readOnly`.
2. Native input attrs for the control often go through `customProps.input` — see TextField docs.
3. Use only documented option shapes for Select/Autocomplete.
4. Field components already include FormField chrome; use standalone `FormField` for custom controls.
