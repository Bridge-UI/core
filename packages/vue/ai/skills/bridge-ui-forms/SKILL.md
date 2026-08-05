---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI Vue — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Slider, Checkbox, Radio,
  Switch, FormField, FormControl, BaseField. Use when wiring inputs,
  validation chrome, or select.
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
| Slider                    | `.ai/docs/components/Slider.md`                                    |
| Select                    | `.ai/docs/components/Select.md`                                    |
| Autocomplete              | `.ai/docs/components/Autocomplete.md`                              |
| Checkbox / radio / switch | `.ai/docs/components/Checkbox.md`, `Radio.md`, `Switch.md`         |
| Input chrome              | `.ai/docs/components/FormField.md`                                 |
| Toggle row chrome         | `.ai/docs/components/FormControl.md`                               |
| Custom control chrome     | `.ai/docs/components/BaseField.md`                                 |

## Hard rules

1. Map validation to `error`, `error-message`, `description`, `disabled`, `readOnly`.
2. Native input attrs often go through `:custom-props` → `input` — see TextField docs.
3. Use only documented option shapes for Select/Autocomplete.
4. Prefer public fields/controls in apps. `FormField`, `FormControl`, `BaseField`, and `Listbox` are exported building blocks for advanced composition — they are **not** registry keys. Theme via the public parent (`components.TextField`, `tokens.baseField`, `tokens.formControl`, `tokens.listbox` on Select/Autocomplete).
