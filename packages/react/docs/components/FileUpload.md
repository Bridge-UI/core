# FileUpload

File selection with an optional drag-and-drop surface (`variant="dropzone"`). Emits `File[]` to the app — Bridge does not upload to a server.

Selected files always render as the same attachment-style cards whether you pick one file or many — there is no FormField input shell for the single-file case. Optional `label` / `description` / `error` sit above or below as flat chrome.

## Import

```ts
import { FileUpload } from "@bridge-ui/react/Components/FileUpload";
```

## Examples

### Usage

```tsx
<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  description="PDF or images up to 5 MB."
  onChange={(files) => setFiles(files)}
/>
```

### Single file card

Once a file is chosen, the trigger hides and the selection shows as one attachment card (media, name, type · size, remove).

```tsx
<FileUpload value={files} onChange={setFiles} />
```

### Dropzone

```tsx
<FileUpload
  multiple
  accept="image/*"
  onChange={setFiles}
  variant="dropzone"
  title="Drop images here"
  description="or click to browse"
/>
```

### Multiple

```tsx
<FileUpload
  multiple
  maxFiles={5}
  value={files}
  onChange={setFiles}
  buttonLabel="Add files"
/>
```

### Validation

```tsx
<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  description="Images up to 5 MB."
/>
```

### customProps

```tsx
<FileUpload
  variant="dropzone"
  title="Drop files"
  customProps={{
    list: { id: "uploads" },
    dropzone: { "data-testid": "dropzone" },
  }}
/>
```

## Related components

Button, EmptyState
