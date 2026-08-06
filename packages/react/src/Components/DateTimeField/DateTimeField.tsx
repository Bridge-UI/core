// ** Local Imports
import type { DateTimeFieldProps } from "@/Components/DateTimeField/dateTimeField.types";
import { useDateTimeField } from "@/Components/DateTimeField/hooks/useDateTimeField";
import { DateTimePicker } from "@/Components/DateTimePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

function DateTimeField(props: DateTimeFieldProps) {
  const {
    open,
    daySlot,
    formField,
    inputBind,
    menuProps,
    modelValue,
    dateTimeOnly,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    dateTimePickerCustomProps,
  } = useDateTimeField(props);

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
        <DateTimePicker
          value={modelValue}
          ampm={dateTimeOnly.ampm}
          readOnly={props.readonly}
          onChange={handlePickerChange}
          maxDate={dateTimeOnly.maxDate}
          maxTime={dateTimeOnly.maxTime}
          minDate={dateTimeOnly.minDate}
          minTime={dateTimeOnly.minTime}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          timeZone={dateTimeOnly.timeZone}
          interval={dateTimeOnly.interval}
          hideYears={dateTimeOnly.hideYears}
          rounded={formField.merged.rounded}
          showFooter={dateTimeOnly.showFooter}
          hideMonths={dateTimeOnly.hideMonths}
          defaultView={dateTimeOnly.defaultView}
          startOfWeek={dateTimeOnly.startOfWeek}
          customProps={dateTimePickerCustomProps}
          disableDates={dateTimeOnly.disableDates}
          hideWeekdays={dateTimeOnly.hideWeekdays}
          disableTimes={dateTimeOnly.disableTimes}
          disableYears={dateTimeOnly.disableYears}
          disableMonths={dateTimeOnly.disableMonths}
          hideOutsideDays={dateTimeOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </Menu>
    </>
  );
}

export default DateTimeField;
