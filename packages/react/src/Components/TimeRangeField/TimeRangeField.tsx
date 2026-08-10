// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useTimeRangeField } from "@/Components/TimeRangeField/hooks/useTimeRangeField";
import type { TimeRangeFieldProps } from "@/Components/TimeRangeField/timeRangeField.types";
import { TimeRangePicker } from "@/Components/TimeRangePicker";

function TimeRangeField(props: TimeRangeFieldProps) {
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
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    timeRangePickerCustomProps,
  } = useTimeRangeField(props);

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
        <TimeRangePicker
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
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showSeconds={timeOnly.showSeconds}
          rounded={formField.merged.rounded}
          disableTimes={timeOnly.disableTimes}
          customProps={timeRangePickerCustomProps}
        />
      </FieldOverlay>
    </>
  );
}

export default TimeRangeField;
