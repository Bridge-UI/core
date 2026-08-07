// ** Local Imports
import type { DateFieldProps } from "@/Components/DateField/dateField.types";
import { useDateField } from "@/Components/DateField/hooks/useDateField";
import { DatePicker } from "@/Components/DatePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";

function DateField(props: DateFieldProps) {
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
    datePickerCustomProps,
  } = useDateField(props);

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
        <DatePicker
          value={modelValue}
          range={dateOnly.range}
          readOnly={props.readonly}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          multiple={dateOnly.multiple}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          hideYears={dateOnly.hideYears}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showFooter={dateOnly.showFooter}
          hideMonths={dateOnly.hideMonths}
          defaultView={dateOnly.defaultView}
          startOfWeek={dateOnly.startOfWeek}
          rounded={formField.merged.rounded}
          customProps={datePickerCustomProps}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
          hideOutsideDays={dateOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default DateField;
