// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { useTimeRangeField } from "@/Components/TimeRangeField/hooks/useTimeRangeField";
import type { TimeRangeFieldProps } from "@/Components/TimeRangeField/timeRangeField.types";
import { TimeRangePicker } from "@/Components/TimeRangePicker";

function TimeRangeField(props: TimeRangeFieldProps) {
  const {
    open,
    overlay,
    timeOnly,
    formField,
    inputBind,
    modelValue,
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
        <input {...inputBind} />
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
          showFooter={timeOnly.showFooter}
          rounded={formField.merged.rounded}
          disableTimes={timeOnly.disableTimes}
          customProps={timeRangePickerCustomProps}
        />
      </FieldOverlay>
    </>
  );
}

export default TimeRangeField;
