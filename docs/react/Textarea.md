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
