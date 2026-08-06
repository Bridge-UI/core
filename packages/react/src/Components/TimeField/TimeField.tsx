// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";
import { useTimeField } from "@/Components/TimeField/hooks/useTimeField";
import type { TimeFieldProps } from "@/Components/TimeField/timeField.types";
import { TimePicker } from "@/Components/TimePicker";

function TimeField(props: TimeFieldProps) {
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
    timePickerCustomProps,
  } = useTimeField(props);

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
        <TimePicker
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
          customProps={timePickerCustomProps}
          disableTimes={timeOnly.disableTimes}
        />
      </Menu>
    </>
  );
}

export default TimeField;
