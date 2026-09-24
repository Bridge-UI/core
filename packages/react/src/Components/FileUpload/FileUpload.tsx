// ** Local Imports
import { Button } from "@/Components/Button";
import type { FileUploadProps } from "@/Components/FileUpload/fileUpload.types";
import { useFileUpload } from "@/Components/FileUpload/hooks/useFileUpload";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent } from "@/Utils";

function FileUpload(props: FileUploadProps) {
  const {
    slots,
    merged,
    rootBind,
    listBind,
    inputRef,
    labelBind,
    inputBind,
    errorBind,
    mediaBind,
    titleBind,
    fileItems,
    showError,
    isDropzone,
    showPicker,
    actionsBind,
    contentBind,
    triggerBind,
    getItemBind,
    buttonLabel,
    dropzoneBind,
    openFileDialog,
    descriptionBind,
    itemDescriptionBind,
    resolvedErrorMessage,
  } = useFileUpload(props, {
    size: "md",
    rounded: "md",
    multiple: false,
    color: "primary",
    variant: "button",
  });

  const showHelperDescription =
    !showError &&
    !isDropzone &&
    (hasNamedSlot(slots, "description") || isPropPresent(merged.description));

  const fileList =
    fileItems.length > 0 ? (
      <ul {...listBind}>
        {fileItems.map((item) => {
          const itemBind = getItemBind(item.index);

          if (typeof slots?.item === "function") {
            return (
              <li {...itemBind} key={itemBind.key as string}>
                {slots.item(item)}
              </li>
            );
          }

          return (
            <li {...itemBind} key={itemBind.key as string}>
              <div {...mediaBind}>
                {item.isImage && item.previewUrl ? (
                  <img alt="" src={item.previewUrl} />
                ) : (
                  <Icon icon="download" />
                )}
              </div>

              <div {...contentBind}>
                <p {...titleBind}>{item.file.name}</p>
                <p {...itemDescriptionBind}>{item.metaLabel}</p>
              </div>

              <div {...actionsBind}>
                <Button
                  size="sm"
                  icon="clear"
                  type="button"
                  variant="flat"
                  density="mini"
                  color={merged.color}
                  onClick={item.remove}
                  rounded={merged.rounded}
                  disabled={merged.disabled}
                  aria-label={`Remove ${item.file.name}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div {...rootBind}>
      <input {...inputBind} ref={inputRef} />

      {isPropPresent(merged.label) || hasNamedSlot(slots, "label") ? (
        <label {...labelBind}>
          {hasNamedSlot(slots, "label") ? slots?.label : merged.label}
          {merged.required ? (
            <span aria-hidden className="text-error-600 dark:text-error-400">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {showPicker ? (
        isDropzone ? (
          <div {...dropzoneBind}>
            {hasNamedSlot(slots, "dropzone") ? (
              slots?.dropzone
            ) : (
              <>
                <Icon icon="inbox" className="mb-1 text-dark-400" />

                {isPropPresent(merged.title) ? (
                  <p className="m-0 font-medium text-dark-900 dark:text-dark-100">
                    {merged.title}
                  </p>
                ) : null}

                {isPropPresent(merged.description) ? (
                  <p className="m-0 text-sm text-dark-500 dark:text-dark-400">
                    {merged.description}
                  </p>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <div {...triggerBind}>
            {hasNamedSlot(slots, "trigger") ? (
              <span
                role="button"
                onClick={openFileDialog}
                tabIndex={merged.disabled ? -1 : 0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFileDialog();
                  }
                }}
              >
                {slots?.trigger}
              </span>
            ) : (
              <Button
                type="button"
                size={merged.size}
                color={merged.color}
                onClick={openFileDialog}
                rounded={merged.rounded}
                disabled={merged.disabled}
              >
                {buttonLabel}
              </Button>
            )}
          </div>
        )
      ) : null}

      {fileList}

      {showHelperDescription ? (
        <p {...descriptionBind}>
          {hasNamedSlot(slots, "description")
            ? slots?.description
            : merged.description}
        </p>
      ) : null}

      {showError ? (
        <p {...errorBind}>
          {hasNamedSlot(slots, "errorMessage")
            ? slots?.errorMessage
            : resolvedErrorMessage}
        </p>
      ) : null}
    </div>
  );
}

export default FileUpload;
