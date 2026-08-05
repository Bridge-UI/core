---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI React — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Slider, Checkbox, Radio,
  Switch, FormField, FormControl, BaseField. Use when wiring inputs,
  validation chrome, or select.
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
| Slider                    | `.ai/docs/components/Slider.md`                                    |
| Select                    | `.ai/docs/components/Select.md`                                    |
| Autocomplete              | `.ai/docs/components/Autocomplete.md`                              |
| Checkbox / radio / switch | `.ai/docs/components/Checkbox.md`, `Radio.md`, `Switch.md`         |
| Input chrome              | `.ai/docs/components/FormField.md`                                 |
| Toggle row chrome         | `.ai/docs/components/FormControl.md`                               |
| Custom control chrome     | `.ai/docs/components/BaseField.md`                                 |

## Hard rules

1. Map validation to `error`, `errorMessage`, `description`, `disabled`, `readOnly`.
2. Native input attrs for the control often go through `customProps.input` — see TextField docs.
3. Use only documented option shapes for Select/Autocomplete.
4. Prefer public fields/controls in apps. `FormField`, `FormControl`, and `BaseField` are exported building blocks for advanced composition — they are **not** registry keys. Theme via the public parent (`components.TextField`, `tokens.baseField`, `tokens.formControl`, `tokens.listbox` on Select/Autocomplete).
