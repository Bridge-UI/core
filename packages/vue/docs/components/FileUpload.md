# FileUpload

File selection with an optional drag-and-drop surface (`variant="dropzone"`). Without `multiple`, `v-model` is one item or `null`. With `multiple`, it is a list. Each item is a browser `File`, or `{ name, size?, type?, url?, file?, state?, progress?, description? }`. Bridge does not upload. Write `state` on the object when your app is uploading.

Selected files always render as the same attachment-style cards whether you pick one file or many — there is no FormField input shell for the single-file case. Optional `label` / `description` / `error` sit above or below as flat chrome.

## Import

```ts
import { FileUpload } from "@bridge-ui/vue/Components/FileUpload";
import { FileUploadItem } from "@bridge-ui/vue/Components/FileUploadItem";
```

## Examples

### Usage

```vue
<FileUpload
  v-model="file"
  label="Attachments"
  accept="image/*,.pdf"
  description="PDF or images up to 5 MB."
/>
```

### Single file card

Once a file is chosen, the trigger hides and the selection shows as one attachment card (media, name, type · size, remove).

```vue
<FileUpload v-model="file" />
```

### Color

`color` styles the trigger, the remove button, and the dropzone highlight while a file is dragged over it. A registry default applies when the prop is omitted.

```vue
<FileUpload color="secondary" label="Attachments" />
```

Theme default via registry:

```ts
createBridgeUI({
  components: {
    FileUpload: {
      defaultProps: { color: "secondary" },
    },
  },
});
```

### Rounded

```vue
<FileUpload rounded="xl" label="Attachments" />
```

Shared with other form controls via `global.formDefaults`:

```ts
createBridgeUI({
  global: {
    formDefaults: { size: "lg", rounded: "md" },
  },
});
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

### Value

Without `multiple`, `v-model` is `null | FileUploadValue`. With `multiple`, it is `FileUploadValue[]`. `accept` and `maxSize` apply only to a `File` that was just picked or dropped. Remote items still count toward `maxFiles`. `remove` emits the item and its index.

```vue
<FileUpload multiple v-model="attachments" />
```

### List slot

When the `list` slot is set, FileUpload does not render the default list. `items` follows the model order. Write the reordered array back to `v-model`. Use `FileUploadItem` to keep the default card. `start` sits before the file media (a drag handle). `end` replaces the remove button.

The `start` and `end` slots on `FileUpload` do the same thing for the default list.

```vue
<FileUpload multiple v-model="attachments">
  <template #list="{ items }">
    <ul>
      <FileUploadItem v-for="item in items" v-bind="item" :key="item.index">
        <template #start>
          <span aria-hidden="true">⋮⋮</span>
        </template>

        <template #end>
          <button type="button" v-on:click="item.remove">Remove</button>
        </template>
      </FileUploadItem>
    </ul>
  </template>
</FileUpload>
```

### Size

`xs` hides the default type · size line. `sm`, `md`, and `lg` keep it and scale the card and the dropzone. `md` is the default.

```vue
<FileUpload size="xs" label="Attachments" />
```

### Orientation

`horizontal` places the media beside the name and stacks cards. `vertical` puts the media above the name and lays cards in a row. A card can override the field with its own `orientation` inside the `list` slot.

```vue
<FileUpload multiple v-model="files" orientation="vertical" />
```

### Upload state

Leave `state` unset for the type · size card. Set it on the attachment object while your app uploads. `description` replaces the meta line. `progress` (0–100) is shown for `uploading`. Listen for `retry` to show a retry button when `state` is `error`.

| `state`      | Meta line                 |
| ------------ | ------------------------- |
| `idle`       | Ready to upload           |
| `uploading`  | Uploading · 64%           |
| `processing` | Processing document       |
| `error`      | Upload failed. Try again. |
| `done`       | Uploaded · 1.8 MB         |

```vue
<FileUpload
  v-on:retry="retryUpload"
  :model-value="{ name: 'report.pdf', progress: 64, state: 'uploading' }"
/>
```

A local `File` cannot carry `state`. Replace it with `{ file, name, size, type, state: "uploading", progress: 0 }` while the upload runs.

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

| Prop / Event        | Type                                             | Default      | Description                                                                                                                                    |
| ------------------- | ------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`        | `null \| FileUploadValue` or `FileUploadValue[]` | —            | One item when `multiple` is false, a list when it is true. A `File` or `{ name, size?, type?, url?, file?, state?, progress?, description? }`. |
| `update:modelValue` | `(value) => void`                                | —            | Emitted when `v-model` should update. Listen with `v-on:update:model-value`.                                                                   |
| `remove`            | `(value, index) => void`                         | —            | Emitted with the removed item and its index.                                                                                                   |
| `retry`             | `(value, index) => void`                         | —            | Emitted from the retry button when `state` is `error`.                                                                                         |
| `orientation`       | `"horizontal" \| "vertical"`                     | `horizontal` | Media beside the name, or stacked above it.                                                                                                    |
| `size`              | `"xs" \| "sm" \| "md" \| "lg"`                   | `md`         | `xs` hides the default type · size line.                                                                                                       |

## Related components

Button, EmptyState
