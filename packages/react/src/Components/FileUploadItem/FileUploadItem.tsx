// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import { Button } from "@/Components/Button";
import type { FileUploadItemProps } from "@/Components/FileUploadItem/fileUploadItem.types";
import { useFileUploadItem } from "@/Components/FileUploadItem/hooks/useFileUploadItem";
import { Icon } from "@/Components/Icon";

function FileUploadItem(props: FileUploadItemProps) {
  const {
    end,
    name,
    media,
    retry,
    start,
    color,
    remove,
    rounded,
    rootBind,
    disabled,
    showRetry,
    mediaBind,
    titleBind,
    contentBind,
    actionsBind,
    statusLabel,
    descriptionBind,
    showDescription,
  } = useFileUploadItem(props);

  return (
    <li {...rootBind}>
      {isNil(start) ? null : (
        <div className="flex shrink-0 items-center">{start}</div>
      )}

      <div {...mediaBind}>
        {media.kind === "image" ? (
          <img alt="" src={media.src} />
        ) : (
          <Icon
            icon={media.icon}
            className={media.spin ? "animate-spin" : undefined}
          />
        )}
      </div>

      <div {...contentBind}>
        <p {...titleBind}>{name}</p>

        {showDescription ? <p {...descriptionBind}>{statusLabel}</p> : null}
      </div>

      <div {...actionsBind}>
        {showRetry ? (
          <Button
            size="sm"
            type="button"
            color="error"
            icon="refresh"
            variant="flat"
            density="mini"
            onClick={retry}
            rounded={rounded}
            disabled={disabled}
            aria-label={`Retry ${name}`}
          />
        ) : null}

        {isNil(end) ? (
          <Button
            size="sm"
            icon="clear"
            type="button"
            color={color}
            variant="flat"
            density="mini"
            onClick={remove}
            rounded={rounded}
            disabled={disabled}
            aria-label={`Remove ${name}`}
          />
        ) : (
          end
        )}
      </div>
    </li>
  );
}

export default FileUploadItem;
