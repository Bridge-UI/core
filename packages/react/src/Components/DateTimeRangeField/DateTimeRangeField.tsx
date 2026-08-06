// ** Local Imports
import type { DateTimeRangeFieldProps } from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import { useDateTimeRangeField } from "@/Components/DateTimeRangeField/hooks/useDateTimeRangeField";
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

function DateTimeRangeField(props: DateTimeRangeFieldProps) {
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
    dateTimeRangePickerCustomProps,
  } = useDateTimeRangeField(props);

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
        <DateTimeRangePicker
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
          startOfWeek={dateTimeOnly.startOfWeek}
          disableDates={dateTimeOnly.disableDates}
          hideWeekdays={dateTimeOnly.hideWeekdays}
          disableTimes={dateTimeOnly.disableTimes}
          disableYears={dateTimeOnly.disableYears}
          disableMonths={dateTimeOnly.disableMonths}
          customProps={dateTimeRangePickerCustomProps}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </Menu>
    </>
  );
}

export default DateTimeRangeField;
