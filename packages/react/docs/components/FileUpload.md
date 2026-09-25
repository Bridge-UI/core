# FileUpload

File selection with an optional drag-and-drop surface (`variant="dropzone"`). Without `multiple`, the model is one item or `null`. With `multiple`, it is a list. Each item is a browser `File`, or `{ name, size?, type?, url?, file?, state?, progress?, description? }`. Bridge does not upload. Write `state` on the object when your app is uploading.

Selected files always render as the same attachment-style cards whether you pick one file or many — there is no FormField input shell for the single-file case. Optional `label` / `description` / `error` sit above or below as flat chrome.

## Import

```ts
import { FileUpload } from "@bridge-ui/react/Components/FileUpload";
import { FileUploadItem } from "@bridge-ui/react/Components/FileUploadItem";
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

### Size

`xs` hides the default type · size line. `sm`, `md`, and `lg` keep it and scale the card and the dropzone. `md` is the default.

```tsx
<FileUpload size="xs" label="Attachments" />
```

### Orientation

`horizontal` places the media beside the name and stacks cards. `vertical` puts the media above the name and lays cards in a row. A card can override the field with its own `orientation` inside `slots.list`.

```tsx
<FileUpload multiple value={files} onChange={setFiles} orientation="vertical" />
```

### Upload state

Leave `state` unset for the type · size card. Set it on the attachment object while your app uploads. `description` replaces the meta line. `progress` (0–100) is shown for `uploading`. `onRetry` adds a retry button when `state` is `error`.

| `state`      | Meta line                 |
| ------------ | ------------------------- |
| `idle`       | Ready to upload           |
| `uploading`  | Uploading · 64%           |
| `processing` | Processing document       |
| `error`      | Upload failed. Try again. |
| `done`       | Uploaded · 1.8 MB         |

```tsx
<FileUpload
  onRetry={retryUpload}
  value={{ name: "report.pdf", progress: 64, state: "uploading" }}
/>
```

A local `File` cannot carry `state`. Replace it with `{ file, name, size, type, state: "uploading", progress: 0 }` while the upload runs.

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
