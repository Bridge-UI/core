# Textarea

Multiline text input. Extends FormField props.

## Import

```tsx
import { Textarea } from "@bridge-ui/react/Components/Textarea";
```

## Examples

### Usage

```tsx
<Textarea rows={3} label="Notes" placeholder="Add details..." />

<Textarea
  rows={4}
  label="Bio"
  value={bio}
  onChange={(event) => setBio(event.target.value)}
  description="Tell us about yourself."
/>

<Textarea
  rows={3}
  label="Message"
  error
  errorMessage="Please enter at least 10 characters."
/>
```

### Autosize

```tsx
<Textarea
  autosize
  rows={2}
  label="Growing textarea"
  placeholder="Add more lines to see autosize..."
/>
```

### customProps

```tsx
<Textarea
  rows={3}
  label="Feedback"
  placeholder="maxlength 200"
  customProps={{
    input: { maxLength: 200, name: "demo-textarea" },
  }}
/>
```

## Props

### Textarea-specific

| Prop        | Type             | Default | Description                                                                                                                                                           |
| ----------- | ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autosize`  | `boolean`        | —       | Whether the textarea automatically resizes with its content. Defaults to `true` when `likeInput` is set; otherwise `false`.                                           |
| `likeInput` | `boolean`        | `false` | Use compact TextField-like sizing instead of the default multiline textarea profile. Enables `autosize` and `rows={1}` by default; both can be overridden explicitly. |
| `resize`    | `TextareaResize` | "none"  | Native resize handle (`resize` CSS). Ignored when `autosize` is `true`.                                                                                               |

### Binding

| Prop       | Type                                      | Default | Description                                               |
| ---------- | ----------------------------------------- | ------- | --------------------------------------------------------- |
| `value`    | `string`                                  | —       | Textarea value. Use with `onChange` for controlled state. |
| `onChange` | `ChangeEventHandler<HTMLTextAreaElement>` | —       | Native textarea change handler.                           |

### Inherited from FormField

See [FormField](./FormField.md).

## Related components

TextField, FormField
