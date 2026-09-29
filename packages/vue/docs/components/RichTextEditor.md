# RichTextEditor

Formatted text input with FormField chrome. Bridge owns the toolbar, tokens, and a11y. The document engine is TipTap.

Sanitize HTML before rendering it outside the editor — XSS prevention stays in the app.

## Import

```ts
import { RichTextEditor } from "@bridge-ui/vue/Components/RichTextEditor";
```

Install `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, and `@tiptap/extension-placeholder` next to `@bridge-ui/vue` when you use `RichTextEditor`.

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
<RichTextEditor label="Body" format="json" v-model="doc" />
```

`v-model` is a JSON object when `format="json"` (not a stringified blob).

### Read-only

```vue
<RichTextEditor read-only v-model="html" label="Preview" />
```

## Props

### RichTextEditor-specific

| Prop           | Type                        | Default           | Description                                            |
| -------------- | --------------------------- | ----------------- | ------------------------------------------------------ |
| `format`       | `"html" \| "json"`          | `"html"`          | Controlled value shape.                                |
| `defaultValue` | `string \| RichTextJSON`    | —                 | Initial value when `v-model` is not bound.             |
| `modelValue`   | `string \| RichTextJSON`    | —                 | Bound with `v-model`.                                  |
| `placeholder`  | `string`                    | —                 | Empty-state hint in the content area.                  |
| `readOnly`     | `boolean`                   | `false`           | View-only surface; hides the toolbar.                  |
| `tools`        | `RichTextTool[]`            | all default tools | Which toolbar actions to show.                         |
| `customProps`  | `RichTextEditorCustomProps` | —                 | Extra props for `content`, `toolbar`, `toolbarButton`. |

### Inherited from FormField

Flat FormField props (`label`, `description`, `error`, `errorMessage`, `size`, `color`, `rounded`, `variant`, …).
