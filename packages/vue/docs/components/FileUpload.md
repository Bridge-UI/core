# FileUpload

File selection with an optional drag-and-drop surface (`variant="dropzone"`). Without `multiple`, `v-model` is one item or `null`. With `multiple`, it is a list. Each item is a browser `File`, or a remote attachment `{ name, size?, type?, url? }` already stored on the server. Bridge does not upload.

Selected files always render as the same attachment-style cards whether you pick one file or many — there is no FormField input shell for the single-file case. Optional `label` / `description` / `error` sit above or below as flat chrome.

## Import

```ts
import {
  FileUpload,
  FileUploadItem,
} from "@bridge-ui/vue/Components/FileUpload";
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

| Prop / Event        | Type                                             | Default | Description                                                                                            |
| ------------------- | ------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------ |
| `modelValue`        | `null \| FileUploadValue` or `FileUploadValue[]` | —       | One item when `multiple` is false, a list when it is true. A `File` or `{ name, size?, type?, url? }`. |
| `update:modelValue` | `(value) => void`                                | —       | Emitted when `v-model` should update. Listen with `v-on:update:model-value`.                           |
| `remove`            | `(value, index) => void`                         | —       | Emitted with the removed `File` or remote item and its index.                                          |

## Related components

Button, EmptyState
