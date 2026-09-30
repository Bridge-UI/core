# RichTextEditor

Formatted text input with FormField chrome. Bridge owns the toolbar, tokens, and a11y. The document engine is TipTap.

Sanitize HTML before rendering it outside the editor — XSS prevention stays in the app.

## Import

```ts
import { RichTextEditor } from "@bridge-ui/react/Components/RichTextEditor";
```

Install `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, and `@tiptap/extension-placeholder` next to `@bridge-ui/react` when you use `RichTextEditor`.

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
