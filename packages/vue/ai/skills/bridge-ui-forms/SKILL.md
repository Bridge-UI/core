---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI Vue — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Checkbox, Radio, Switch,
  FormField, FormControl. Use when wiring inputs, validation chrome, or select.
---

# Bridge UI (Vue) — forms

Do **not** invent APIs. Copy examples from `.ai/docs/components/{Component}.md`.

## Binding

Controlled fields: **`v-model` / `modelValue`**. Never React `value`/`onChange`.

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

1. Map validation to `error`, `error-message`, `description`, `disabled`, `readOnly`.
2. Native input attrs often go through `:custom-props` → `input` — see TextField docs.
3. Use only documented option shapes for Select/Autocomplete.
4. Field components already include FormField chrome; use standalone `FormField` for custom controls.
