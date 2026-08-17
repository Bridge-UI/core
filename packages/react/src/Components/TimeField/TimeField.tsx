// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useTimeField } from "@/Components/TimeField/hooks/useTimeField";
import type { TimeFieldProps } from "@/Components/TimeField/timeField.types";
import { TimePicker } from "@/Components/TimePicker";

function TimeField(props: TimeFieldProps) {
  const resolveMessage = useResolveMessage();

  const {
    open,
    overlay,
    timeOnly,
    formField,
    inputBind,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    footerSlot,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    timePickerCustomProps,
  } = useTimeField(props);

  return (
    <>
      <FormField field={formField}>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <input {...inputBind} />

          {showClearIcon ? (
            <span
              {...clearBind}
              onClick={() => clearValue()}
              aria-label={resolveMessage("Clear")}
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
                {...props.customProps?.clearIcon}
              />
            </span>
          ) : null}
        </div>
      </FormField>

      <FieldOverlay
        show={open}
        overlay={overlay}
        onShowChange={handleOpenChange}
        customProps={overlayCustomProps}
      >
        <TimePicker
          value={modelValue}
          ampm={timeOnly.ampm}
          showFooter={showFooter}
          readOnly={props.readonly}
          maxTime={timeOnly.maxTime}
          minTime={timeOnly.minTime}
          className={pickerClassName}
          timeZone={timeOnly.timeZone}
          interval={timeOnly.interval}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          error={formField.invalidated}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showSeconds={timeOnly.showSeconds}
          rounded={formField.merged.rounded}
          customProps={timePickerCustomProps}
          disableTimes={timeOnly.disableTimes}
          slots={footerSlot ? { footer: footerSlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default TimeField;
