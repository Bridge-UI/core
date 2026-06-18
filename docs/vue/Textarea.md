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
  v-model="bio"
  :rows="4"
  label="Bio"
  description="Tell us about yourself."
/>

<Textarea
  :rows="3"
  label="Message"
  error
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

| Prop        | Type             | Default  | Description            |
| ----------- | ---------------- | -------- | ---------------------- |
| `rows`      | `number`         | —        | Visible rows           |
| `autosize`  | `boolean`        | —        | Grow with content      |
| `likeInput` | `boolean`        | `false`  | Match TextField chrome |
| `resize`    | `TextareaResize` | `"none"` | CSS resize handle      |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
