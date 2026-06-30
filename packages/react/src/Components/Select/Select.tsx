// ** External Imports
import { X } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useRef } from "react";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { Listbox } from "@/Components/Listbox";
import { useSelect } from "@/Components/Select/hooks/useSelect";
import type { SelectProps } from "@/Components/Select/select.types";

function Select(props: SelectProps) {
  const triggerRef = useRef<null | HTMLInputElement | HTMLTextAreaElement>(
    null,
  );

  const { maxHeight, disableMaxHeight, ...selectProps } = props;

  const setTriggerRef = (
    element: null | HTMLInputElement | HTMLTextAreaElement,
  ) => {
    triggerRef.current = element;
  };

  const {
    open,
    slots,
    hasValue,
    multiple,
    listboxId,
    formField,
    isLoading,
    clearable,
    clearBind,
    isSelected,
    clearValue,
    removeChip,
    triggerBind,
    selectOption,
    containerRef,
    emptyMessage,
    clearIconSize,
    visibleOptions,
    selectedOptions,
    highlightedIndex,
    hideEmptyMessage,
    handleOpenChange,
  } = useSelect(selectProps, triggerRef);

  return (
    <>
      <FormField field={formField}>
        {multiple ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {selectedOptions.map((option) => (
              <span
                key={String(option.value)}
                className="inline-flex max-w-full items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              >
                {slots?.chip ? (
                  slots.chip({ option })
                ) : (
                  <span className="truncate">{option.label}</span>
                )}

                <span
                  {...clearBind}
                  aria-label={`Remove ${option.label}`}
                  onClick={(event) => removeChip(option, event)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      removeChip(option, event);
                    }
                  }}
                >
                  <Icon icon={X} size={clearIconSize} />
                </span>
              </span>
            ))}

            <textarea
              ref={setTriggerRef}
              {...(triggerBind as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <input
              ref={setTriggerRef}
              {...(triggerBind as InputHTMLAttributes<HTMLInputElement>)}
            />

            {clearable && hasValue && !formField.isDisabled ? (
              <span
                {...clearBind}
                aria-label="Clear selection"
                onClick={() => clearValue()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    clearValue();
                  }
                }}
              >
                <Icon icon={X} size={clearIconSize} />
              </span>
            ) : null}
          </div>
        )}
      </FormField>

      <Listbox
        show={open}
        disableAutoFocus
        loading={isLoading}
        multiple={multiple}
        listboxId={listboxId}
        maxHeight={maxHeight}
        anchorEl={containerRef}
        onSelect={selectOption}
        isSelected={isSelected}
        options={visibleOptions}
        emptyMessage={emptyMessage}
        color={formField.merged.color}
        onShowChange={handleOpenChange}
        labelledBy={formField.controlId}
        invalidated={formField.invalidated}
        disableMaxHeight={disableMaxHeight}
        highlightedIndex={highlightedIndex}
        hideEmptyMessage={hideEmptyMessage}
        slots={{
          empty: slots?.empty,
          option: slots?.option,
          loading: slots?.loading,
          afterOptions: slots?.afterOptions,
          beforeOptions: slots?.beforeOptions,
        }}
      />
    </>
  );
}

export default Select;
