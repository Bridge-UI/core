// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { useTimeField } from "@/Components/TimeField/hooks/useTimeField";
import type { TimeFieldProps } from "@/Components/TimeField/timeField.types";
import { TimePicker } from "@/Components/TimePicker";

function TimeField(props: TimeFieldProps) {
  const {
    open,
    overlay,
    timeOnly,
    formField,
    inputBind,
    modelValue,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    timePickerCustomProps,
  } = useTimeField(props);

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
        <TimePicker
          value={modelValue}
          ampm={timeOnly.ampm}
          readOnly={props.readonly}
          maxTime={timeOnly.maxTime}
          minTime={timeOnly.minTime}
          timeZone={timeOnly.timeZone}
          interval={timeOnly.interval}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showFooter={timeOnly.showFooter}
          rounded={formField.merged.rounded}
          customProps={timePickerCustomProps}
          disableTimes={timeOnly.disableTimes}
        />
      </FieldOverlay>
    </>
  );
}

export default TimeField;
