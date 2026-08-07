// ** Local Imports
import type { DateRangeFieldProps } from "@/Components/DateRangeField/dateRangeField.types";
import { useDateRangeField } from "@/Components/DateRangeField/hooks/useDateRangeField";
import { DateRangePicker } from "@/Components/DateRangePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";

function DateRangeField(props: DateRangeFieldProps) {
  const {
    open,
    daySlot,
    overlay,
    dateOnly,
    formField,
    inputBind,
    modelValue,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateRangePickerCustomProps,
  } = useDateRangeField(props);

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
        <DateRangePicker
          value={modelValue}
          readOnly={props.readonly}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          hideYears={dateOnly.hideYears}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showFooter={dateOnly.showFooter}
          hideMonths={dateOnly.hideMonths}
          orientation={dateOnly.orientation}
          startOfWeek={dateOnly.startOfWeek}
          rounded={formField.merged.rounded}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
          customProps={dateRangePickerCustomProps}
          hideOutsideDays={dateOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default DateRangeField;
