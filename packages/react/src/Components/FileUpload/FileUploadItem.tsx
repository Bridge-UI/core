// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { Button } from "@/Components/Button";
import { useFileUploadItemContext } from "@/Components/FileUpload/FileUploadContext";
import type { FileUploadItemProps } from "@/Components/FileUpload/fileUpload.types";
import { Icon } from "@/Components/Icon";

function FileUploadItem({
  slots,
  index,
  value,
  remove,
  isImage,
  className,
  metaLabel,
  previewUrl,
  sizeLabel: _sizeLabel,
  ...props
}: FileUploadItemProps) {
  const context = useFileUploadItemContext();
  const itemBind = context.getItemBind(index);
  const start = slots?.start;
  const end = slots?.end;

  return (
    <li {...itemBind} {...props} className={cn(itemBind.className, className)}>
      {isNil(start) ? null : (
        <div className="flex shrink-0 items-center">{start}</div>
      )}

      <div {...context.mediaBind}>
        {isImage && previewUrl ? (
          <img alt="" src={previewUrl} />
        ) : (
          <Icon icon="download" />
        )}
      </div>

      <div {...context.contentBind}>
        <p {...context.titleBind}>{value.name}</p>

        <p {...context.descriptionBind}>{metaLabel}</p>
      </div>

      <div {...context.actionsBind}>
        {isNil(end) ? (
          <Button
            size="sm"
            icon="clear"
            type="button"
            variant="flat"
            density="mini"
            onClick={remove}
            color={context.color}
            rounded={context.rounded}
            disabled={context.disabled}
            aria-label={`Remove ${value.name}`}
          />
        ) : (
          end
        )}
      </div>
    </li>
  );
}

export default FileUploadItem;
