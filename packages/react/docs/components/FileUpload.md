# FileUpload

File selection with an optional drag-and-drop surface (`variant="dropzone"`). Without `multiple`, the model is one item or `null`. With `multiple`, it is a list. Each item is a browser `File`, or a remote attachment `{ name, size?, type?, url? }` already stored on the server. Bridge does not upload.

Selected files always render as the same attachment-style cards whether you pick one file or many — there is no FormField input shell for the single-file case. Optional `label` / `description` / `error` sit above or below as flat chrome.

## Import

```ts
import {
  FileUpload,
  FileUploadItem,
} from "@bridge-ui/react/Components/FileUpload";
```

## Examples

### Usage

```tsx
<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  onChange={(file) => setFile(file)}
  description="PDF or images up to 5 MB."
/>
```

### Single file card

Once a file is chosen, the trigger hides and the selection shows as one attachment card (media, name, type · size, remove).

```tsx
<FileUpload value={file} onChange={setFile} />
```

### Color

`color` styles the trigger, the remove button, and the dropzone highlight while a file is dragged over it. A registry default applies when the prop is omitted.

```tsx
<FileUpload color="secondary" label="Attachments" />
```

Theme default via registry:

```tsx
<BridgeUIProvider
  components={{
    FileUpload: {
      defaultProps: { color: "secondary" },
    },
  }}
>
  …
</BridgeUIProvider>
```

### Rounded

```tsx
<FileUpload rounded="xl" label="Attachments" />
```

Shared with other form controls via `global.formDefaults`:

```tsx
<BridgeUIProvider
  global={{
    formDefaults: { size: "lg", rounded: "md" },
  }}
>
  …
</BridgeUIProvider>
```

### Dropzone

```tsx
<FileUpload
  multiple
  accept="image/*"
  variant="dropzone"
  onChange={setFiles}
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

### Value

Without `multiple`, `value`, `defaultValue`, and `onChange` use `null | FileUploadValue`. With `multiple`, they use `FileUploadValue[]`. `accept` and `maxSize` apply only to a `File` that was just picked or dropped. Remote items still count toward `maxFiles`. Removing an item calls `onRemove` with that item and its index.

```tsx
<FileUpload multiple value={attachments} onChange={setAttachments} />
```

### List slot

When `slots.list` is set, FileUpload does not render the default list. `items` follows the model order. Write the reordered array back through `onChange`. Use `FileUploadItem` to keep the default card. `start` sits before the file media (a drag handle). `end` replaces the remove button.

`slots.start` and `slots.end` on `FileUpload` do the same thing for the default list. A function receives the item.

```tsx
<FileUpload
  multiple
  value={attachments}
  onChange={setAttachments}
  slots={{
    list: ({ items }) => (
      <ul>
        {items.map((item) => (
          <FileUploadItem
            {...item}
            key={item.index}
            slots={{
              start: <span aria-hidden="true">⋮⋮</span>,
              end: (
                <button type="button" onClick={item.remove}>
                  Remove
                </button>
              ),
            }}
          />
        ))}
      </ul>
    ),
  }}
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
