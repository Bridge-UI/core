---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI React — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Slider, Checkbox, Radio,
  Switch, DateField, DatePicker, DateRangeField, DateRangePicker, TimeField,
  TimePicker, TimeRangeField, TimeRangePicker, DateTimeField, DateTimePicker,
  DateTimeRangeField, DateTimeRangePicker, ColorField, ColorPicker, FormField,
  FormControl, BaseField.
  Use when wiring inputs, date/time pickers, validation chrome, or select.
---

# Bridge UI (React) — forms

Do **not** invent APIs. Copy examples from `.ai/docs/components/{Component}.md`.

## Binding

Controlled fields: **`value` + `onChange`**. Never Vue `v-model`.

## Start here

| Need                      | Doc                                                                   |
| ------------------------- | --------------------------------------------------------------------- |
| Text input                | `.ai/docs/components/TextField.md`                                    |
| Password                  | `.ai/docs/components/PasswordField.md`                                |
| Number / OTP / textarea   | `.ai/docs/components/NumberField.md`, `OtpField.md`, `Textarea.md`    |
| Slider                    | `.ai/docs/components/Slider.md`                                       |
| Select                    | `.ai/docs/components/Select.md`                                       |
| Autocomplete              | `.ai/docs/components/Autocomplete.md`                                 |
| Checkbox / radio / switch | `.ai/docs/components/Checkbox.md`, `Radio.md`, `Switch.md`            |
| Date                      | `.ai/docs/components/DateField.md`, `DatePicker.md`                   |
| Date range                | `.ai/docs/components/DateRangeField.md`, `DateRangePicker.md`         |
| Time                      | `.ai/docs/components/TimeField.md`, `TimePicker.md`                   |
| Time range                | `.ai/docs/components/TimeRangeField.md`, `TimeRangePicker.md`         |
| Date-time                 | `.ai/docs/components/DateTimeField.md`, `DateTimePicker.md`           |
| Date-time range           | `.ai/docs/components/DateTimeRangeField.md`, `DateTimeRangePicker.md` |
| Color                     | `.ai/docs/components/ColorField.md`, `ColorPicker.md`                 |
| Input chrome              | `.ai/docs/components/FormField.md`                                    |
| Toggle row chrome         | `.ai/docs/components/FormControl.md`                                  |
| Custom control chrome     | `.ai/docs/components/BaseField.md`                                    |

## Hard rules

1. Map validation to `error`, `errorMessage`, `description`, `disabled`, `readOnly`.
2. Native input attrs for the control often go through `customProps.input` — see TextField docs.
3. Use only documented option shapes for Select/Autocomplete.
4. Prefer public fields/controls in apps. `FormField`, `FormControl`, and `BaseField` are exported building blocks for advanced composition — they are **not** registry keys. Theme via the public parent (`components.TextField`, `tokens.baseField`, `tokens.formControl`). Dropdown tokens live on `components.Listbox`. Shared form density: `global.formDefaults: { size, rounded }` (Radio/Switch ignore `rounded`).
