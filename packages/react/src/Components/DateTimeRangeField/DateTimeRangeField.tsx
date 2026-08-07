// ** Local Imports
import type { DateTimeRangeFieldProps } from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import { useDateTimeRangeField } from "@/Components/DateTimeRangeField/hooks/useDateTimeRangeField";
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";

function DateTimeRangeField(props: DateTimeRangeFieldProps) {
  const {
    open,
    daySlot,
    overlay,
    formField,
    inputBind,
    modelValue,
    dateTimeOnly,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateTimeRangePickerCustomProps,
  } = useDateTimeRangeField(props);

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
        <DateTimeRangePicker
          value={modelValue}
          ampm={dateTimeOnly.ampm}
          readOnly={props.readonly}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
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
          orientation={dateTimeOnly.orientation}
          startOfWeek={dateTimeOnly.startOfWeek}
          disableDates={dateTimeOnly.disableDates}
          hideWeekdays={dateTimeOnly.hideWeekdays}
          disableTimes={dateTimeOnly.disableTimes}
          disableYears={dateTimeOnly.disableYears}
          disableMonths={dateTimeOnly.disableMonths}
          customProps={dateTimeRangePickerCustomProps}
          hideOutsideDays={dateTimeOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default DateTimeRangeField;
