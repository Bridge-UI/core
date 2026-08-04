---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI Vue — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Checkbox, Radio, Switch,
  FormField, FormControl. Use when wiring inputs, validation chrome, or select.
---

# Bridge UI (Vue) — forms

## Controlled values

Use `v-model` / `modelValue`. Do not use React `value`/`onChange` patterns.

## TextField

```vue
<TextField v-model="name" label="Display name" />
<TextField error label="Email" error-message="Enter a valid email." />
```

Adornments: `start-icon` / `end-icon`, or `start` / `end` text.

```vue
:custom-props="{
  input: { name: 'email', autocomplete: 'email' },
}"
```

Related: `Textarea`, `PasswordField`, `NumberField`, `OtpField`.

## Select / Autocomplete

```vue
<Select searchable label="Framework" v-model="selected" :options="frameworks" />
<Select multiple label="Tags" v-model="selected" :options="tags" />
```

Prefer documented option shapes — do not invent fields.

## Checkbox / Radio / Switch

```vue
<Checkbox v-model="ok" label="I agree" />
<Switch v-model="on" label="Notifications" />
```

## FormField / FormControl

Field components already include FormField chrome. Use standalone `FormField` for custom controls.

## Validation UI

Map app validation into `error`, `error-message`, `description`, `disabled`, `readOnly`.
