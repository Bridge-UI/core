// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";
import { useTimeRangeField } from "@/Components/TimeRangeField/hooks/useTimeRangeField";
import type { TimeRangeFieldProps } from "@/Components/TimeRangeField/timeRangeField.types";
import { TimeRangePicker } from "@/Components/TimeRangePicker";

function TimeRangeField(props: TimeRangeFieldProps) {
  const {
    open,
    timeOnly,
    formField,
    inputBind,
    menuProps,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    timeRangePickerCustomProps,
  } = useTimeRangeField(props);

  return (
    <>
      <FormField field={formField}>
        <input {...inputBind} />
      </FormField>

      <Menu
        show={open}
        closeOnClickAway
        anchorEl={containerRef}
        placement="bottom-start"
        onShowChange={handleOpenChange}
        {...menuProps}
      >
        <TimeRangePicker
          value={modelValue}
          ampm={timeOnly.ampm}
          readOnly={props.readonly}
          maxTime={timeOnly.maxTime}
          minTime={timeOnly.minTime}
          timeZone={timeOnly.timeZone}
          interval={timeOnly.interval}
          onChange={handlePickerChange}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showFooter={timeOnly.showFooter}
          rounded={formField.merged.rounded}
          disableTimes={timeOnly.disableTimes}
          customProps={timeRangePickerCustomProps}
        />
      </Menu>
    </>
  );
}

export default TimeRangeField;
