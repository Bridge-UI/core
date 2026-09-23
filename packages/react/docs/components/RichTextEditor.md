# RichTextEditor

Formatted text input with FormField chrome and a pluggable editing engine. Bridge owns the toolbar, tokens, and a11y; the document engine comes from `global.richText` (no native default).

Sanitize HTML before rendering it outside the editor — XSS prevention stays in the app.

## Import

```ts
import { RichTextEditor } from "@bridge-ui/react/Components/RichTextEditor";
```

## Adapter

Provide `global.richText` on `BridgeUIProvider`. Ready adapters:

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createTiptapRichTextAdapter } from "@bridge-ui/react/Adapters/Examples/rich-text-tiptap";
// or: import { createQuillRichTextAdapter } from "@bridge-ui/react/Adapters/Examples/rich-text-quill";

const richText = createTiptapRichTextAdapter();
```

```tsx
<BridgeUIProvider global={{ richText }}>
  <App />
</BridgeUIProvider>
```

| Adapter                              | Peer(s)                                                                                                                                       | Notes                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `Adapters/Examples/rich-text-tiptap` | `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/extension-underline`, `@tiptap/extension-link` | Default recommendation; ProseMirror JSON                        |
| `Adapters/Examples/rich-text-quill`  | `quill`                                                                                                                                       | Quill Delta JSON; import `quill/dist/quill.core.css` in the app |

Stick to one engine per app — TipTap JSON and Quill Delta are not interchangeable.

## Examples

### Usage

```tsx
<RichTextEditor
  label="Description"
  value={html}
  onChange={setHtml}
  placeholder="Write a short description…"
/>
```

### Limited tools

```tsx
<RichTextEditor
  label="Comment"
  value={html}
  onChange={setHtml}
  tools={["bold", "italic", "link", "bulletList"]}
/>
```

### JSON document

```tsx
<RichTextEditor format="json" label="Body" value={doc} onChange={setDoc} />
```

`value` / `onChange` are a JSON object when `format="json"` (not a stringified blob).

### Read-only

```tsx
<RichTextEditor readOnly label="Preview" value={html} />
```

## Props

### RichTextEditor-specific

| Prop          | Type                        | Default           | Description                                            |
| ------------- | --------------------------- | ----------------- | ------------------------------------------------------ |
| `format`      | `"html" \| "json"`          | `"html"`          | Controlled value shape.                                |
| `onChange`    | `(value) => void`           | —                 | Called when the document changes.                      |
| `placeholder` | `string`                    | —                 | Empty-state hint in the content area.                  |
| `readOnly`    | `boolean`                   | `false`           | View-only surface; hides the toolbar.                  |
| `tools`       | `RichTextTool[]`            | all default tools | Which toolbar actions to show.                         |
| `value`       | `string \| RichTextJSON`    | —                 | Controlled document.                                   |
| `customProps` | `RichTextEditorCustomProps` | —                 | Extra props for `content`, `toolbar`, `toolbarButton`. |

### Inherited from FormField

Flat FormField props (`label`, `description`, `error`, `errorMessage`, `size`, `color`, `rounded`, `variant`, …).
