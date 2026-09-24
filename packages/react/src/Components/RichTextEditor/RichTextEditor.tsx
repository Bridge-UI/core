// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { Button } from "@/Components/Button";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";
import { useRichTextEditor } from "@/Components/RichTextEditor/hooks/useRichTextEditor";
import type { RichTextEditorProps } from "@/Components/RichTextEditor/richTextEditor.types";
import { TextField } from "@/Components/TextField";
import { hasNamedSlot } from "@/Utils";

function RichTextEditor(props: RichTextEditorProps) {
  const {
    slots,
    tools,
    linkHref,
    formField,
    linkAnchor,
    contentBind,
    confirmLink,
    toolbarBind,
    showToolbar,
    setLinkHref,
    linkUrlLabel,
    canConfirmLink,
    closeLinkEditor,
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

      <Menu
        anchorEl={linkAnchor}
        placement="bottom-start"
        show={linkAnchor !== null}
        onShowChange={(open) => {
          if (!open) {
            closeLinkEditor();
          }
        }}
      >
        <div className="flex items-center gap-1 p-1.5">
          <TextField
            size="sm"
            type="url"
            value={linkHref}
            className="w-44"
            autoComplete="off"
            aria-label={linkUrlLabel}
            placeholder={linkUrlLabel}
            onChange={(event) => {
              const target = event.target;

              if (!(target instanceof HTMLInputElement)) {
                return;
              }

              setLinkHref(target.value);
            }}
          />
          <ActionFooter
            onApply={confirmLink}
            onCancel={closeLinkEditor}
            customProps={{
              cancelButton: { size: "sm" },
              applyButton: {
                size: "sm",
                disabled: !canConfirmLink,
              },
            }}
          />
        </div>
      </Menu>
    </FormField>
  );
}

export default RichTextEditor;
