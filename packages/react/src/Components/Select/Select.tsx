// ** External Imports
import { X } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useRef } from "react";

// ** Local Imports
import { Chip } from "@/Components/Chip";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { Listbox } from "@/Components/Listbox";
import { useSelect } from "@/Components/Select/hooks/useSelect";
import type { SelectProps } from "@/Components/Select/select.types";

function Select(props: SelectProps) {
  const triggerRef = useRef<null | HTMLInputElement | HTMLTextAreaElement>(
    null,
  );

  const {
    maxHeight: _maxHeight,
    disableMaxHeight: _disableMaxHeight,
    ...selectProps
  } = props;

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
    formField,
    clearable,
    clearBind,
    clearValue,
    removeChip,
    triggerBind,
    selectOption,
    containerRef,
    listboxProps,
    clearIconSize,
    mergedClasses,
    selectedOptions,
    handleOpenChange,
  } = useSelect(selectProps, triggerRef);

  return (
    <>
      <FormField field={formField}>
        {multiple ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5">
            {selectedOptions.map((option) => (
              <Chip
                dismissible
                key={String(option.value)}
                size={formField.merged.size}
                disabled={formField.isDisabled}
                customProps={{ clear: clearBind }}
                clearLabel={`Remove ${option.label}`}
                classes={{ root: mergedClasses.chip }}
                onDismiss={(event) => removeChip(option, event)}
              >
                {slots?.chip ? slots.chip({ option }) : option.label}
              </Chip>
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
        {...listboxProps}
        show={open}
        anchorEl={containerRef}
        onSelect={selectOption}
        onShowChange={handleOpenChange}
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
