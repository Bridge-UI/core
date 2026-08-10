// ** External Imports
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useRef } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { AutocompleteProps } from "@/Components/Autocomplete/autocomplete.types";
import { useAutocomplete } from "@/Components/Autocomplete/hooks/useAutocomplete";
import { Chip } from "@/Components/Chip";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { Listbox } from "@/Components/Listbox";
import { mergeNestedComponentProps } from "@/Utils";

function Autocomplete(props: AutocompleteProps) {
  const resolveMessage = useResolveMessage();

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
    multiple,
    children,
    formField,
    clearBind,
    clearValue,
    removeChip,
    triggerBind,
    selectOption,
    containerRef,
    listboxProps,
    clearIconSize,
    mergedClasses,
    showClearIcon,
    selectedOptions,
    handleOpenChange,
  } = useAutocomplete(selectProps, triggerRef);

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
                clearLabel={`Remove ${option.label}`}
                onDismiss={(event) => removeChip(option, event)}
                {...mergeNestedComponentProps(selectProps.customProps?.chip, {
                  customProps: { clear: clearBind },
                  classes: {
                    root: cn({
                      "bg-white ring-1 ring-inset ring-gray-200 dark:bg-gray-700 dark:ring-gray-600": true,
                      [mergedClasses.chip ?? ""]: true,
                    }),
                  },
                })}
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

            {showClearIcon ? (
              <span
                {...clearBind}
                onClick={() => clearValue()}
                aria-label={resolveMessage("Clear selection")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    clearValue();
                  }
                }}
              >
                <Icon
                  icon="clear"
                  size={clearIconSize}
                  {...selectProps.customProps?.clearIcon}
                />
              </span>
            ) : null}
          </div>
        )}
      </FormField>

      <Listbox
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
        {...listboxProps}
      >
        {children}
      </Listbox>
    </>
  );
}

export default Autocomplete;
