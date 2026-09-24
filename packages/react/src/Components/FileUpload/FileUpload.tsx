// ** External Imports
import { isFunction, isNil } from "es-toolkit/compat";
import { type ReactNode } from "react";

// ** Local Imports
import BaseField from "@/Components/BaseField/BaseField";
import { Button } from "@/Components/Button";
import FileUploadContext from "@/Components/FileUpload/FileUploadContext";
import FileUploadItem from "@/Components/FileUpload/FileUploadItem";
import type {
  FileUploadItemSlotProps,
  FileUploadProps,
} from "@/Components/FileUpload/fileUpload.types";
import { useFileUpload } from "@/Components/FileUpload/hooks/useFileUpload";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent } from "@/Utils";

function resolveItemSlot(
  slot: ReactNode | undefined | ((props: FileUploadItemSlotProps) => ReactNode),
  item: FileUploadItemSlotProps,
): ReactNode {
  if (isNil(slot)) {
    return null;
  }

  if (isFunction(slot)) {
    return slot(item);
  }

  return slot;
}

function FileUpload(props: FileUploadProps) {
  const {
    slots,
    merged,
    listBind,
    inputRef,
    baseField,
    inputBind,
    mediaBind,
    titleBind,
    fileItems,
    isDropzone,
    showPicker,
    actionsBind,
    contentBind,
    triggerBind,
    getItemBind,
    buttonLabel,
    dropzoneBind,
    openFileDialog,
    itemDescriptionBind,
  } = useFileUpload(props, {
    size: "md",
    rounded: "md",
    multiple: false,
    color: "primary",
    variant: "button",
  });

  const fileList = hasNamedSlot(slots, "list") ? (
    isFunction(slots?.list) ? (
      slots.list({ items: fileItems })
    ) : null
  ) : fileItems.length > 0 ? (
    <ul {...listBind}>
      {fileItems.map((item) => {
        const itemBind = getItemBind(item.index);

        if (isFunction(slots?.item)) {
          return (
            <li {...itemBind} key={itemBind.key as string}>
              {slots.item(item)}
            </li>
          );
        }

        return (
          <FileUploadItem
            {...item}
            key={itemBind.key as string}
            slots={{
              end: resolveItemSlot(slots?.end, item),
              start: resolveItemSlot(slots?.start, item),
            }}
          />
        );
      })}
    </ul>
  ) : null;

  return (
    <FileUploadContext.Provider
      value={{
        mediaBind,
        titleBind,
        actionsBind,
        contentBind,
        getItemBind,
        color: merged.color,
        rounded: merged.rounded,
        disabled: merged.disabled,
        descriptionBind: itemDescriptionBind,
      }}
    >
      <BaseField field={baseField}>
        <div className="flex w-full flex-col">
          <input {...inputBind} ref={inputRef} />

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
        </div>
      </BaseField>
    </FileUploadContext.Provider>
  );
}

export default FileUpload;
