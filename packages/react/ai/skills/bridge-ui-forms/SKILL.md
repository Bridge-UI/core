---
name: bridge-ui-forms
description: >-
  Build forms with Bridge UI React — TextField, Textarea, PasswordField,
  NumberField, OtpField, Select, Autocomplete, Checkbox, Radio, Switch,
  FormField, FormControl. Use when wiring inputs, validation chrome, or select.
---

# Bridge UI (React) — forms

## Controlled values

Use `value` + `onChange`. Do not use Vue `v-model` patterns.

## TextField

```tsx
import { TextField } from "@bridge-ui/react/Components/TextField";

<TextField
  value={name}
  label="Display name"
  description="Shown on your profile."
  onChange={(e) => setName(e.target.value)}
/>

<TextField error label="Email" errorMessage="Enter a valid email." />
```

Adornments: `startIcon` / `endIcon`, or `start` / `end` text.

```tsx
customProps={{
  input: { name: "email", autoComplete: "email" },
}}
```

Related: `Textarea`, `PasswordField`, `NumberField`, `OtpField`.

## Select / Autocomplete

```tsx
import { Select } from "@bridge-ui/react/Components/Select";

<Select
  searchable
  value={selected}
  label="Framework"
  options={frameworks}
  onChange={setSelected}
/>;
```

Prefer documented option shapes — do not invent fields.

## Checkbox / Radio / Switch

```tsx
<Checkbox
  checked={ok}
  label="I agree"
  onChange={(e) => setOk(e.target.checked)}
/>
```

Confirm signatures in component docs.

## FormField / FormControl

Field components already include FormField chrome. Use standalone `FormField` for custom controls.

## Validation UI

Map app validation into `error`, `errorMessage`, `description`, `disabled`, `readOnly`.
