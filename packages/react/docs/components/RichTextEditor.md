# RichTextEditor

Formatted text input with FormField chrome and a pluggable editing engine. Bridge owns the toolbar, tokens, and a11y; the document engine comes from `global.richText` (no native default).

Sanitize HTML before rendering it outside the editor — XSS prevention stays in the app.

## Import

```ts
import { RichTextEditor } from "@bridge-ui/react/Components/RichTextEditor";
```

## Adapter

Provide `global.richText` on `BridgeUIProvider`. Ready adapter:

```ts
import { BridgeUIProvider } from "@bridge-ui/react";
import { createTiptapRichTextAdapter } from "@bridge-ui/react/Adapters/Examples/rich-text-tiptap";

const richText = createTiptapRichTextAdapter();
```

```tsx
<BridgeUIProvider global={{ richText }}>
  <App />
</BridgeUIProvider>
```

| Adapter                              | Peer(s)                                                                              | Notes                             |
| ------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------- |
| `Adapters/Examples/rich-text-tiptap` | `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder` | Shipped example; ProseMirror JSON |

Custom engines can implement `RichTextEditorAdapter` and pass them via `global.richText`.

## Examples

### Usage

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  label="Description"
  placeholder="Write a short description…"
/>
```

### Limited tools

```tsx
<RichTextEditor
  value={html}
  label="Comment"
  onChange={setHtml}
  tools={["bold", "italic", "link", "bulletList"]}
/>
```

### JSON document

```tsx
<RichTextEditor value={doc} label="Body" format="json" onChange={setDoc} />
```

`value` / `onChange` are a JSON object when `format="json"` (not a stringified blob).

### Read-only

```tsx
<RichTextEditor readOnly value={html} label="Preview" />
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
