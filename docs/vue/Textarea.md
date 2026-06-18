# Textarea

Multiline text input. Extends FormField props.

## Import

```vue
import { Textarea } from "@bridge-ui/vue/Components/Textarea";
```

## Examples

### Usage

```vue
<Textarea :rows="3" label="Notes" placeholder="Add details..." />

<Textarea
  :rows="4"
  label="Bio"
  v-model="bio"
  description="Tell us about yourself."
/>

<Textarea
  error
  :rows="3"
  label="Message"
  error-message="Please enter at least 10 characters."
/>
```

### Autosize

```vue
<Textarea
  autosize
  :rows="2"
  label="Growing textarea"
  placeholder="Add more lines to see autosize..."
/>
```

### customProps

```vue
<Textarea
  :rows="3"
  label="Feedback"
  placeholder="maxlength 200"
  :custom-props="{
    input: { maxlength: 200, name: 'demo-textarea' },
  }"
/>
```

## Props

### Textarea-specific

| Prop        | Type             | Default | Description                                                                                                                                                           |
| ----------- | ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autosize`  | `boolean`        | —       | Whether the textarea automatically resizes with its content. Defaults to `true` when `likeInput` is set; otherwise `false`.                                           |
| `likeInput` | `boolean`        | `false` | Use compact TextField-like sizing instead of the default multiline textarea profile. Enables `autosize` and `rows={1}` by default; both can be overridden explicitly. |
| `resize`    | `TextareaResize` | "none"  | Native resize handle (`resize` CSS). Ignored when `autosize` is `true`.                                                                                               |

### v-model

| Prop / Event        | Type                              | Default | Description                                                                  |
| ------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `string \| null`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(value: string \| null) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
