# RichTextEditor

Formatted text input with FormField chrome and a pluggable editing engine. Bridge owns the toolbar, tokens, and a11y; the document engine comes from `global.richText` (no native default).

Sanitize HTML before rendering it outside the editor — XSS prevention stays in the app.

## Import

```ts
import { RichTextEditor } from "@bridge-ui/vue/Components/RichTextEditor";
```

## Adapter

Provide `global.richText` on `BridgeUIProvider`. Ready adapters:

```ts
import { BridgeUIProvider } from "@bridge-ui/vue";
import { createTiptapRichTextAdapter } from "@bridge-ui/vue/Adapters/Examples/rich-text-tiptap";
// or: import { createQuillRichTextAdapter } from "@bridge-ui/vue/Adapters/Examples/rich-text-quill";

const richText = createTiptapRichTextAdapter();
```

```vue
<BridgeUIProvider :global="{ richText }">
  <App />
</BridgeUIProvider>
```

| Adapter                              | Peer(s)                                                                                                                                       | Notes                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Adapters/Examples/rich-text-tiptap` | `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/extension-underline`, `@tiptap/extension-link` | Default recommendation; ProseMirror JSON                            |
| `Adapters/Examples/rich-text-quill`  | `quill`                                                                                                                                       | Quill Delta JSON; no snow theme; import `quill/dist/quill.core.css` |

Stick to one engine per app — TipTap JSON and Quill Delta are not interchangeable.

## Examples

### Usage

```vue
<RichTextEditor
  v-model="html"
  label="Description"
  placeholder="Write a short description…"
/>
```

### Limited tools

```vue
<RichTextEditor
  v-model="html"
  label="Comment"
  :tools="['bold', 'italic', 'link', 'bulletList']"
/>
```

### JSON document

```vue
<RichTextEditor format="json" v-model="doc" label="Body" />
```

`v-model` is a JSON object when `format="json"` (not a stringified blob).

### Read-only

```vue
<RichTextEditor read-only v-model="html" label="Preview" />
```

## Props

### RichTextEditor-specific

| Prop          | Type                        | Default           | Description                                            |
| ------------- | --------------------------- | ----------------- | ------------------------------------------------------ |
| `format`      | `"html" \| "json"`          | `"html"`          | Controlled value shape.                                |
| `modelValue`  | `string \| RichTextJSON`    | —                 | Bound with `v-model`.                                  |
| `placeholder` | `string`                    | —                 | Empty-state hint in the content area.                  |
| `readOnly`    | `boolean`                   | `false`           | View-only surface; hides the toolbar.                  |
| `tools`       | `RichTextTool[]`            | all default tools | Which toolbar actions to show.                         |
| `customProps` | `RichTextEditorCustomProps` | —                 | Extra props for `content`, `toolbar`, `toolbarButton`. |

### Inherited from FormField

Flat FormField props (`label`, `description`, `error`, `errorMessage`, `size`, `color`, `rounded`, `variant`, …).
