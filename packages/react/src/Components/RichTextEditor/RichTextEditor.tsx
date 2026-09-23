// ** Local Imports
import { Button } from "@/Components/Button";
import { FormField } from "@/Components/FormField";
import { useRichTextEditor } from "@/Components/RichTextEditor/hooks/useRichTextEditor";
import type { RichTextEditorProps } from "@/Components/RichTextEditor/richTextEditor.types";
import { hasNamedSlot } from "@/Utils";

function RichTextEditor(props: RichTextEditorProps) {
  const {
    slots,
    tools,
    formField,
    contentBind,
    toolbarBind,
    showToolbar,
    getToolbarButtonBind,
  } = useRichTextEditor(props);

  return (
    <FormField field={formField}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {showToolbar ? (
          hasNamedSlot(slots, "toolbar") ? (
            slots?.toolbar?.({ tools })
          ) : (
            <div {...toolbarBind}>
              {tools.map((tool) => (
                <Button key={tool} {...getToolbarButtonBind(tool)} />
              ))}
            </div>
          )
        ) : null}

        <div {...contentBind} />
      </div>
    </FormField>
  );
}

export default RichTextEditor;
