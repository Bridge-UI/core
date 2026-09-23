# FileUpload

File selection with an optional drag-and-drop surface (`variant="dropzone"`). Bind with `v-model` as `File[]` — Bridge does not upload to a server.

Selected files always render as the same attachment-style cards whether you pick one file or many — there is no FormField input shell for the single-file case. Optional `label` / `description` / `error` sit above or below as flat chrome.

## Import

```ts
import { FileUpload } from "@bridge-ui/vue/Components/FileUpload";
```

## Examples

### Usage

```vue
<FileUpload
  v-model="files"
  label="Attachments"
  accept="image/*,.pdf"
  description="PDF or images up to 5 MB."
/>
```

### Single file card

Once a file is chosen, the trigger hides and the selection shows as one attachment card (media, name, type · size, remove).

```vue
<FileUpload v-model="files" />
```

### Dropzone

```vue
<FileUpload
  multiple
  v-model="files"
  accept="image/*"
  variant="dropzone"
  title="Drop images here"
  description="or click to browse"
/>
```

### Multiple

```vue
<FileUpload multiple v-model="files" :max-files="5" button-label="Add files" />
```

### Validation

```vue
<FileUpload
  accept="image/*"
  :max-size="5 * 1024 * 1024"
  description="Images up to 5 MB."
/>
```

### customProps

```vue
<FileUpload
  variant="dropzone"
  title="Drop files"
  :custom-props="{
    list: { id: 'uploads' },
    dropzone: { 'data-testid': 'dropzone' },
  }"
/>
```

## Props

### v-model

| Prop / Event        | Type                      | Default | Description                                                                  |
| ------------------- | ------------------------- | ------- | ---------------------------------------------------------------------------- |
| `modelValue`        | `File[]`                  | —       | Bound with `v-model`.                                                        |
| `update:modelValue` | `(files: File[]) => void` | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`. |
| `remove`            | `(file, index) => void`   | —       | Emitted when a file is removed from the list.                                |

## Related components

Button, EmptyState
